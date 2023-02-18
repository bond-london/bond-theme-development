import { getPosterSrc } from "@bond-london/gatsby-transformer-video";
import { ICmsVideo } from "./BondVideo";
import { IBondExternalVideo, IBondFullVideo } from "./types";

export function convertCmsVideoToBondExternalVideo(
  cms: ICmsVideo
): IBondExternalVideo {
  const preview = cms.preview?.localFile?.childGatsbyVideo?.transformed;
  const external = cms.external || undefined;

  if (!external) {
    throw new Error("No external video found");
  }

  const posterSrc = cms.poster?.localFile?.publicURL || getPosterSrc(preview);

  return {
    videoData: preview,
    posterSrc,
    loop: cms.loop || undefined,
    external,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}

export function convertCmsVideoToBondFullVideo(cms: ICmsVideo): IBondFullVideo {
  const preview = cms.preview?.localFile?.childGatsbyVideo?.transformed;

  const full = cms.full?.localFile?.childGatsbyVideo?.transformed;

  if (!full) {
    throw new Error("No full video found");
  }

  const posterSrc =
    cms.poster?.localFile?.publicURL ||
    getPosterSrc(preview) ||
    getPosterSrc(full);

  const subtitles = cms.subtitles?.localFile?.publicURL || undefined;

  return {
    videoData: preview,
    posterSrc,
    subtitles: subtitles
      ? [
          {
            default: true,
            label: "English",
            src: subtitles,
            srcLang: "en",
          },
        ]
      : undefined,
    full,
    loop: cms.loop || undefined,
    dontCrop: cms.dontCrop,
    verticalCropPosition: cms.verticalCropPosition,
    horizontalCropPosition: cms.horizontalCropPosition,
  };
}
