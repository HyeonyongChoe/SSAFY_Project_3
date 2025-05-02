// src/app/router/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingPage } from '@/pages/Landing/index';
// import { SignUpPage } from '@/pages/SignUp';
// import { PersonalSpacePage } from '@/pages/PersonalSpace'; // ✅ 이거 추가!
// import { TeamSpacePage } from '@/pages/TeamSpace';
// import { ScorePage } from '@/pages/Score';
import { ScorePage } from '@/pages/Score/index'
import { useGlobalStore } from '@/app/store/globalStore';
import { EditScorePage } from '@/pages/EditScore'


const RootRoute = () => {
  const isLoggedIn = useGlobalStore((state) => state.isLoggedIn); // ✅ 문제 없음

  return isLoggedIn ? <PersonalSpacePage /> : <LandingPage />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
  },
  {
    path: '/score',
    element: <ScorePage />,
  },
  {
    path: '/edit',
    element: <EditScorePage />,
  },
  
//   {
//     path: '/signup',
//     element: <SignUpPage />,
//   },
//   {
//     path: '/team/:teamId',
//     element: <TeamSpacePage />,
//   },
//   {
//     path: '/score/:scoreId',
//     element: <ScorePage />,
//   },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
