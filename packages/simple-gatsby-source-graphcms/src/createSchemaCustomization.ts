import { CreateSchemaCustomizationArgs, GatsbyGraphQLObjectType } from "gatsby";
import {
  ISchemaInformation,
  isSpecialField,
  isSpecialObject,
  isSpecialUnion,
  IPluginOptions,
  SpecialFieldEntry,
  SpecialFieldMap,
} from "./types";
import { createSourcingConfig, getRealType, stateCache } from "./utils";
import { createSchemaCustomization as createToolkitSchemaCustomization } from "@nrandell/gatsby-graphql-source-toolkit";
import { GraphQLObjectType } from "graphql";
import { addRemoteFilePolyfillInterface } from "gatsby-plugin-utils/polyfill-remote-file/index";
import { getGatsbyImageFieldConfig } from "gatsby-plugin-image/graphql-utils";
import { resolveGatsbyImageData } from "./imageHelpers";
import { hasFeature } from "gatsby-plugin-utils/has-feature";

function customiseSchema(
  gatsbyApi: CreateSchemaCustomizationArgs,
  { typePrefix }: IPluginOptions,
  information: ISchemaInformation
): void {
  const { actions } = gatsbyApi;
  const { createTypes } = actions;
  information.gatsbyNodeTypes.forEach(gatsbyNodeType => {
    const realType = information.schema.getType(
      gatsbyNodeType.remoteTypeName
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
  specialsFieldsEntries: ReadonlyArray<SpecialFieldEntry>
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
            createTypes(`type ${typePrefix}${fieldType} {
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
        entry.value
      );
    }
  });
  if (additions.length > 0) {
    createTypes(`type ${typePrefix}${typeName} ${
      isTopLevel ? "implements Node" : ""
    } {
      ${additions}
    }`);
  }
}
function walkSpecialFieldsMap(
  gatsbyApi: CreateSchemaCustomizationArgs,
  pluginOptions: IPluginOptions,
  isTopLevel: boolean,
  specialsFieldsMap: SpecialFieldMap
): void {
  specialsFieldsMap.forEach((fields, typeName) => {
    walkSpecialFieldsEntries(
      gatsbyApi,
      pluginOptions,
      isTopLevel,
      typeName,
      fields
    );
  });
}

export async function createSchemaCustomization(
  gatsbyApi: CreateSchemaCustomizationArgs,
  pluginOptions: IPluginOptions
): Promise<void> {
  const { buildMarkdownNodes, typePrefix, enableImageCDN } = pluginOptions;
  const { schema, actions, reporter, store } = gatsbyApi;
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
    pluginOptions
  );
  customiseSchema(gatsbyApi, pluginOptions, schemaConfig);
  await createToolkitSchemaCustomization(config);

  const wrapper = enableImageCDN
    ? addRemoteFilePolyfillInterface
    : (x: GatsbyGraphQLObjectType): GatsbyGraphQLObjectType => x;

  const assetType = wrapper(
    schema.buildObjectType({
      name: `${typePrefix}Asset`,
      fields: {
        ...(enableImageCDN
          ? {
              gatsbyImageData: {
                ...getGatsbyImageFieldConfig(async (...args) =>
                  resolveGatsbyImageData(...args, gatsbyApi)
                ),
                type: hasFeature("graphql-typegen")
                  ? "GatsbyImageData"
                  : "JSON",
              },
              placeholderUrl: {
                type: "String",
              },
            }
          : {}),
        localFile: {
          type: "File",
          extensions: {
            link: {
              from: "localFile",
            },
          },
        },
      },
      interfaces: ["Node", "RemoteFile"],
    }),
    { schema, actions, store }
  );
  createTypes(assetType);

  // if (downloadAllAssets) {
  //   createTypes(`type ${typePrefix}Asset implements Node {
  //   localFile: File @link
  // }`);
  // }

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
