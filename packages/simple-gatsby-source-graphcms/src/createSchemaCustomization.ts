import { CreateSchemaCustomizationArgs } from "gatsby";
import { createSchemaCustomization as createToolkitSchemaCustomization } from "gatsby-graphql-source-toolkit";
import { getGatsbyImageFieldConfig } from "gatsby-plugin-image/graphql-utils";
import { hasFeature } from "gatsby-plugin-utils/has-feature";
import { GraphQLObjectType } from "graphql";
import { resolveGatsbyImageData } from "./imageHelpers";
import {
  IPluginOptions,
  ISchemaInformation,
  SpecialFieldEntry,
  SpecialFieldMap,
  isSpecialField,
  isSpecialObject,
  isSpecialUnion,
} from "./types";
import { createSourcingConfig, getRealType, stateCache } from "./utils";

function customiseSchema(
  gatsbyApi: CreateSchemaCustomizationArgs,
  { typePrefix }: IPluginOptions,
  information: ISchemaInformation,
): void {
  const { actions } = gatsbyApi;
  const { createTypes } = actions;
  information.gatsbyNodeTypes.forEach(gatsbyNodeType => {
    const realType = information.schema.getType(
      gatsbyNodeType.remoteTypeName,
    ) as GraphQLObjectType;
    const hasLocaleField = realType.getFields().locale;
    createTypes(`type ${typePrefix}${
      gatsbyNodeType.remoteTypeName
    } implements Node {
        updatedAt: Date! @dateformat
        createdAt: Date! @dateformat
        publishedAt: Date @dateformat
        ${hasLocaleField ? `actualLocale: ${typePrefix}Locale!` : ""}
        actualStage: ${typePrefix}Stage!
      }`);
  });
}

function walkSpecialFieldsEntries(
  gatsbyApi: CreateSchemaCustomizationArgs,
  pluginOptions: IPluginOptions,
  isTopLevel: boolean,
  typeName: string,
  specialsFieldsEntries: ReadonlyArray<SpecialFieldEntry>,
): void {
  const { typePrefix } = pluginOptions;
  const {
    actions: { createTypes },
  } = gatsbyApi;
  const additions: Array<string> = [];
  specialsFieldsEntries.forEach(entry => {
    if (isSpecialField(entry)) {
      switch (entry.type) {
        case "Markdown":
          additions.push(`${entry.field.name}MarkdownNode: ${typePrefix}MarkdownNode @link
          `);
          break;
        case "RichText":
          {
            const valueType = entry.field.type as GraphQLObjectType;
            const fieldType = getRealType(valueType);
            createTypes(`type ${typePrefix}${fieldType.toString()} {
            cleaned: JSON
          }`);
          }
          break;
      }
    } else if (isSpecialUnion(entry)) {
      walkSpecialFieldsMap(gatsbyApi, pluginOptions, false, entry.value);
    } else if (isSpecialObject(entry)) {
      walkSpecialFieldsEntries(
        gatsbyApi,
        pluginOptions,
        false,
        typeName,
        entry.value,
      );
    }
  });
  if (additions.length > 0) {
    createTypes(`type ${typePrefix}${typeName} ${
      isTopLevel ? "implements Node" : ""
    } {
      ${additions.join(",")}
    }`);
  }
}
function walkSpecialFieldsMap(
  gatsbyApi: CreateSchemaCustomizationArgs,
  pluginOptions: IPluginOptions,
  isTopLevel: boolean,
  specialsFieldsMap: SpecialFieldMap,
): void {
  specialsFieldsMap.forEach((fields, typeName) => {
    walkSpecialFieldsEntries(
      gatsbyApi,
      pluginOptions,
      isTopLevel,
      typeName,
      fields,
    );
  });
}

export async function createSchemaCustomization(
  gatsbyApi: CreateSchemaCustomizationArgs,
  pluginOptions: IPluginOptions,
): Promise<void> {
  const { buildMarkdownNodes, typePrefix } = pluginOptions;
  const { schema, actions, reporter } = gatsbyApi;
  const { createTypes } = actions;

  const schemaConfig = stateCache.schemaInformation;
  if (!schemaConfig) {
    return reporter.panic("No schema configuration");
  }

  const specialFields = stateCache.specialFields;
  if (!specialFields) {
    return reporter.panic("No special fields");
  }

  const config = await createSourcingConfig(
    schemaConfig,
    gatsbyApi,
    pluginOptions,
  );
  customiseSchema(gatsbyApi, pluginOptions, schemaConfig);
  await createToolkitSchemaCustomization(config);

  const objectType = schema.buildObjectType({
    name: `${typePrefix}Asset`,
    fields: {
      gatsbyImageData: {
        ...getGatsbyImageFieldConfig(async (...args) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          resolveGatsbyImageData(...args, gatsbyApi),
        ),
        type: hasFeature("graphql-typegen") ? "GatsbyImageData" : "JSON",
      },
      placeholderUrl: {
        type: "String",
      },
      localFile: {
        type: "File",
        extensions: {
          link: {
            from: "fields.localFile",
          },
        },
      },
    },
    interfaces: ["Node"],
  });

  const assetType = objectType;

  createTypes(assetType);

  if (buildMarkdownNodes) {
    createTypes(`
        type ${typePrefix}MarkdownNode implements Node {
          id: ID!
        }
      `);

    createTypes(`type ${typePrefix}RichText {
        markdownNode: ${typePrefix}MarkdownNode @link
      }`);
  }

  walkSpecialFieldsMap(gatsbyApi, pluginOptions, true, specialFields);
  return undefined;
}
