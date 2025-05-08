import { useGlobalStore } from "@/app/store/globalStore";
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
      <div>임시 헤더, 조정 예정</div>
      <div>
        {isLoggedIn ? (
          <div className="text-neutral100">알림</div>
        ) : (
          <button
            onClick={onShrink}
            className="bg-brandcolor200 rounded-xl px-3 py-1.5"
          >
            로그인/회원가입하러 가기
          </button>
        )}
      </div>
    </header>
  );
};
