import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/layout/Layout";
import ErrorPage from "./pages/errorPage/ErrorPage";
import Home from "./pages/home/Home";
import { AuthProvider } from "./context/AuthContext";
import Personal from "./pages/user/Personal";
import Email from "./pages/user/Email";
import Contact from "./pages/user/Contact";
import CreateQuestion from "./pages/createQuestion/CreateQuestion";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import Questions from "./pages/questions/Questions";
import AiRecommendationItem from "./components/userInformation/AiRecommendationItem";
import Password from "./pages/user/Password";
import QuestionDetail from "./pages/questionDetail/QuestionDetail";
import QuestionItemDetail from "./components/questionItem/QuestionItemDetail";
import CreatePostNew from "./pages/createPost/CreatePostNew";
import PostsNew from "./pages/posts/PostsNew";
import PostDetailNew from "./pages/postDetail/PostDetailNew";
import Attributes from "./pages/user/Attributes";
import UserPersonalProfile from "./pages/user/UserPersonalProfile";
import EventManage from "./pages/eventManage/EventManage";
import ExpertRoute from "./components/expertRoute/ExpertRoute";
import { EventPage } from "./pages/eventPage/EventPage";
import Events from "./pages/events/Events";
import CreateEvent from "./pages/createEvent/CreateEventPage";
import SearchDropdown from "./components/Test";
import UpdateEvent from "./pages/UpdateEvent/UpdateEvent";
import SearchResults from "./pages/searchResult/SearchResults";
import About from "./pages/about/About";
import FavoriteList from "./pages/favoritelist/FavoriteList";
import UserManage from "./pages/userManage/UserManage";
import PostEdit from "./pages/postEdit/PostEdit";
import QuestionEdit from "./pages/questionEdit/QuestionEdit";
import ChatPage from "./pages/chatPage/ChatPage";
import RecommendationPage from "./pages/recommendation/RecommendationPage";
import MyNotification from "./pages/notification/MyNotification";
import EmailVerification from "./pages/emailVerification/EmailVerification";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/forgotPassword/ResetPassword";
import GoogleCallback from "./pages/auth/GoogleCallback";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "post/posts", element: <PostsNew /> }, //Pending
      { path: "question/createquestion", element: <CreateQuestion /> }, //OK
      { path: "post/create", element: <CreatePostNew /> }, //OK
      { path: "post/edit/:pid", element: <PostEdit /> },
      { path: "question/questions", element: <Questions /> }, //OK
      { path: "post/postdetail/:pid", element: <PostDetailNew /> },
      { path: "question/questiondetail/:qid", element: <QuestionDetail /> },
      { path: "question/edit/:qid", element: <QuestionEdit /> },
      { path: "user/personal", element: <Personal /> }, //OK
      { path: "user/email", element: <Email /> },
      { path: "user/contact", element: <Contact /> }, //OK
      { path: "user/password", element: <Password /> },
      { path: "user/attributes", element: <Attributes /> },
      { path: "user/personalprofile/:uid", element: <UserPersonalProfile /> }, //OK
      { path: "user/manage", element: <UserManage /> },
      { path: "test", element: <SearchDropdown /> },
      { path: "event/calendar", element: <EventPage /> }, //OK
      { path: "event/events", element: <Events /> },
      {
        path: "event/create",
        element: (
          <ExpertRoute>
            <CreateEvent />
          </ExpertRoute>
        ),
      }, // Bảo vệ route
      {
        path: "event/update/:eid",
        element: (
          <ExpertRoute>
            <UpdateEvent />
          </ExpertRoute>
        ),
      },
      {
        path: "event/manage",
        element: (
          <ExpertRoute>
            <EventManage />
          </ExpertRoute>
        ),
      },

      { path: "search/:id", element: <SearchResults /> },
      { path: "about", element: <About /> },
      { path: "favoritelist", element: <FavoriteList /> },
      { path: "chat/", element: <ChatPage /> },
      { path: "recommendation", element: <RecommendationPage /> },
      { path: "notification", element: <MyNotification /> },
      { path: "verify-email/:token", element: <EmailVerification /> },
    ],
  },
  { path: "/signin", element: <SignIn /> }, //OK
  { path: "/signup", element: <SignUp /> }, //OK
  // { path: "/attributes", element: <AiRecommendationItem /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "reset-password/:token", element: <ResetPassword /> },
  { path: "auth/google/callback", element: <GoogleCallback /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
