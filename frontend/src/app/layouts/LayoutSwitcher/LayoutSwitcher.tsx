import { useGlobalStore } from "@/app/store/globalStore";
import { LayoutShrink } from "../LayoutShrink";
import { LandingPage } from "@/pages/Landing";
import { SignPage } from "@/pages/Sign";
import { LayoutDefault } from "../LayoutDefault";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { IntroPageHandler } from "@/widgets/IntroPageHandler";

export const LayoutSwitcher = () => {
  const isLoggedIn = useGlobalStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <>
        <IntroPageHandler>
          <LayoutShrink
            bgColor="black"
            children={<LandingPage />}
            rightChildren={<SignPage />}
          />
        </IntroPageHandler>
      </>
    );
  }

  return (
    <LayoutDefault bgColor="black" noScroll>
      <Outlet />
    </LayoutDefault>
  );
};
