import { ButtonHTMLAttributes } from "react";
import { Icon } from "./Icon";
import { IconProps } from "./icon-props";

interface IconButtonProps
  extends IconProps,
    ButtonHTMLAttributes<HTMLButtonElement> {}

export const IconButton = ({
  icon,
  fill,
  size = 24,
  tone = "white",
  className,
  ...props
}: IconButtonProps) => {
  const colorClass = {
    white: `text-neutral100 hover:bg-neutral100/30`,
    light: `text-neutral1000/70 bg-neutral100 hover:text-neutral100/70 hover:bg-neutral800`,
    neutral: `text-neutral1000/70 bg-neutral400 hover:text-neutral100/70 hover:bg-neutral700`,
    dark: `text-neutral100/70 bg-neutral900 hover:text-neutral1000/70 hover:bg-neutral300`,
    black: `text-neutral1000 hover:bg-neutral1000/30`,
  };

  return (
    <button
      className={`rounded-full flex items-center justify-center transition-all p-2 ${colorClass[tone]} ${className}`}
      {...props}
    >
      <Icon icon={icon} fill={fill} size={size} />
    </button>
  );
};
