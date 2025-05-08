import { bgColorClassMap } from "@/shared/lib/bgColorClassMap";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface IntroPageProps {
  onFinish: () => void;
}

export const IntroPage = ({ onFinish }: IntroPageProps) => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false); // 여기서 exit 시작
    }, 1800);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {showIntro && (
        <motion.div
          key="intro"
          className={`fixed inset-0 z-50 flex items-center justify-center ${bgColorClassMap["blue"]}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="text-neutral100">박자로 채우는 우리 사이</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
