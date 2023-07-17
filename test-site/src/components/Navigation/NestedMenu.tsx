import classNames from "classnames";
import React from "react";
import { ColourName, lookupColourClassNames } from "@colors";
import { LinkOrButton } from "@/components/LinkOrButton";
import { SectionIcon } from "@/components/SectionIcon";
import { useNestedMenu } from "./MenuUtils";
import { INavigationItem } from "./NavigationMenu";

export const NestedMenu: React.FC<{
  item: INavigationItem;
  backgroundColour?: ColourName | null;
  textColour?: ColourName | null;
  className?: string;
  closeMenu?: () => void;
  active?: boolean;
  activateMenu?: (
    timeStamp: number,
    item?: INavigationItem,
    from?: INavigationItem,
  ) => void;
}> = ({
  item,
  backgroundColour,
  textColour,
  className,
  active,
  closeMenu,
  activateMenu,
}) => {
  const { handleButtonClick, handleMouseEnter, handleMouseLeave } =
    useNestedMenu(item, activateMenu);

  return (
    <div
      data-component="Nested menu"
      className={classNames(
        "inline-flex flex-col laptop:flex-row items-start gap-y-xs",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="menu-button" onClick={handleButtonClick}>
        {item.text && <>{item.text}</>}
        {item.icon && <SectionIcon icon={item.icon} />}
      </button>
      <div
        className={classNames(
          "relative laptop:absolute flex items-start transition-all laptop:top-m laptop:right-0 laptop:justify-end overflow-hidden",
          lookupColourClassNames(backgroundColour, textColour),
          active ? "laptop:max-h-screen" : "laptop:max-h-0",
        )}
      >
        <ul className="flex flex-col laptop:flex-row gap-y-xs ml-xs">
          {item.entries?.map((i) => (
            <li key={i.name} className="laptop:px-s laptop:py-xs">
              <LinkOrButton onClick={closeMenu} information={i} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
