import { CreateResolversArgs, CreateSchemaCustomizationArgs } from "gatsby";
import fs from "fs";
import svgToTinyDataUri from "mini-svg-data-uri";
import { optimize, OptimizedError, OptimizedSvg } from "svgo";
import { FileSystemNode } from "gatsby-source-filesystem";

function isError(
  result: OptimizedError | OptimizedSvg
): result is OptimizedError {
  return typeof result.error === "string";
}

async function parseSVG(path: string) {
  try {
    const svg = await fs.promises.readFile(path, "utf8");
    const result = optimize(svg, { multipass: true });
    if (isError(result)) {
      console.error("Error optimizing svg", result.error, result.modernError);
      throw result.modernError;
    }
    const encoded = svgToTinyDataUri(result.data);
    return { content: result.data, encoded, path };
  } catch (ex) {
    console.error("error in parse svg", path, ex);
    throw ex;
  }
}

export function createResolvers(args: CreateResolversArgs) {
  const { createResolvers, reporter } = args;
  reporter.verbose("Creating resolvers for svg");
  const resolvers = {
    File: {
      svg: {
        type: "ExtractedSvg",
        async resolve(parent: FileSystemNode) {
          const name = parent.absolutePath.toLowerCase();
          reporter.verbose(`Looking at ${name}`);
          if (name.endsWith(".svg") || name.endsWith(".svg.xml")) {
            return await parseSVG(parent.absolutePath);
          } else {
            return null;
          }
        },
      },
    },
  };
  createResolvers(resolvers);
}

export function createSchemaCustomization(args: CreateSchemaCustomizationArgs) {
  const {
    reporter,
    actions: { createTypes },
  } = args;
  reporter.verbose("Create SVG customization");
  const typeDefs = `
    type ExtractedSvg implements Node {
      content: String!
      encoded: String!
      path: String!
    }
  `;

  createTypes(typeDefs);
}
