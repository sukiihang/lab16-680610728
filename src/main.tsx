import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import RootLayout from "@/layouts/root-layout";
import HomePage from "@/pages/home";
import CoursesPage from "@/pages/admin/courses";
import EnrollmentsPage from "@/pages/admin/enrollments";

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
        path: "admin/courses",
        element: <CoursesPage />,
      },
      {
        path: "admin/enrollments",
        element: <EnrollmentsPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);