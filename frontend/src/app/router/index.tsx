import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "@/pages/Landing/index";
import { SignPage } from "@/pages/Sign";
import { PersonalSpacePage } from "@/pages/PersonalSpace";
import { TeamSpacePage } from "@/pages/TeamSpace";
// import { ScorePage } from '@/pages/Score';
import { LayoutShrink } from "../layouts/LayoutShrink";
import PageKakaoRedirect from "@/features/auth/kakao/ui/PageKakaoRedirect";
import { LayoutSwitcher } from "../layouts/LayoutSwitcher";
import { SpaceLayout } from "@/widgets/SpaceLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutSwitcher />,
    children: [
      {
        element: <SpaceLayout />,
        children: [
          {
            index: true,
            element: <PersonalSpacePage />,
          },
          {
            path: "/team/:teamId",
            element: <TeamSpacePage />,
          },
        ],
      },
    ],
  },
  {
    path: "/sign",
    element: (
      <LayoutShrink
        bgColor="black"
        children={<LandingPage />}
        rightChildren={<SignPage />}
        initialShrunk={true}
      />
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
