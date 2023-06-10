import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomeTemplate from "../pages";
import HomePage from "../pages/Home/Home";
import LoginPage from "../pages/Login/LoginPage";
import About from "../pages/About/About";
import { ProtectedRoute } from "./ProtectedRoute";
import storage from "../lib/storage";

const Routes = () => {
  const token = storage.get("token");

  const routesForPublic = [
    {
      path: "/service",
      element: <div>Service Page</div>,
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
          path: "/profile",
          element: <div>User Profile</div>,
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
