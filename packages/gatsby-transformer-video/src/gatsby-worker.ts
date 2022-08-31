import { getVideoData, workerTransformVideo } from "./worker";
import { join } from "path";
import { FfprobeData } from "fluent-ffmpeg";

export const VIDEO_PROCESSING_JOB_NAME = "VIDEO_PROCESSING";
export const VIDEO_INFORMATION_JOB_NAME = "VIDEO_INFORMATION";

interface IVideoInformationJobArgs {
  inputPaths: Array<{ path: string; contentDigest: string }>;
  outputDir: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export async function VIDEO_INFORMATION({
  inputPaths,
}: IVideoInformationJobArgs): Promise<FfprobeData> {
  const inputFileName = inputPaths[0].path;
  const result = await getVideoData(inputFileName);
  return result;
}

export interface ISingleVideoProcessingArgs {
  options: Array<string>;
  label: string;
  outputName: string;
}
export interface IVideoProcessingArgs {
  instances: Array<ISingleVideoProcessingArgs>;
}

interface IVideoProcessingJobArgs {
  inputPaths: Array<{ path: string; contentDigest: string }>;
  outputDir: string;
  args: IVideoProcessingArgs;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function VIDEO_PROCESSING({
  inputPaths,
  outputDir,
  args,
}: IVideoProcessingJobArgs): Promise<void> {
  const inputFileName = inputPaths[0].path;
  return workerTransformVideo(
    inputFileName,
    args.instances.map(i => {
      return {
        output: join(outputDir, i.outputName),
        options: i.options,
        label: i.label,
      };
    })
  );
}
