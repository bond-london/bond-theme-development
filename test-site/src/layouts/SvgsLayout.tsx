import { PageProps } from "gatsby";
import React, { CSSProperties, Fragment, useMemo } from "react";
import {
  GatsbyExtractedSvg,
  GatsbySvg,
  GetExtractedSvg,
} from "@bond-london/gatsby-transformer-extracted-svg";
import classNames from "classnames";

interface Combined {
  constrained: GatsbyExtractedSvg;
  fixed: GatsbyExtractedSvg;
  fullWidth: GatsbyExtractedSvg;
}

const SvgCombinedLayout: React.FC<{
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
        <GatsbySvg svg={constrained} objectFit={objectFit} />
      </div>
      <div className={classNames(divClassName, className)}>
        <GatsbySvg svg={fixed} objectFit={objectFit} />
      </div>
      <div className={classNames(divClassName, className)}>
        <GatsbySvg svg={fullWidth} objectFit={objectFit} />
      </div>
    </>
  );
};
export const SvgsLayout: React.FC<PageProps<Queries.AllSvgsQuery>> = (
  props
) => {
  const combined = useMemo(() => {
    const combined: Combined[] = [];
    const all = props.data.allGatsbySvg;
    if (!all) return combined;
    const allConstrained = all.constrained;
    const allFixed = all.fixed;
    const allFullWidth = all.fullWidth;
    for (let i = 0; i < allConstrained.length; i++) {
      const constrained = GetExtractedSvg(allConstrained[i]);
      const fixed = GetExtractedSvg(allFixed[i]);
      const fullWidth = GetExtractedSvg(allFullWidth[i]);
      if (constrained && fixed && fullWidth) {
        combined.push({ constrained, fixed, fullWidth });
      }
    }
    return combined;
  }, [props.data.allGatsbySvg]);

  return (
    <section>
      <h1>SVGs</h1>
      <div className="grid grid-cols-3">
        <h2 className="col-span-1 text-center">Constrained</h2>
        <h2 className="col-span-1 text-center">Fixed</h2>
        <h2 className="col-span-1 text-center">Full Width</h2>
        {combined.map((combined, index) => (
          <Fragment key={index}>
            <SvgCombinedLayout
              combined={combined}
              className=""
              objectFit="cover"
            />
            <SvgCombinedLayout
              combined={combined}
              className=""
              objectFit="contain"
            />
            <SvgCombinedLayout
              combined={combined}
              className="aspect-w-1 aspect-h-1"
              objectFit="cover"
            />
            <SvgCombinedLayout
              combined={combined}
              className="aspect-w-1 aspect-h-1"
              objectFit="contain"
            />
            <SvgCombinedLayout
              combined={combined}
              className="aspect-w-4 aspect-h-3"
              objectFit="cover"
            />
            <SvgCombinedLayout
              combined={combined}
              className="aspect-w-4 aspect-h-3"
              objectFit="contain"
            />
            <SvgCombinedLayout
              combined={combined}
              className="aspect-w-3 aspect-h-4"
              objectFit="cover"
            />
            <SvgCombinedLayout
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
