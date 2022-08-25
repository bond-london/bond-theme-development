import { PageProps } from "gatsby";
import React, { CSSProperties, Fragment, useMemo } from "react";
import classNames from "classnames";
import {
  GatsbyExtractedAnimation,
  GatsbyAnimation,
  GetExtractedAnimation,
} from "@bond-london/gatsby-transformer-extracted-lottie";

interface Combined {
  constrained: GatsbyExtractedAnimation;
  fixed: GatsbyExtractedAnimation;
  fullWidth: GatsbyExtractedAnimation;
}

const AnimationCombinedLayout: React.FC<{
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
        <GatsbyAnimation animation={constrained} objectFit={objectFit} />
      </div>
      <div className={classNames(divClassName, className)}>
        <GatsbyAnimation animation={fixed} objectFit={objectFit} />
      </div>
      <div className={classNames(divClassName, className)}>
        <GatsbyAnimation animation={fullWidth} objectFit={objectFit} />
      </div>
    </>
  );
};
export const AnimationsLayout: React.FC<
  PageProps<Queries.AllAnimationsQuery>
> = (props) => {
  const combined = useMemo(() => {
    const combined: Combined[] = [];
    const all = props.data.allGatsbyAnimation;
    if (!all) return combined;
    const allConstrained = all.constrained;
    const allFixed = all.fixed;
    const allFullWidth = all.fullWidth;
    for (let i = 0; i < allConstrained.length; i++) {
      const constrained = GetExtractedAnimation(allConstrained[i]);
      const fixed = GetExtractedAnimation(allFixed[i]);
      const fullWidth = GetExtractedAnimation(allFullWidth[i]);
      if (constrained && fixed && fullWidth) {
        combined.push({ constrained, fixed, fullWidth });
      }
    }
    return combined;
  }, [props.data.allGatsbyAnimation]);

  return (
    <section>
      <h1>Animations</h1>
      <div className="grid grid-cols-3">
        <h2 className="col-span-1 text-center">Constrained</h2>
        <h2 className="col-span-1 text-center">Fixed</h2>
        <h2 className="col-span-1 text-center">Full Width</h2>
        {combined.map((combined, index) => (
          <Fragment key={index}>
            <AnimationCombinedLayout
              combined={combined}
              className=""
              objectFit="cover"
            />
            <AnimationCombinedLayout
              combined={combined}
              className=""
              objectFit="contain"
            />
            <AnimationCombinedLayout
              combined={combined}
              className="aspect-w-1 aspect-h-1"
              objectFit="cover"
            />
            <AnimationCombinedLayout
              combined={combined}
              className="aspect-w-1 aspect-h-1"
              objectFit="contain"
            />
            <AnimationCombinedLayout
              combined={combined}
              className="aspect-w-4 aspect-h-3"
              objectFit="cover"
            />
            <AnimationCombinedLayout
              combined={combined}
              className="aspect-w-4 aspect-h-3"
              objectFit="contain"
            />
            <AnimationCombinedLayout
              combined={combined}
              className="aspect-w-3 aspect-h-4"
              objectFit="cover"
            />
            <AnimationCombinedLayout
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
