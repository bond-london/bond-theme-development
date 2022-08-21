import { getVideoData, workerTransformVideo } from "./worker";
import { join } from "path";

export const VIDEO_PROCESSING_JOB_NAME = "VIDEO_PROCESSING";
export const VIDEO_INFORMATION_JOB_NAME = "VIDEO_INFORMATION";

interface VideoInformationJobArgs {
  inputPaths: { path: string; contentDigest: string }[];
  outputDir: string;
}

// eslint-disable-next-line import/no-unused-modules
export async function VIDEO_INFORMATION({
  inputPaths,
}: VideoInformationJobArgs) {
  const inputFileName = inputPaths[0].path;
  const result = await getVideoData(inputFileName);
  return result;
}

export interface SingleVideoProcessingArgs {
  options: string[];
  label: string;
  outputName: string;
}
export interface VideoProcessingArgs {
  instances: SingleVideoProcessingArgs[];
}

interface VideoProcessingJobArgs {
  inputPaths: { path: string; contentDigest: string }[];
  outputDir: string;
  args: VideoProcessingArgs;
}

// eslint-disable-next-line import/no-unused-modules
export function VIDEO_PROCESSING({
  inputPaths,
  outputDir,
  args,
}: VideoProcessingJobArgs) {
  const inputFileName = inputPaths[0].path;
  return workerTransformVideo(
    inputFileName,
    args.instances.map(i => ({
      output: join(outputDir, i.outputName),
      options: i.options,
      label: i.label,
    }))
  );
}
