import { PageProps } from "gatsby";
import React, { CSSProperties, Fragment, useMemo } from "react";
import classNames from "classnames";
import {
  GatsbyTransformedVideo,
  GatsbyVideo,
  GetTransformedVideo,
} from "@bond-london/gatsby-transformer-video";

interface Combined {
  constrained: GatsbyTransformedVideo;
  fixed: GatsbyTransformedVideo;
  fullWidth: GatsbyTransformedVideo;
}

const VideoCombinedLayout: React.FC<{
  combined: Combined;
  className: string;
  objectFit?: CSSProperties["objectFit"];
  objectPosition?: CSSProperties["objectPosition"];
}> = ({
  combined: { constrained, fixed, fullWidth },
  className,
  objectFit,
  objectPosition,
}) => {
  const divClassName = "col-span-1 border-2 border-red overflow-hidden";
  return (
    <>
      <div className={classNames(divClassName, className)}>
        <GatsbyVideo
          video={constrained}
          objectFit={objectFit}
          objectPosition={objectPosition}
          loop={true}
          autoPlay={true}
          controls={true}
        />
      </div>
      <div className={classNames(divClassName, className)}>
        <GatsbyVideo
          video={fixed}
          objectFit={objectFit}
          objectPosition={objectPosition}
          loop={true}
          loopDelay={3000}
          autoPlay={true}
          controls={true}
        />
      </div>
      <div className={classNames(divClassName, className)}>
        <GatsbyVideo
          video={fullWidth}
          objectFit={objectFit}
          objectPosition={objectPosition}
          autoPlay={true}
          controls={true}
        />
      </div>
    </>
  );
};
export const VideosLayout: React.FC<PageProps<Queries.AllVideosQuery>> = (
  props
) => {
  const combined = useMemo(() => {
    const combined: Combined[] = [];
    const all = props.data.allGatsbyVideo;
    if (!all) return combined;
    const allConstrained = all.constrained;
    const allFixed = all.fixed;
    const allFullWidth = all.fullWidth;
    const allMutedConstrained = all.mutedConstrained;
    const allMutedFixed = all.mutedFixed;
    const allMutedFullWidth = all.mutedFullWidth;
    for (let i = 0; i < allConstrained.length; i++) {
      {
        const constrained = GetTransformedVideo(allConstrained[i]);
        const fixed = GetTransformedVideo(allFixed[i]);
        const fullWidth = GetTransformedVideo(allFullWidth[i]);
        if (constrained && fixed && fullWidth) {
          combined.push({ constrained, fixed, fullWidth });
        }
      }
      {
        const constrained = GetTransformedVideo(allMutedConstrained[i]);
        const fixed = GetTransformedVideo(allMutedFixed[i]);
        const fullWidth = GetTransformedVideo(allMutedFullWidth[i]);
        if (constrained && fixed && fullWidth) {
          combined.push({ constrained, fixed, fullWidth });
        }
      }
    }
    return combined;
  }, [props.data.allGatsbyVideo]);

  return (
    <section>
      <h1>Videos</h1>
      <div className="grid grid-cols-3">
        <h2 className="col-span-1 text-center">Constrained</h2>
        <h2 className="col-span-1 text-center">Fixed</h2>
        <h2 className="col-span-1 text-center">Full Width</h2>
        {combined.map((combined, index) => (
          <Fragment key={index}>
            <VideoCombinedLayout
              combined={combined}
              className=""
              objectFit="cover"
              objectPosition="top left"
            />
            <VideoCombinedLayout
              combined={combined}
              className=""
              objectFit="contain"
              objectPosition="top left"
            />
            <VideoCombinedLayout
              combined={combined}
              className="aspect-w-1 aspect-h-1"
              objectFit="cover"
              objectPosition="top left"
            />
            <VideoCombinedLayout
              combined={combined}
              className="aspect-w-1 aspect-h-1"
              objectFit="contain"
              objectPosition="top left"
            />
            <VideoCombinedLayout
              combined={combined}
              className="aspect-w-4 aspect-h-3"
              objectFit="cover"
              objectPosition="top left"
            />
            <VideoCombinedLayout
              combined={combined}
              className="aspect-w-4 aspect-h-3"
              objectFit="contain"
              objectPosition="top left"
            />
            <VideoCombinedLayout
              combined={combined}
              className="aspect-w-3 aspect-h-4"
              objectFit="cover"
              objectPosition="top left"
            />
            <VideoCombinedLayout
              combined={combined}
              className="aspect-w-3 aspect-h-4"
              objectFit="contain"
              objectPosition="top left"
            />
          </Fragment>
        ))}
      </div>
    </section>
  );
};
