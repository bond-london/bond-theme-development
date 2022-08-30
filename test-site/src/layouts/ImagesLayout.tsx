import { PageProps } from "gatsby";
import React, { CSSProperties, Fragment, useMemo } from "react";
import classNames from "classnames";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { getGatsbyImage } from "@bond-london/gatsby-theme";

interface Combined {
  constrained: IGatsbyImageData;
  fixed: IGatsbyImageData;
  fullWidth: IGatsbyImageData;
}

const ImageCombinedLayout: React.FC<{
  combined: Combined;
  className: string;
  objectFit?: CSSProperties["objectFit"];
}> = ({
  combined: { constrained, fixed, fullWidth },
  className,
  objectFit,
}) => {
  const divClassName = "col-span-1 border-2 border-red overflow-hidden";
  return (
    <>
      <div className={classNames(divClassName, className)}>
        <GatsbyImage alt="" objectFit={objectFit} image={constrained} />
      </div>
      <div className={classNames(divClassName, className)}>
        <GatsbyImage alt="" objectFit={objectFit} image={fixed} />
      </div>
      <div className={classNames(divClassName, className)}>
        <GatsbyImage alt="" objectFit={objectFit} image={fullWidth} />
      </div>
    </>
  );
};
export const ImagesLayout: React.FC<PageProps<Queries.AllImagesQuery>> = (
  props
) => {
  const combined = useMemo(() => {
    const combined: Combined[] = [];
    const all = props.data.allImageSharp;
    if (!all) return combined;
    const allConstrained = all.constrained;
    const allFixed = all.fixed;
    const allFullWidth = all.fullWidth;
    for (let i = 0; i < allConstrained.length; i++) {
      const constrained = getGatsbyImage(allConstrained[i]);
      const fixed = getGatsbyImage(allFixed[i]);
      const fullWidth = getGatsbyImage(allFullWidth[i]);
      if (constrained && fixed && fullWidth) {
        combined.push({ constrained, fixed, fullWidth });
      }
    }
    return combined;
  }, [props.data.allImageSharp]);

  return (
    <section>
      <h1>Images</h1>
      <div className="grid grid-cols-3">
        <h2 className="col-span-1 text-center">Constrained</h2>
        <h2 className="col-span-1 text-center">Fixed</h2>
        <h2 className="col-span-1 text-center">Full Width</h2>
        {combined.map((combined, index) => (
          <Fragment key={index}>
            <ImageCombinedLayout
              combined={combined}
              className=""
              objectFit="cover"
            />
            <ImageCombinedLayout
              combined={combined}
              className=""
              objectFit="contain"
            />
            <ImageCombinedLayout
              combined={combined}
              className="aspect-w-1 aspect-h-1"
              objectFit="cover"
            />
            <ImageCombinedLayout
              combined={combined}
              className="aspect-w-1 aspect-h-1"
              objectFit="contain"
            />
            <ImageCombinedLayout
              combined={combined}
              className="aspect-w-4 aspect-h-3"
              objectFit="cover"
            />
            <ImageCombinedLayout
              combined={combined}
              className="aspect-w-4 aspect-h-3"
              objectFit="contain"
            />
            <ImageCombinedLayout
              combined={combined}
              className="aspect-w-3 aspect-h-4"
              objectFit="cover"
            />
            <ImageCombinedLayout
              combined={combined}
              className="aspect-w-3 aspect-h-4"
              objectFit="contain"
            />
          </Fragment>
        ))}
      </div>
    </section>
  );
};
