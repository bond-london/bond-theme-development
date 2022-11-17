import { IPluginRefOptions } from "gatsby";

export type Maybe<T> = T | null;
export type Vertical = "Top" | "Middle" | "Bottom";
export type Horizontal = "Left" | "Middle" | "Right";

export interface IVisualCommon {
  dontCrop: Maybe<boolean>;
  horizontalCropPosition: Maybe<Horizontal>;
  verticalCropPosition: Maybe<Vertical>;
}

export interface IBondThemeOptions extends IPluginRefOptions {
  videoWidth?: number;
  videoCacheConnectionString?: string;
  useVideoCache?: boolean;
  enableEslint?: boolean;
  isProduction?: boolean;
  projectName: string;
  graphCMSToken: string;
  graphCMSEndpoint: string;
  graphCMSStage: string;
  productionImageFormats?: Array<string>;
  productionImageBreakpoints?: Array<number>;
  developmentImageBreakpoints?: Array<number>;
  allowIndex: boolean;
  siteUrl: string;
  showDevPages: boolean;
  icon: string;
  maxImageWidth?: number;
  manifestOptions: IPluginRefOptions;
}
