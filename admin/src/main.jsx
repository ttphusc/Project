import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/home/Home";
import ErrorPage from "./pages/error/ErrorPage";
import Layout from "./components/layout/layout/Layout";
import UserManage from "./pages/admin/UserManage";
import QuestionManage from "./pages/admin/QuestionManage";
import ReportManage from "./pages/admin/ReportManage";
import EventManage from "./pages/admin/EventManage";
import PostManage from "./pages/admin/PostManage";
import QuestionManagementItem from "./components/items/QuestionManageItem";
import SignIn from "./pages/auth/Signin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/user", element: <UserManage /> },
      { path: "/question", element: <QuestionManage /> },
      { path: "/report", element: <ReportManage /> },
      { path: "/event", element: <EventManage /> },
      { path: "/post", element: <PostManage /> },
    ],
  },
  { path: "/signin", element: <SignIn /> }, //OK
  // { path: "/signup", element: <SignUp /> }, //OK
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <AuthProvider> */}
    <RouterProvider router={router} />
    {/* </AuthProvider> */}
  </React.StrictMode>
);
