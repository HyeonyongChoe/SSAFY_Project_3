import { bgColorClassMap } from "@/shared/lib/bgColorClassMap";
import { HeaderDefault } from "@/widgets/Header";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface LayoutDefaultProps {
  children: ReactNode;
  rightChildren: ReactNode;
  bgColor?: string;
  initialShrunk?: boolean;
}

export const LayoutShrink = ({
  children,
  rightChildren,
  bgColor,
  initialShrunk = false,
}: LayoutDefaultProps) => {
  const bgClass = bgColorClassMap[bgColor ? bgColor : "blue"];
  const [isShrunk, setIsShrunk] = useState(initialShrunk);

  const handleShrink = () => {
    setIsShrunk(true);
    // 의도적으로 navigate 대신 pushState를 적용해두었습니다
    // 자연스러운 애니메이션 적용을 위해 리렌더링하지 않고, 주소만 바꾸는 것이 목적입니다
    window.history.pushState({}, "", "/sign");
  };

  const handleExpand = () => {
    setIsShrunk(false);
    window.history.pushState({}, "", "/");
  };

  return (
    <div className={`w-full h-full ${bgClass}`}>
      <HeaderDefault
        onLogoClick={handleExpand}
        onShrink={handleShrink}
        className="fixed"
      />
      <div
        className={`flex items-center justify-center text-center transition-all duration-1000 ${
          isShrunk ? "scale-[50%] translate-x-[-25%]" : ""
        }`}
      >
        {children}
      </div>
      <AnimatePresence>
        {isShrunk && (
          <motion.div
            initial={{ x: "100%", y: "50%", opacity: 0 }}
            animate={{ x: 0, y: "50%", opacity: 1 }}
            exit={{ x: "100%", y: "50%", opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed w-[50vw] h-[50vh] right-0 top-0 flex items-center justify-center"
          >
            {rightChildren}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
