import { useGlobalStore } from "@/app/store/globalStore";
import { IconButton } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/Button";
import { Logo } from "@/shared/ui/Logo";
import classNames from "classnames";
import { HtmlHTMLAttributes } from "react";
import { useCallback } from "react";

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

  // 배포 환경에서 nginx가 /api/* 를 스프링부트로 포워딩
  // 클릭 시 화면 전체를 /api/test 로 내비게이트
  const proxyTest = useCallback(() => {
    window.location.href = "/api/test";
  }, []);

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
      <div>머지가 되어라???</div>
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
          <Button onClick={proxyTest}>v프록시 테스트!</Button>
        )}
      </div>
    </header>
  );
};
