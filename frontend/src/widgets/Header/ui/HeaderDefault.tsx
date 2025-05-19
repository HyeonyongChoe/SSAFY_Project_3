import { useGlobalStore } from "@/app/store/globalStore";
import { IconButton } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/Button";
import { Logo } from "@/shared/ui/Logo";
import classNames from "classnames";
import { HtmlHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { Popover } from "@/shared/ui/Popover";
import { NotificationItem } from "@/shared/ui/Notification/NotificationItem";

interface HeaderDefaultProps extends HtmlHTMLAttributes<HTMLDivElement> {
  text?: String;
  onLogoClick?: () => void;
  onShrink?: () => void;
  onExpand?: () => void;
  isSignPage?: boolean;
}

export const HeaderDefault = ({
  text,
  onLogoClick,
  onShrink,
  onExpand,
  isSignPage,
  className,
  ...props
}: HeaderDefaultProps) => {
  const isLoggedIn = useGlobalStore((state) => state.isLoggedIn);

  return (
    <header
      className={classNames(
        "z-30 h-[3.525rem] w-full flex bg-neutral100/30 justify-between items-center px-6 py-2 border-b border-neutral100/30 b-blur",
        className
      )}
      {...props}
    >
      <div>
        <Logo onClick={onLogoClick} />
      </div>
      {text && <div>{text}</div>}
      <div>
        {isLoggedIn ? (
          <Popover
            directionY="bottom"
            className={`translate-x-[.5rem] h-[16rem] flex flex-col pb-0 px-0`}
            trigger={
              <IconButton
                icon="notifications"
                fill
                onClick={() => {
                  console.log("click test for dev");
                }}
                className="-mr-2"
              />
            }
          >
            <div className="px-4 pb-3 pt-1 text-lg font-bold text-left border-b">
              알림
            </div>
            <div className="p-3 flex flex-col gap-2 overflow-y-auto scroll-custom">
              {Array.from({ length: 10 }).map((_, index) => (
                <NotificationItem key={index} />
              ))}
            </div>
          </Popover>
        ) : !isSignPage ? (
          <motion.div
            key="login-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button onClick={onShrink}>로그인/회원가입하러 가기</Button>
          </motion.div>
        ) : null}
      </div>
    </header>
  );
};
