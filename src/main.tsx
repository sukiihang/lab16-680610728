import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import RootLayout from "@/layouts/root-layout";
import HomePage from "@/pages/home";
import CoursesPage from "@/pages/admin/courses";
import EnrollmentsPage from "@/pages/admin/enrollments";
import { ThemeProvider } from "@/components/theme-provider";

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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);