import { NodePluginArgs, ParentSpanPluginArgs, Reporter } from "gatsby";
import { loadSchema } from "gatsby-graphql-source-toolkit";
import {
  ISchemaInformation,
  IPluginOptions,
  SpecialFieldEntry,
  SpecialFieldMap,
} from "./types";
import { createExecutor, getRealType, stateCache } from "./utils";
import {
  GraphQLType,
  GraphQLAbstractType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  isScalarType,
  isEnumType,
  isUnionType,
  isObjectType,
} from "graphql";
import { IGatsbyNodeConfig } from "gatsby-graphql-source-toolkit/dist/types";
import { isGatsbyNodeLifecycleSupported } from "gatsby-plugin-utils";

const specialNames = new Set(["stage", "locale", "localizations"]);

async function retrieveSchema(
  gatsbyApi: NodePluginArgs,
  pluginOptions: IPluginOptions
): Promise<ISchemaInformation> {
  const { locales, stages } = pluginOptions;
  const execute = createExecutor(gatsbyApi, pluginOptions);
  const schema = await loadSchema(execute);

  const nodeInterface = schema.getType("Node") as GraphQLAbstractType;
  const query = schema.getType("Query") as GraphQLInterfaceType;
  const queryFields = query.getFields();
  const possibleTypes = schema.getPossibleTypes(nodeInterface);

  const pluralRootFieldName = (type: GraphQLObjectType): string | undefined =>
    Object.keys(queryFields).find(
      fieldName => String(queryFields[fieldName].type) === `[${type.name}!]!`
    );

  const hasLocaleField = (type: GraphQLObjectType): boolean =>
    type.getFields().locale ? true : false;

  const gatsbyNodeTypes: Array<IGatsbyNodeConfig> = possibleTypes.map(type => {
    const plural = pluralRootFieldName(type);

    const config: IGatsbyNodeConfig = {
      remoteTypeName: type.name,
      queries: [
        ...locales.map(locale => {
          const localeLabel = locale.replace("_", "");
          return stages.map(
            stage => `
            query LIST_${plural}_${localeLabel}_${stage} { ${plural}(first: $limit, ${
              hasLocaleField(type) ? `locales: [${locale}, ${locales[0]}]` : ""
            }, skip: $offset, stage: ${stage}) {
                ..._${type.name}Id_
              }
            }`
          );
        }),
        `fragment _${type.name}Id_ on ${type.name} {
          __typename
          id${
            hasLocaleField(type)
              ? `
          locale`
              : ""
          }
          stage
        }`,
      ].join("\n"),
      nodeQueryVariables: ({ id, locale, stage }) => {
        return {
          where: { id },
          locales: [locale],
          stage,
        };
      },
    };
    return config;
  });

  return { schema, gatsbyNodeTypes };
}

function calculatePluginInit(): "stable" | "unstable" | "unsupported" {
  try {
    if (isGatsbyNodeLifecycleSupported("onPluginInit")) {
      return "stable";
    }
    return "unstable";
  } catch (e) {
    console.error("Failed to check onPluginInit lifecycle", e);
  }
  return "unsupported";
}

function isRichTextField(type: GraphQLType): boolean {
  const name = type?.toString();
  return name?.endsWith("RichText");
}

function isAssetField(type: GraphQLType): boolean {
  const name = type?.toString();
  return name === "Asset";
}

function isMarkdownField(
  fieldName: string | undefined,
  markdownFields: Array<string> | undefined
): boolean {
  if (markdownFields && fieldName) {
    return markdownFields.includes(fieldName);
  }
  return false;
}

function walkType(
  type: GraphQLObjectType,
  markdownFieldsMap: { [key: string]: Array<string> },
  knownTypes: Set<string>,
  reporter: Reporter,
  topLevelTypeName: string
): Array<SpecialFieldEntry> | undefined {
  const specialFields: Array<SpecialFieldEntry> = [];

  const typeMarkdownFields = markdownFieldsMap[type.name];
  Object.entries(type.getFields()).forEach(([fieldName, field]) => {
    if (specialNames.has(fieldName)) {
      return;
    }
    const valueType = field.type as GraphQLObjectType;
    const fieldType = getRealType(valueType);
    const isScalar = isScalarType(fieldType);
    const isEnum = isEnumType(fieldType);

    const fieldTypeName = fieldType?.toString();
    const isKnown =
      knownTypes.has(fieldTypeName) || fieldTypeName === type.name;

    if (isRichTextField(fieldType)) {
      specialFields.push({ fieldName, type: "RichText", field });
    } else if (isAssetField(fieldType)) {
      specialFields.push({ fieldName, type: "Asset", field });
    } else if (isMarkdownField(fieldName, typeMarkdownFields)) {
      specialFields.push({ fieldName, type: "Markdown", field });
    } else if (!isKnown && isUnionType(fieldType)) {
      const map: SpecialFieldMap = new Map();
      const containedTypes = fieldType.getTypes();
      containedTypes.forEach(containedType => {
        const unionFieldType = getRealType(containedType);
        if (isObjectType(unionFieldType)) {
          const isContainedKnown =
            knownTypes.has(unionFieldType.name) ||
            unionFieldType.name === type.name;
          if (!isContainedKnown) {
            const entries = walkType(
              containedType,
              markdownFieldsMap,
              knownTypes,
              reporter,
              topLevelTypeName
            );
            if (entries) {
              map.set(containedType.name, entries);
            }
          }
        }
      });
      if (map.size > 0) {
        specialFields.push({ fieldName, type: "Union", value: map });
      }
    } else if (!isKnown && isObjectType(fieldType)) {
      const entries = walkType(
        fieldType,
        markdownFieldsMap,
        knownTypes,
        reporter,
        topLevelTypeName
      );
      if (entries) {
        specialFields.push({ fieldName, type: "Object", value: entries });
      }
    } else if (!isKnown && !isScalar && !isEnum) {
      reporter.warn(
        `What to do with field ${fieldName}: (${fieldType}) ${fieldName} (known ${isKnown}, isScalar ${isScalar}, isEnum ${isEnum}, isObject ${isObjectType(
          fieldType
        )})`
      );
    }
  });
  if (specialFields.length > 0) {
    return specialFields;
  }

  return undefined;
}

function walkNodesToFindImportantFields(
  { schema }: ISchemaInformation,
  markdownFieldsMap: { [key: string]: Array<string> },
  reporter: Reporter
): Map<string, Array<SpecialFieldEntry>> {
  const nodeInterface = schema.getType("Node") as GraphQLAbstractType;
  const possibleTypes = schema.getPossibleTypes(nodeInterface);
  const knownTypes = new Set(possibleTypes.map(t => t.name));

  const specialFieldsMap = new Map<string, Array<SpecialFieldEntry>>();

  possibleTypes.forEach(type => {
    const entries = walkType(
      type,
      markdownFieldsMap,
      knownTypes,
      reporter,
      type.name
    );
    if (entries) {
      specialFieldsMap.set(type.name, entries);
    }
  });

  return specialFieldsMap;
}

async function initializeGlobalState(
  args: ParentSpanPluginArgs,
  options: IPluginOptions
): Promise<void> {
  const { reporter } = args;
  const { stages } = options;
  const defaultStage = stages[0];
  if (defaultStage) {
    reporter.verbose(`using default GraphCMS stage: ${defaultStage}`);
  } else {
    reporter.panic(`no default stage for GraphCMS`);
  }

  const schemaInformation = await retrieveSchema(args, options);

  stateCache.schemaInformation = schemaInformation;
  stateCache.specialFields = walkNodesToFindImportantFields(
    schemaInformation,
    options.markdownFields,
    reporter
  );
}

const pluginInitSupport = calculatePluginInit();
switch (pluginInitSupport) {
  case "stable":
    exports.onPluginInit = initializeGlobalState;
    break;
  case "unstable":
    exports.unstable_onPluginInit = initializeGlobalState;
    break;
  case "unsupported":
    exports.onPreBootstrap = initializeGlobalState;
    break;
}
