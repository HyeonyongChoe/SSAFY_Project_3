// src/app/router/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "@/pages/Landing/index";
import { SignPage } from "@/pages/Sign";
import { PersonalSpacePage } from "@/pages/PersonalSpace";
import { TeamSpacePage } from "@/pages/TeamSpace";
// import { ScorePage } from '@/pages/Score';
import { useGlobalStore } from "@/app/store/globalStore";
import { useState } from "react";
import { IntroPage } from "@/pages/Intro";
import { LayoutShrink } from "../layouts/LayoutShrink";
import { LayoutDefault } from "../layouts/LayoutDefault";
import PageKakaoRedirect from "@/features/auth/kakao/ui/PageKakaoRedirect";

const RootRoute = () => {
  const isLoggedIn = useGlobalStore((state) => state.isLoggedIn);
  const [showIntro, setShowIntro] = useState(!isLoggedIn);

  const handleIntroFinish = () => {
    setShowIntro(false);
  };

  const content = isLoggedIn ? (
    <LayoutDefault bgColor="black" noScroll>
      <PersonalSpacePage />
    </LayoutDefault>
  ) : (
    <LayoutShrink
      bgColor="black"
      children={<LandingPage />}
      rightChildren={<SignPage />}
    />
  );

  return (
    <>
      {content}
      {showIntro && <IntroPage onFinish={handleIntroFinish} />}
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
  },
  {
    path: "/team/:teamId",
    element: (
      <LayoutDefault bgColor="black" noScroll>
        <TeamSpacePage />
      </LayoutDefault>
    ),
  },
  {
    path: import.meta.env.VITE_KAKAO_REDIRECT_URI,
    element: <PageKakaoRedirect />,
  },
  //   {
  //     path: '/score/:scoreId',
  //     element: <ScorePage />,
  //   },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
