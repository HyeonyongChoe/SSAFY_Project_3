import { bgColorClassMap } from "@/shared/lib/bgColorClassMap";
import { HeaderDefault } from "@/widgets/Header";
import { ReactNode } from "react";

interface LayoutDefaultProps {
  children: ReactNode;
  bgColor?: string;
  noScroll?: boolean;
}

export const LayoutDefault = ({
  children,
  bgColor,
  noScroll,
}: LayoutDefaultProps) => {
  const bgClass = bgColorClassMap[bgColor ? bgColor : "blue"];

  return (
    <div
      className={`relative h-full w-full ${
        noScroll ? "" : "overflow-y-auto overflow-x-auto"
      } ${bgClass}`}
    >
      <HeaderDefault />
      <main className="w-full h-[calc(100%-3.525rem)]">{children}</main>
    </div>
  );
};
