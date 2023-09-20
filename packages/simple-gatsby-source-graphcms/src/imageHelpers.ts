import { CreateSchemaCustomizationArgs } from "gatsby";
import {
  Fit,
  IGatsbyImageData,
  IGatsbyImageHelperArgs,
  IImage,
  ImageFormat,
  generateImageData,
  getLowResolutionImageURL,
} from "gatsby-plugin-image";
import { IGatsbyImageFieldArgs } from "gatsby-plugin-image/graphql-utils";
import type { GraphQLResolveInfo } from "gatsby/graphql";
// eslint-disable-next-line camelcase
import { readFile } from "fs/promises";
import { fetchRemoteFile } from "gatsby-core-utils/fetch-remote-file";
import { extname } from "path";
// eslint-disable-next-line camelcase
import { GraphCMS_Asset, IImageOptions } from "./types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore No plugin sharp
import { getDominantColor } from "gatsby-plugin-sharp";

function generateImageSource(
  handle: string,
  width: number,
  height: number,
  format: ImageFormat,
  fit?: Fit,
  options?: IImageOptions,
): IImage {
  if (!Number.isFinite(height)) height = width;
  const args = ["https://media.graphassets.com"];
  if (width || height) {
    let filestackFit = "crop";
    switch (fit) {
      case "contain":
        filestackFit = "clip";
        break;

      case "fill":
      case "inside":
      case "outside":
      case "cover":
        filestackFit = "crop";
        break;
    }

    args.push(
      `resize=${Number.isFinite(width) && width > 0 ? `w:${width},` : ""}${
        Number.isFinite(height) && height > 0 ? `h:${height},` : ""
      }${options?.align ? `a:${options.align},` : ""}${
        options?.filter ? `ft:${options.filter},` : ""
      }f:${filestackFit}`,
    );
  }
  if (options?.crop) {
    args.push(`crop=d:${options.crop}`);
  }

  let filestackFormat: ImageFormat;
  switch (format) {
    case "auto":
      filestackFormat = "auto";
      args.push("auto_image");
      break;
    case "avif":
    case "webp":
      filestackFormat = "webp";
      args.push("output=f:webp");
      break;
    case "jpg":
      filestackFormat = "jpg";
      args.push("output=f:jpg");
      break;
    default:
      filestackFormat = "png";
      args.push("output=f:png");
      break;
  }

  args.push(handle);
  const src = args.join("/");
  // console.log({ handle, width, height, format, src });

  return { width, height, format: filestackFormat, src };
}

function getBase64DataURI(imageBase64: string): string {
  return `data:image/png;base64,${imageBase64}`;
}

let haveWarnedAboutPlaceholder = false;

function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/") && mimeType.indexOf("/svg") === -1;
}

export async function resolveGatsbyImageData<TContext, TArgs>(
  // eslint-disable-next-line camelcase
  image: GraphCMS_Asset,
  options: TArgs & IGatsbyImageFieldArgs,
  _context: TContext,
  _info: GraphQLResolveInfo,
  { reporter, cache }: CreateSchemaCustomizationArgs,
): Promise<IGatsbyImageData | null> {
  if (!isImage(image.mimeType)) return null;

  let format = image.mimeType.split("/")[1];
  if (format === "jpeg") {
    format = "jpg";
  }

  const sourceMetadata = {
    width: image.width!,
    height: image.height!,
    format: format as ImageFormat,
  };

  const filename = image.handle;

  /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
  const { getPluginOptions, doMergeDefaults } = await import(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Ignore plugin sharp
    `gatsby-plugin-sharp/plugin-options`
  );

  const sharpOptions = getPluginOptions();

  const userDefaults = sharpOptions.defaults;

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
    ...userDefaults,
  };

  options = doMergeDefaults(options, defaults);
  /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */

  if (options.placeholder && options.placeholder === "tracedSVG") {
    if (!haveWarnedAboutPlaceholder) {
      reporter.warn("Does not support tracedSVG");
      haveWarnedAboutPlaceholder = true;
    }
    options.placeholder = "dominantColor";
  }

  const imageDataArgs: IGatsbyImageHelperArgs = {
    ...options,
    pluginName: "simple-gatsby-source-graphcms",
    sourceMetadata,
    filename,
    generateImageSource,
    options,
  };

  const imageData = generateImageData(imageDataArgs);

  if (
    options.placeholder === "blurred" ||
    options.placeholder == "dominantColor"
  ) {
    const lowResImageUrl = getLowResolutionImageURL(imageDataArgs, 20);
    const filePath = await fetchRemoteFile({
      url: lowResImageUrl,
      name: image.handle,
      directory: cache.directory,
      ext: extname(image.fileName),
      cacheKey: image.internal.contentDigest,
    });

    if (options.placeholder === "blurred") {
      const buffer = await readFile(filePath);
      const base64 = buffer.toString("base64");

      imageData.placeholder = {
        fallback: getBase64DataURI(base64),
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      imageData.backgroundColor = await getDominantColor(filePath);
    }
  }
  return imageData;
}
