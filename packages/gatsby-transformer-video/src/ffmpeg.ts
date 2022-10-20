import { join, basename } from "path";
import { ensureDir, rename } from "fs-extra";
import pathToFfmpeg from "ffmpeg-static";
import { exec } from "child_process";

import type { Actions, NodePluginArgs, Reporter } from "gatsby";
import { IGatsbyVideoInformation } from "./types";
import { videoCache } from "./onPluginInit";
import {
  ISingleVideoProcessingArgs,
  IVideoProcessingArgs,
  VIDEO_PROCESSING_JOB_NAME,
} from "./gatsby-worker";

let actions: Actions;

export function setActions(_actions: Actions): void {
  actions = _actions;
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

const regex =
  /Stream.#(.*): (?<type>Video|Audio|Data)(.*, (?<width>\d+)x(?<height>\d+).*$|.*$)/gim;
function parseFfmpegOutput(output: string): IGatsbyVideoInformation {
  const matches = output.matchAll(regex);
  const info: Partial<IGatsbyVideoInformation> = {};
  for (const match of matches) {
    switch (match.groups?.type) {
      case "Video":
        info.width = parseInt(match.groups.width);
        info.height = parseInt(match.groups.height);
        break;

      case "Audio":
        info.hasAudio = true;
    }
  }

  return info as IGatsbyVideoInformation;
}

export async function getLocalVideoInformation(
  videoPath: string,
  reporter: Reporter
): Promise<IGatsbyVideoInformation> {
  return new Promise<IGatsbyVideoInformation>((resolve, reject) => {
    exec(`${pathToFfmpeg} -i "${videoPath}"`, (_error, _stdout, stderr) => {
      try {
        const info = parseFfmpegOutput(stderr);
        reporter.verbose(
          `Got ${JSON.stringify(info, undefined, 2)} from ${videoPath}`
        );
        resolve(info);
      } catch (ex) {
        reject(ex);
      }
    });
  });
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

  reporter.verbose(`Transforming video ${name}`);

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
      console.error(err);
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
  if (instances.length) {
    reporter.verbose(
      `Waiting to process video for "${inputName}" for ${instances.length} jobs`
    );
    await createVideoProcessingJob(
      inputName,
      publicDir,
      { instances },
      reporter
    );
    reporter.verbose(
      `Finished processing video for "${inputName}" for ${instances.length} jobs`
    );

    for (const {
      tempPublicFile,
      publicFile,
      outputName,
      publicRelativeUrl,
      key,
    } of jobInfo) {
      try {
        reporter.verbose(
          `Renaming temp public "${tempPublicFile}" to public "${publicFile}"`
        );
        await rename(tempPublicFile, publicFile);
      } catch {
        // ignore
      }
      reporter.verbose(`Adding public "${publicFile}" to cache`);
      await videoCache.addToCache(publicFile, outputName);
      results[key] = { publicFile, publicRelativeUrl };
      reporter.verbose(`Finished processing public "${publicFile}"`);
    }

    reporter.verbose(`Finished transforming video ${name}`);
  } else {
    reporter.verbose(`Video ${name} already processed`);
  }
  return results;
}
