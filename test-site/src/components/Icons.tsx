import classNames from "classnames";
import React from "react";
import Placeholder from "@/images/placeholder.svg";

interface Props {
  className?: string;
}

const AlertIcon: React.FC<Props> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={classNames(
      "icon inline-block fill-current stroke-current",
      className,
    )}
  >
    <path d="M22.56 16.3L14.89 3.58a3.43 3.43 0 0 0-5.78 0L1.44 16.3a3 3 0 0 0-.05 3A3.37 3.37 0 0 0 4.33 21h15.34a3.37 3.37 0 0 0 2.94-1.66 3 3 0 0 0-.05-3.04zM12 17a1 1 0 1 1 1-1 1 1 0 0 1-1 1zm1-4a1 1 0 0 1-2 0V9a1 1 0 0 1 2 0z" />
  </svg>
);

const ArrowIcon: React.FC<Props> = ({ className }) => (
  <svg
    viewBox="0 0 29 54"
    className={classNames(
      "icon inline-block fill-none stroke-current",
      className,
    )}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M28 1L2 27L28 53" strokeWidth={2} />
  </svg>
);

const HollowDot: React.FC<Props> = ({ className }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={classNames(
      "icon inline-block fill-none stroke-current",
      className,
    )}
  >
    <circle cx="7" cy="7" r="6.5" stroke="#141414" />
  </svg>
);

const FilledDot: React.FC<Props> = ({ className }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={classNames(
      "icon inline-block fill-none stroke-current",
      className,
    )}
  >
    <circle cx="7" cy="7" r="6.5" fill="#01FFF0" stroke="#141414" />
  </svg>
);

const PlayButton: React.FC<Props> = ({ className }) => (
  <svg
    viewBox="0 0 48 43"
    className={classNames("icon inline-block fill-current", className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M46.9051 20.2505L46.8691 20.2341L2.8934 0.192219C2.62655 0.0719684 2.31772 0 1.9999 0C0.895505 0 0 0.815338 0 1.82199V34.6177C0 35.6235 0.895505 36.4397 1.9989 36.4397C3.10329 36.4397 3.99779 35.6235 3.99779 34.6177V4.76996L41.596 21.9039L1.55314 41.0903C1.0804 41.3172 0.883512 41.8455 1.11438 42.2874C1.35225 42.742 1.94792 42.936 2.44665 42.7201L46.8691 23.4936C47.2549 23.326 47.5847 23.0454 47.7906 22.6701C48.2793 21.7791 47.8835 20.6959 46.9051 20.2505Z"
    />
  </svg>
);

const PauseButton: React.FC<Props> = ({ className }) => (
  <svg
    width="22"
    height="37"
    viewBox="0 0 22 37"
    xmlns="http://www.w3.org/2000/svg"
    className={classNames("icon inline-block fill-current", className)}
  >
    <rect width="8" height="37" />
    <rect x="15" width="7" height="37" />
  </svg>
);

const MuteButton: React.FC<Props> = ({ className }) => (
  <svg
    width="40"
    height="37"
    viewBox="0 0 40 37"
    xmlns="http://www.w3.org/2000/svg"
    className={classNames("icon inline-block fill-current", className)}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.35234 10.3589H8.8984L19.3385 0L21.6374 0.946638V36.1075L19.3385 37L8.8984 26.587H1.35234L0 25.2347V11.7113L1.35234 10.3589ZM10.413 24.3421L18.9328 32.8348V4.2193L10.413 12.6579L9.46638 13.0636H2.70468V23.8823H9.46638L10.413 24.3421Z"
    />
    <path d="M38.2798 10.8187L40.5679 13.1069L34.742 18.9328L40.5679 24.7586L38.2798 27.0468L32.4539 21.2209L26.628 27.0468L24.3398 24.7586L30.1657 18.9328L24.3398 13.1069L26.628 10.8187L32.4539 16.6446L38.2798 10.8187Z" />
  </svg>
);

const UnmuteButton: React.FC<Props> = ({ className }) => (
  <svg
    width="40"
    height="37"
    viewBox="0 0 40 37"
    xmlns="http://www.w3.org/2000/svg"
    className={classNames("icon inline-block fill-current", className)}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.464285 10.3589H8.63499L19.9393 0L22.4286 0.946637V36.1075L19.9393 37L8.63499 26.587H0.464285L-1 25.2346V11.7113L0.464285 10.3589ZM10.275 24.3421L19.5 32.8348V4.2193L10.275 12.6579L9.24999 13.0636H1.92857V23.8823H9.24999L10.275 24.3421ZM40 18.473C40.0076 22.8388 38.3743 27.0718 35.3787 30.4493L33.2935 28.5289C35.7463 25.6671 37.0778 22.1228 37.0714 18.473C37.0714 14.6864 35.6657 11.2001 33.3111 8.4386L35.3963 6.51827C38.3802 9.8923 40.0069 14.1165 40 18.473ZM34.1428 18.473C34.1484 21.404 33.1181 24.2567 31.2084 26.5978L29.1115 24.6613C30.4843 22.847 31.2185 20.6863 31.2143 18.473C31.2184 16.2684 30.4895 14.1159 29.1262 12.3063L31.223 10.3697C33.0563 12.6281 34.1428 15.4329 34.1428 18.473ZM28.2857 18.473C28.2857 20.0254 27.8171 21.4751 26.9971 22.7085L24.8329 20.7124C25.1789 20.0138 25.3593 19.2549 25.3618 18.4866C25.3643 17.7183 25.189 16.9584 24.8476 16.2578L27.0118 14.2591C27.82 15.487 28.2857 16.9313 28.2857 18.473Z"
    />
  </svg>
);

const iconMap = {
  AlertIcon,
  ArrowIcon,
  HollowDot,
  FilledDot,
  PlayButton,
  PauseButton,
  MuteButton,
  UnmuteButton,
};

const imgMap = {
  Placeholder,
};

type ImgKey = keyof typeof imgMap;
type IconKey = keyof typeof iconMap;

type IconType = ImgKey | IconKey;

export const Icon: React.FC<Props & { type: IconType }> = ({
  className,
  type,
}) => {
  const Element = iconMap[type as IconKey];
  if (Element) {
    return <Element className={className} />;
  }

  const img = imgMap[type as ImgKey];
  if (img) {
    return <img src={img} alt="" className={classNames(className, "icon")} />;
  }
  return <AlertIcon className={className} />;
};
