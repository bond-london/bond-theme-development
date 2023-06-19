import { GatsbyImageProps } from "gatsby-plugin-image";
import React, { CSSProperties } from "react";

function getImgStyle({
  backgroundColor,
  image: { width, height, layout },
  objectFit,
  objectPosition,
}: GatsbyImageProps): CSSProperties {
  const style: CSSProperties = {
    padding: 0,
    maxWidth: "none",
  };
  if (backgroundColor) {
    style.backgroundColor = backgroundColor;
  }
  if (layout === "fixed") {
    style.width = width;
    style.height = height;
    style.position = "relative";
  } else if (layout === "constrained" || layout === "fullWidth") {
    style.position = "relative";
    style.top = 0;
    style.left = 0;
    style.bottom = 0;
    style.right = 0;
    style.width = "100%";
    style.height = "100%";
  }

  if (objectFit) {
    style.objectFit = objectFit;
  }
  if (objectPosition) {
    style.objectPosition = objectPosition;
  }

  return style;
}

export const SimpleGatsbyImage: React.FC<GatsbyImageProps> = allProps => {
  const {
    image,
    alt,
    loading = "lazy",
    className,
    style,
    imgStyle,
    imgClassName,
    onLoad,
    onStartLoad,
    ...props
  } = allProps;
  const { width, height, images } = image;
  const realStyle = getImgStyle(allProps);

  return (
    <picture
      className={className}
      style={style}
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      onLoad={onLoad ? () => onLoad({ wasCached: false }) : undefined}
      onLoadStart={
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        onStartLoad ? () => onStartLoad({ wasCached: false }) : undefined
      }
      {...props}
    >
      {images.sources?.map(({ media, srcSet, type, sizes }) => (
        <source
          key={`${media}-${type}-${srcSet}`}
          type={type}
          media={media}
          srcSet={srcSet}
          sizes={sizes}
        />
      ))}
      <img
        className={imgClassName}
        width={width}
        height={height}
        loading={loading}
        alt={alt}
        src={images.fallback?.src}
        srcSet={images.fallback?.srcSet}
        decoding="async"
        style={{
          ...realStyle,
          ...imgStyle,
        }}
      ></img>
    </picture>
  );
};
