import { ElementType, ReactNode } from "react";

interface TooltipTriggerProps {
  id: string;
  icon?: string;
  title?: string;
  text?: string;
  direction?: "top" | "bottom" | "left" | "right";
  className?: string;
  children: ReactNode;
  as?: ElementType;
}

export const TooltipTrigger = ({
  id,
  icon,
  title,
  text,
  direction = "top",
  className = "",
  children,
  as: Component = "div",
}: TooltipTriggerProps) => {
  // 라이브러리 사용 때문에 icon은 직접 작성될 수밖에 없었습니다.
  // 차후 custom tooltip을 만드는 것으로 새로 refactor 진행하도록 합니다. 혹은 라이브러리 변경하셔도 됩니다.
  // 지금은 tablet 조작 상정이다 보니 tooltip이 중요 기능이 아니라 빠른 개발을 위해 이렇게 남겨둡니다.

  const tooltipContent = `${
    icon || title ? "<div class='flex items-center justify-center'>" : ""
  }${
    icon
      ? `<i class="material-symbols-rounded" style="font-variation-settings:'FILL' 1, 'opsz' 16; font-size: 1rem;">${icon}</i>`
      : ""
  }${title ? `<span class="font-bold">${title}</span>` : ""}${
    icon || title ? "</div>" : ""
  }<span class="text-sm">${text}</span>`;

  return (
    <Component
      data-tooltip-id={id}
      data-tooltip-html={tooltipContent}
      data-tooltip-place={direction}
      data-tooltip-class-name="max-w-[10rem]"
      className={className}
    >
      {children}
    </Component>
  );
};
