import { BondVisual, IBondVisual, Section } from "@bond-london/gatsby-theme";
import { IRichTextInformation } from "@bond-london/graphcms-rich-text";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import classNames from "classnames";
import React from "react";
import { ColourName, lookupColourClassNames } from "../colors";
import {
  GenericComponentInside,
  IComponentInformation,
} from "../components/GenericComponent";
import { ILinkInformation } from "../components/LinkOrButton";
import { SectionBody } from "../components/SectionBody";
import { SectionHeading } from "../components/SectionHeading";

// eslint-disable-next-line import/no-unused-modules
export type ICollectionContent = ICollectionInformation | IComponentInformation;
// eslint-disable-next-line import/no-unused-modules
export function isContentCollection(
  content: ICollectionContent
): content is ICollectionInformation {
  return !!(content as ICollectionInformation).contents;
}

// eslint-disable-next-line import/no-unused-modules
export function isContentComponent(
  content: ICollectionContent
): content is IComponentInformation {
  return !(content as ICollectionInformation).contents;
}
export interface ICollectionInformation {
  id: string;
  name: string;
  anchor: string | null;
  preHeading?: string | null;
  heading?: string | null;
  postHeading?: string | null;
  body?: IRichTextInformation;
  backgroundColour?: ColourName | null;
  textColour?: ColourName | null;
  backgroundVisual?: IBondVisual;
  contents: ReadonlyArray<ICollectionContent>;
  links?: ReadonlyArray<ILinkInformation>;
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
  information,
}) => {
  const { backgroundColour, textColour } = information;
  return (
    <div
      data-component="Component Inside"
      className={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        "flex flex-col"
      )}
    >
      <GenericComponentInside information={information} />
    </div>
  );
};

const CollectionInside: React.FC<{ information: ICollectionInformation }> = ({
  information: { heading, preHeading, postHeading, body, contents },
}) => {
  return (
    <>
      <SectionHeading
        preHeading={preHeading}
        heading={heading}
        postHeading={postHeading}
      />
      {body && <SectionBody content={body} />}
      {contents.map((content, index) => (
        <GenericCollectionContent key={index} content={content} />
      ))}
    </>
  );
};

export const GenericCollection: React.FC<{
  information: ICollectionInformation;
  collectionType: string;
  unknown?: boolean;
}> = ({ collectionType, information, unknown }) => {
  const { anchor, backgroundVisual, backgroundColour, textColour } =
    information;
  return (
    <Section
      id={anchor || undefined}
      componentName={`${collectionType} collection`}
      sectionClassName={classNames(
        "overflow-hidden",
        lookupColourClassNames(backgroundColour, textColour),
        unknown && "unknown-component"
      )}
      sectionColumnsClassName="col-start-2 col-span-1 grid grid-cols-2 grid-gap tablet:grid-cols-3 laptop:grid-cols-4"
      preChildren={
        backgroundVisual && (
          <BondVisual visual={backgroundVisual} autoPlay={true} loop={true} />
        )
      }
    >
      <CollectionInside information={information} />
    </Section>
  );
};
