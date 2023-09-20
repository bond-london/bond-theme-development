import { exec } from "child_process";
import pathToFfmpeg from "ffmpeg-static";

import type { Reporter } from "gatsby";
import { IGatsbyVideoInformation } from "./types";

const regex =
  /Stream.#(.*): (?<type>Video|Audio|Data)(.*, (?<width>\d+)x(?<height>\d+).*$|.*$)/gim;
function parseFfmpegOutput(output: string): IGatsbyVideoInformation {
  const matches = output.matchAll(regex);
  const info: Partial<IGatsbyVideoInformation> = { hasAudio: false };
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
  reporter: Reporter,
): Promise<IGatsbyVideoInformation> {
  return new Promise<IGatsbyVideoInformation>((resolve, reject) => {
    exec(`${pathToFfmpeg} -i "${videoPath}"`, (_error, _stdout, stderr) => {
      try {
        const info = parseFfmpegOutput(stderr);
        reporter.verbose(
          `Got ${info.width}x${info.height} (${
            info.hasAudio ? "Audio" : "No Audio"
          })from ${videoPath}`,
        );
        resolve(info);
      } catch (ex) {
        reject(ex);
      }
    });
  });
}
