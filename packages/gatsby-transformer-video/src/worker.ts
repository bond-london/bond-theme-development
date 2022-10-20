import pathToFfmpeg from "ffmpeg-static";

import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import { reporter } from "gatsby-cli/lib/reporter/reporter";

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
