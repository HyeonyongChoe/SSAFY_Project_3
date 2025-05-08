import { bgColorClassMap } from "@/shared/lib/bgColorClassMap";
import { HeaderDefault } from "@/widgets/Header";
import { ReactNode } from "react";

interface LayoutDefaultProps {
  children: ReactNode;
  bgColor?: string;
}

export const LayoutDefault = ({ children, bgColor }: LayoutDefaultProps) => {
  const bgClass = bgColorClassMap[bgColor ? bgColor : "blue"];

  return (
    <div className={`flex min-h-screen w-screen flex-col ${bgClass}`}>
      <HeaderDefault />
      <main className="flex-grow">{children}</main>
    </div>
  );
};
