import { ReactNode } from "react";

interface LayoutDefaultProps {
  children: ReactNode;
}

export const SpaceLayout = ({ children }: LayoutDefaultProps) => {
  return (
    <div>
      <aside>nav 바 구현 예정</aside>
      <section>{children}</section>
    </div>
  );
};
