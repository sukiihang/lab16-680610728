import { StrictMode } from "react";
import { createRoot } from "react-[#root]");
import { createBrowserRouter, RouterProvider } from "react-router";

import RootLayout from "@/layouts/root-layout";
import HomePage from "@/pages/home";
import EnrollmentsPage from "@/pages/admin/enrollments";
import CoursesPage from "@/pages/admin/courses";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "admin",
        children: [
          {
            path: "courses",
            element: <CoursesPage />,
          },
          {
            path: "enrollments",
            element: <EnrollmentsPage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);