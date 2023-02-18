import { IGatsbyTransformedVideo } from "@bond-london/gatsby-transformer-video";
import { IBondSimpleVideo } from "./BondSimpleVideo";

export type IBondFullVideo = IBondSimpleVideo & {
  full: IGatsbyTransformedVideo;
  loop?: boolean;
};

export type IBondExternalVideo = IBondSimpleVideo & {
  external: string;
  loop?: boolean;
};
