import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomeTemplate from "../pages";
import HomePage from "../pages/RoutesForAuthenticatedOnly/Home/Home";
import LoginPage from "../pages/Login/LoginPage";
import About from "../pages/About/About";
import { ProtectedRoute } from "./ProtectedRoute";
import storage from "../lib/storage";
import SignUpPage from "../pages/Register/SignUp";
import UserInfoPage from "../pages/UserInfo/UserInfo";
import UserListPage from "../pages/RoutesForAuthenticatedOnly/User/UserList";

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
          path: "/users-info",
          element: <HomeTemplate Component={UserListPage} />,
        },

        {
          path: "/profile",
          element: <div>Profile</div>,
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
