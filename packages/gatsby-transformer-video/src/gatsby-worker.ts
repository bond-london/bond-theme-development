import { ITransformedVideoInformation } from "./types";
import { transformVideo } from "./worker";

export interface IVideoProcessingArgs {
  name: string;
  targetWidth?: number;
}

interface IVideoProcessingJobArgs {
  inputPaths: Array<{ path: string; contentDigest: string }>;
  outputDir: string;
  args: IVideoProcessingArgs;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function VIDEO_PROCESSING(
  jobArgs: IVideoProcessingJobArgs,
): Promise<ITransformedVideoInformation> {
  const { inputPaths, outputDir, args } = jobArgs;
  const { path, contentDigest } = inputPaths[0];
  const { name, targetWidth } = args;
  return transformVideo(path, name, outputDir, contentDigest, targetWidth);
}
