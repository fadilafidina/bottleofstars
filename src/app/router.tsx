import { createBrowserRouter } from "react-router-dom";

import { AdminPage } from "../pages/admin-page";
import { BottleAddPage } from "../pages/bottle-add-page";
import { BottleViewPage } from "../pages/bottle-view-page";
import { HomePage } from "../pages/home-page";
import { NotFoundPage } from "../pages/not-found-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/bottle/:slug/add",
    element: <BottleAddPage />,
  },
  {
    path: "/bottle/:slug/view",
    element: <BottleViewPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
