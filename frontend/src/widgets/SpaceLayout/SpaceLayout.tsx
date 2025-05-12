import { ReactNode } from "react";
import { SpaceNav } from "./ui/SpaceNav";
interface LayoutDefaultProps {
  children: ReactNode;
}

export const SpaceLayout = ({ children }: LayoutDefaultProps) => {
  return (
    <div className="flex w-full h-full px-4 py-5 gap-4">
      <SpaceNav />
      <section className="bg-neutral100/10 shadow-custom w-full h-full rounded-xl overflow-y-auto">
        {children}
      </section>
    </div>
  );
};
