import { useGlobalStore } from "@/app/store/globalStore";
import { IconButton } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/Button";
import { Logo } from "@/shared/ui/Logo";
import classNames from "classnames";
import { HtmlHTMLAttributes } from "react";

interface HeaderDefaultProps extends HtmlHTMLAttributes<HTMLDivElement> {
  onLogoClick?: () => void;
  onShrink?: () => void;
  onExpand?: () => void;
}

export const HeaderDefault = ({
  onLogoClick,
  onShrink,
  onExpand,
  className,
  ...props
}: HeaderDefaultProps) => {
  const isLoggedIn = useGlobalStore((state) => state.isLoggedIn);

  return (
    <header
      className={classNames(
        "z-30 w-full flex bg-neutral100/30 justify-between items-center px-6 py-2 border-b border-neutral100/30 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div>
        <Logo onClick={onLogoClick} />
      </div>
      <div>몰라몰라몰라???</div>
      <div>
        {isLoggedIn ? (
          <IconButton
            icon="notifications"
            fill
            onClick={() => {
              console.log("click test for dev");
            }}
            className="-mr-2"
          />
        ) : (
          <Button onClick={onShrink}>로그인/회원가입하러 가기</Button>
        )}
      </div>
    </header>
  );
};
