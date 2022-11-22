import {
  BondImage,
  convertCmsImageToBondImage,
  IBondImage,
  Section,
} from "@bond-london/gatsby-theme";
import {
  IRichTextInformation,
  getRTFInformation,
} from "@bond-london/graphcms-rich-text";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import classNames from "classnames";
import React from "react";
import { convertCmsComponentInformation } from "../cms/CmsComponent";
import { ColourName, lookupColourClassNames } from "../colors";
import {
  GenericComponent,
  IComponentInformation,
} from "../components/GenericComponent";
import { SectionBody } from "../components/SectionBody";
import { SectionHeading } from "../components/SectionHeading";
import { SectionIcon } from "../components/SectionIcon";
import { SectionVisual } from "../components/SectionVisual";

function calculateContentsClassName(length: number) {
  switch (length) {
    case 1:
      return "col-span-full tablet:col-start-3 tablet:col-span-4 laptop:col-start-4 laptop:col-span-8 grid grid-cols-1";
    case 2:
      return "col-span-full tablet:col-start-2 tablet:col-span-6 laptop:col-start-3 laptop:col-span-8 grid grid-cols-2";
    default:
      return "col-span-full tablet:col-start-2 tablet:col-span-6 laptop:col-start-2 laptop:col-span-10 grid grid-cols-2 laptop:grid-cols-3";
  }
}

export type ICollectionContent = ICollectionInformation | IComponentInformation;
export function isContentCollection(
  content: ICollectionContent
): content is ICollectionInformation {
  return !!(content as ICollectionInformation).contents;
}

export function isContentComponent(
  content: ICollectionContent
): content is IComponentInformation {
  return !(content as ICollectionInformation).contents;
}
export interface ICollectionInformation {
  name: string;
  preHeading?: string | null;
  heading?: string | null;
  postHeading?: string | null;
  body?: IRichTextInformation;
  backgroundColour?: ColourName | null;
  textColour?: ColourName | null;
  backgroundImage?: IBondImage;
  contents: ReadonlyArray<ICollectionContent>;
}

const GenericCollectionContent: React.FC<{ content: ICollectionContent }> = ({
  content,
}) => {
  if (isContentCollection(content)) {
    return <CollectionInside information={content} />;
  }
  if (isContentComponent(content)) {
    return <ComponentInside information={content} />;
  }
  return (
    <Unsupported
      component="GenericCollectionContent"
      message="Unknown collection content"
    />
  );
};

const ComponentInside: React.FC<{ information: IComponentInformation }> = ({
  information: {
    heading,
    preHeading,
    postHeading,
    body,
    // links,
    visual,
    backgroundColour,
    textColour,
    icon,
  },
}) => {
  return (
    <div
      data-component="Component Inside"
      className={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        "flex flex-col"
      )}
    >
      <SectionHeading
        preHeading={preHeading}
        heading={heading}
        postHeading={postHeading}
      />
      {body && <SectionBody content={body} />}
      {icon && <SectionIcon icon={icon} />}
      {visual && <SectionVisual visual={visual} />}
    </div>
  );
};

const CollectionInside: React.FC<{ information: ICollectionInformation }> = ({
  information: {
    heading,
    preHeading,
    postHeading,
    body,
    // links,
    // icon,
    contents,
  },
}) => {
  return (
    <>
      <SectionHeading
        preHeading={preHeading}
        heading={heading}
        postHeading={postHeading}
      />
      {body && <SectionBody content={body} />}
      {contents.length && (
        <div className={calculateContentsClassName(contents.length)}>
          {contents.map((content, index) => (
            <GenericCollectionContent key={index} content={content} />
          ))}
        </div>
      )}
    </>
  );
};

export const GenericCollection: React.FC<{
  information: ICollectionInformation;
  collectionType: string;
  unknown?: boolean;
}> = ({ collectionType, information }) => {
  const { backgroundImage, backgroundColour, textColour } = information;
  return (
    <Section
      componentName={`${collectionType} collection`}
      className={lookupColourClassNames(backgroundColour, textColour)}
      preChildren={backgroundImage && <BondImage image={backgroundImage} />}
    >
      <CollectionInside information={information} />
    </Section>
  );
};
