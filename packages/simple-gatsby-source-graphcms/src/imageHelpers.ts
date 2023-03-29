import { CreateSchemaCustomizationArgs } from "gatsby";
import { IGatsbyImageData, IImage, ImageFormat } from "gatsby-plugin-image";
import type { GraphQLResolveInfo } from "gatsby/graphql";
import { IGatsbyImageFieldArgs } from "gatsby-plugin-image/graphql-utils";
import { GraphCMS_Asset } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
function getBasicImageProps(
  image: GraphCMS_Asset,
  args: any
): {
  baseUrl: any;
  contentType: any;
  aspectRatio: number;
  width: any;
  height: any;
} {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  let aspectRatio;
  if (args.width && args.height) {
    aspectRatio = args.width / args.height;
  } else if (image.width && image.height) {
    aspectRatio = image.width / image.height;
  } else {
    aspectRatio = 1;
  }

  return {
    baseUrl: image.url,
    contentType: image.mimeType,
    aspectRatio,
    width: image.width,
    height: image.height,
  };
}

function generateImageSource(
  filename: string,
  width: number,
  height: number,
  format: ImageFormat
  //   fit?: Fit,
  //   options?: Record<string, unknown>
): IImage {
  const src = `https://media.graphassets.com/${filename}`;
  return { width, height, format, src };
}

export async function resolveGatsbyImageData<TContext, TArgs>(
  image: GraphCMS_Asset,
  options: TArgs & IGatsbyImageFieldArgs,
  _context: TContext,
  _info: GraphQLResolveInfo,
  { reporter }: CreateSchemaCustomizationArgs
): Promise<IGatsbyImageData> {
  reporter.info(
    `resolveGatsbyImageData(${JSON.stringify(image)}, ${JSON.stringify(
      options
    )})`
  );

  const { generateImageData } = await import(`gatsby-plugin-image`);

  const { getPluginOptions, doMergeDefaults } = await import(
    // @ts-ignore No file
    `gatsby-plugin-sharp/plugin-options`
  );

  const sharpOptions = getPluginOptions();

  const defaults = {
    tracedSVGOptions: {},
    blurredOptions: {},
    jpgOptions: {},
    pngOptions: {},
    webpOptions: {},
    gifOptions: {},
    avifOptions: {},
    quality: 50,
    placeholder: `dominantColor`,
    ...sharpOptions.userDefaults,
  };

  const allOptions = doMergeDefaults(options, defaults);
  if (allOptions.placeholder === "tracedSVG") {
    allOptions.placeholder = "dominantColor";
  }

  const { baseUrl, contentType, width, height } = getBasicImageProps(
    image,
    allOptions
  );

  let [, format] = contentType.split(`/`);
  if (format === `jpeg`) {
    format = `jpg`;
  }

  const imageProps = generateImageData({
    ...allOptions,
    pluginName: "@bond-london/simple-gatsby-source-graphcms",
    sourceMetadata: { width, height, format },
    filename: baseUrl,
    generateImageSource,
    options: allOptions,
  });

  if (options.placeholder === `dominantColor`) {
    imageProps.backgroundColor = "rgba(0,0,0,0.5)";
  }

  let placeholderDataURI = null;

  if (options.placeholder === `blurred`) {
    placeholderDataURI = "rgba(0,0,0,0.5)";
  }

  if (placeholderDataURI) {
    imageProps.placeholder = { fallback: placeholderDataURI };
  }

  reporter.info(`Returning ${JSON.stringify(imageProps)}`);
  return imageProps;
}
