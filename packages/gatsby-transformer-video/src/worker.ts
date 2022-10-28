import pathToFfmpeg from "ffmpeg-static";

import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import reporter from "gatsby-cli/lib/reporter";
import { createContentDigest } from "gatsby-core-utils";
import { join } from "path";
import { rename } from "fs-extra";
import sharp from "sharp";
import { videoCache } from "./onPluginInit";
import { ITransformedVideoInformation } from "./types";

function createCommandForVideo(videoPath: string): FfmpegCommand {
  const command = ffmpeg({ source: videoPath, logger: console });
  if (!pathToFfmpeg) {
    throw new Error("No ffmpeg installed");
  }
  command.setFfmpegPath(pathToFfmpeg);
  return command;
}

interface IProgressInformation {
  frames: number;
  currentFps: number;
  currentKbps: number;
  targetSize: number;
  timemark: number;
  percent: number;
}

async function runFfmpeg(
  input: string,
  output: string,
  options: Array<string>,
  label: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let lastPercent = 0;
    const activity = reporter.createProgress(label, 100);
    const command = createCommandForVideo(input)
      .addOutputOption(options)
      .on("start", reporter.info)
      .on("error", args => {
        activity.setStatus("Errored");
        activity.end();
        reject(args);
      })
      .on("end", () => {
        activity.setStatus("Completed");
        activity.end();
        resolve();
      })
      .on("progress", (progress: IProgressInformation) => {
        const percent = Math.floor(progress.percent);
        if (percent > lastPercent) {
          const delta = percent - lastPercent;
          activity.tick(delta);
          lastPercent = percent;
        }
      })
      .output(output);
    command.run();
  });
}

export async function workerTransformVideo(
  inputName: string,
  instances: Array<{
    output: string;
    options: Array<string>;
    label: string;
  }>
): Promise<void> {
  reporter.verbose(
    `Transforming video "${inputName}" (${instances.length} instances)`
  );
  for (const instance of instances) {
    reporter.verbose(`Running ffmpeg for "${inputName}" ${instance.label}`);
    await runFfmpeg(
      inputName,
      instance.output,
      instance.options,
      instance.label
    );
    reporter.verbose(
      `Finished running ffmpeg for "${inputName}" ${instance.label}`
    );
  }
  reporter.verbose(
    `Finished transforming video "${inputName}" (${instances.length} instances)`
  );
}

export interface ISourceVideo {
  pathname: string;
  width: number;
  height: number;
}

export function createScreenshotOptions(): Array<string> {
  return ["-vframes 1"];
}
export function createWebmVideoTransform(targetWidth?: number): Array<string> {
  return [
    "-c:v libvpx-vp9",
    "-pix_fmt yuv420p",
    "-crf 40",
    targetWidth ? `-vf scale='min(${targetWidth},iw)':-2` : `-vf scale=0:0`,
    "-deadline best",
    "-c:a libvorbis",
  ];
}

export function createMp4VideoTransform(targetWidth?: number): Array<string> {
  return [
    "-c:v libx265",
    "-pix_fmt yuv420p",
    "-crf 32",
    targetWidth ? `-vf scale='min(${targetWidth},iw)':-2` : `-vf scale=0:0`,
    "-preset veryslow",
    "-tag:v hvc1",
    "-movflags",
    "faststart",
    "-c:a aac",
  ];
}

function createLabel(
  name: string,
  targetWidth: number | undefined,
  stage: string
): string {
  const widthInfo = targetWidth ? ` (width ${targetWidth})` : "";
  return `${stage}: ${name}${widthInfo}`;
}

function rgbToHex(red: number, green: number, blue: number): string {
  return `#${(blue | (green << 8) | (red << 16) | (1 << 24))
    .toString(16)
    .slice(1)}`;
}

async function runVideoTransform(
  inputName: string,
  name: string,
  targetWidth: number | undefined,
  publicDir: string,
  inputDigest: string,
  key: string,
  ext: string,
  options: Array<string>
): Promise<string> {
  const label = createLabel(name, targetWidth, key);
  const digestObject = {
    parent: inputDigest,
    options,
    label,
    key,
  };

  const digest = createContentDigest(digestObject);
  const outputName = `${name}-${digest}${ext}`;
  const publicFile = join(publicDir, outputName);
  reporter.verbose(`${label}: Transforming video (${outputName})`);

  try {
    const exists = await videoCache.getFromCache(
      outputName,
      publicFile,
      reporter
    );
    if (exists) {
      reporter.verbose(`${label}: Used already cached file (${outputName})`);
      return outputName;
    }
  } catch (err) {
    reporter.verbose(
      `${label}: Failed to get ${outputName} from cache (${err})`
    );
  }

  const tempName = `temp-${outputName}`;
  const tempPublicFile = join(publicDir, tempName);
  reporter.info(`${label}: Using ffmpeg to create ${outputName}`);
  await runFfmpeg(inputName, tempPublicFile, options, label);
  reporter.info(`${label}: Used ffmpeg to create ${outputName}`);
  await rename(tempPublicFile, publicFile);
  await videoCache.addToCache(publicFile, outputName);
  reporter.verbose(`${label}: Created and added ${outputName} to cache`);
  return outputName;
}

export async function transformVideo(
  inputName: string,
  name: string,
  publicDir: string,
  inputDigest: string,
  targetWidth?: number
): Promise<ITransformedVideoInformation> {
  const mp4Name = await runVideoTransform(
    inputName,
    name,
    targetWidth,
    publicDir,
    inputDigest,
    "mp4",
    ".mp4",
    createMp4VideoTransform(targetWidth)
  );
  const webmName = await runVideoTransform(
    inputName,
    name,
    targetWidth,
    publicDir,
    inputDigest,
    "webm",
    ".webm",
    createWebmVideoTransform(targetWidth)
  );

  const webmFile = join(publicDir, webmName);
  const posterName = await runVideoTransform(
    webmFile,
    name,
    targetWidth,
    publicDir,
    inputDigest,
    "poster",
    ".jpg",
    createScreenshotOptions()
  );

  const posterFile = join(publicDir, posterName);

  const { dominant } = await sharp(posterFile)
    .resize(200, 200, { fit: "inside", withoutEnlargement: true })
    .stats();
  const dominantColour = dominant
    ? rgbToHex(dominant.r, dominant.g, dominant.b)
    : "#000000";

  return { mp4Name, webmName, posterName, dominantColour };
}
