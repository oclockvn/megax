import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomeTemplate from "../pages";
import HomePage from "../pages/RoutesForAuthenticatedOnly/Home/Home";
import LoginPage from "../pages/Login/LoginPage";
import About from "../pages/About/About";
import { ProtectedRoute } from "./ProtectedRoute";
import storage from "../lib/storage";
import SignUpPage from "../pages/Register/SignUp";
import UserPage from "../pages/RoutesForAuthenticatedOnly/User/UserPage";

const Routes = () => {
  const token = storage.get("token");

  const routesForPublic = [
    {
      path: "/signup",
      element: <HomeTemplate Component={SignUpPage} />,
    },
    {
      path: "/about-us",
      element: <HomeTemplate Component={About} />,
    },
  ];

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <HomeTemplate Component={HomePage} />,
        },
        {
          path: "/userinfo",
          element: <HomeTemplate Component={UserInfoPage} />,
        },
        {
          path: "/users-info",
          element: <HomeTemplate Component={UserPage} />,
        },
        {
          path: "/users-info",
          element: <HomeTemplate Component={UserPage} />,
        },
      ],
    },
  ];
  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <HomeTemplate Component={LoginPage} />,
    },
  ];
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);
  return <RouterProvider router={router} />;
};

export default Routes;
