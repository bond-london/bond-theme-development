import { join, dirname, basename } from "path";
import { ensureDir, rename } from "fs-extra";

import type { Actions, NodePluginArgs, Reporter } from "gatsby";
import { IGatsbyVideoInformation } from "./types";
import { videoCache } from "./onPluginInit";
import {
  ISingleVideoProcessingArgs,
  IVideoProcessingArgs,
  VIDEO_PROCESSING_JOB_NAME,
  VIDEO_INFORMATION_JOB_NAME,
} from "./gatsby-worker";
import { FfprobeData } from "fluent-ffmpeg";

let actions: Actions;

export function setActions(_actions: Actions): void {
  actions = _actions;
}

function createVideoInformationJob(
  inputFileName: string,
  reporter: Reporter
): Promise<FfprobeData> {
  if (!actions) {
    return reporter.panic("Actions are not setup");
  }

  const result = actions.createJobV2({
    name: VIDEO_INFORMATION_JOB_NAME,
    inputPaths: [inputFileName],
    outputDir: dirname(inputFileName),
    args: {},
  });
  return result as Promise<FfprobeData>;
}

function createVideoProcessingJob(
  inputFileName: string,
  outputDir: string,
  args: IVideoProcessingArgs,
  reporter: Reporter
): Promise<void> {
  if (!actions) {
    return reporter.panic("Actions are not setup");
  }

  const result = actions.createJobV2({
    name: VIDEO_PROCESSING_JOB_NAME,
    inputPaths: [inputFileName],
    outputDir,
    args: args as unknown as Record<string, unknown>,
  });
  return result as Promise<void>;
}

export async function getVideoInformation(
  videoPath: string,
  reporter: Reporter
): Promise<IGatsbyVideoInformation> {
  const data = await createVideoInformationJob(videoPath, reporter);
  const videoStream = data.streams.find(s => s.codec_type === "video");
  const audioStream = data.streams.find(s => s.codec_type === "audio");
  if (!videoStream) {
    throw new Error(`Failed to find video stream in ${videoPath}`);
  }
  if (!videoStream.width || !videoStream.height || !videoStream.duration) {
    throw new Error(`Video is empty for ${videoPath}`);
  }
  return {
    width: videoStream.width,
    height: videoStream.height,
    duration: videoStream.duration,
    hasAudio: !!audioStream,
  };
}

export function createScreenshotOptions(): Array<string> {
  return ["-vframes 1"];
}
export function createWebmVideoTransform(
  targetWidth?: number,
  muted?: boolean
): Array<string> {
  return [
    "-c:v libvpx-vp9",
    "-crf 40",
    targetWidth ? `-vf scale='min(${targetWidth},iw)':-2` : `-vf scale=0:0`,
    "-deadline best",
    muted ? "-an" : "-c:a libvorbis",
  ];
}

export function createMp4VideoTransform(
  targetWidth?: number,
  muted?: boolean
): Array<string> {
  return [
    "-c:v libx265",
    "-pix_fmt yuv420p",
    "-crf 32",
    targetWidth ? `-vf scale='min(${targetWidth},iw)':-2` : `-vf scale=0:0`,
    "-preset veryslow",
    "-tag:v hvc1",
    "-movflags",
    "faststart",
    muted ? "-an" : "-c:a aac",
  ];
}

interface IJobInfo {
  tempPublicFile: string;
  publicFile: string;
  outputName: string;
  publicRelativeUrl: string;
  key: string;
}
export async function transformVideo(
  args: NodePluginArgs,
  inputName: string,
  inputDigest: string,
  name: string,
  videos: Array<{
    key: string;
    ext: string;
    options: Array<string>;
    label: string;
  }>
): Promise<{
  [key: string]: { publicFile: string; publicRelativeUrl: string };
}> {
  const { reporter, createContentDigest, pathPrefix } = args;
  const instances: Array<ISingleVideoProcessingArgs> = [];
  const jobInfo: Array<IJobInfo> = [];
  const results: {
    [key: string]: { publicFile: string; publicRelativeUrl: string };
  } = {};

  const inputFileName = basename(inputName);
  const publicDir = join(process.cwd(), "public", "static", inputDigest);
  await ensureDir(publicDir);
  for (const { key, ext, options, label } of videos) {
    const digestObject = {
      parent: inputDigest,
      options,
      label,
      key,
    };
    const digest = createContentDigest(digestObject);
    const outputName = `${name}-${digest}${ext}`;
    const publicFile = join(publicDir, outputName);
    const publicRelativeUrl = `${pathPrefix}/static/${inputDigest}/${outputName}`;

    reporter.info(`${label}: Transforming video (${outputName})`);
    try {
      await videoCache.getFromCache(outputName, publicFile, reporter);
      reporter.info(`${label}: Used already cached file (${outputName})`);
      results[key] = { publicFile, publicRelativeUrl };
      continue;
    } catch (err) {
      /* do nothing as this basically means the file wasn't there */
      reporter.info(
        `${label}: Failed to get ${outputName} from cache (${err})`
      );
    }

    reporter.info(
      `${label}: Using ffmpeg to transform video ${inputFileName} ${digest}`
    );
    const tempName = `temp-${outputName}`;
    const tempPublicFile = join(publicDir, tempName);
    instances.push({ options, outputName: tempName, label });
    jobInfo.push({
      tempPublicFile,
      publicFile,
      outputName,
      publicRelativeUrl,
      key,
    });
  }
  await createVideoProcessingJob(inputName, publicDir, { instances }, reporter);

  for (const {
    tempPublicFile,
    publicFile,
    outputName,
    publicRelativeUrl,
    key,
  } of jobInfo) {
    try {
      await rename(tempPublicFile, publicFile);
    } catch {
      // ignore
    }
    await videoCache.addToCache(publicFile, outputName);
    results[key] = { publicFile, publicRelativeUrl };
  }

  return results;
}
