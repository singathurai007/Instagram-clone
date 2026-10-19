import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import CreatePost from "./CreatePost.jsx";
import Explore from "./Explore.jsx";
import Notifications from "./Notifications.jsx";
import PostDetail from "./PostDetail.jsx";
import Profile from "./Profile.jsx";
import Saved from "./Saved.jsx";
import Viewstory from "./Viewstory.jsx";
import { ThemeProvider } from "./context/theme.jsx";
import { ToastProvider } from "./context/toast.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/explore",
    element: <Explore />
  },
  {
    path: "/create",
    element: <CreatePost />
  },
  {
    path: "/post/:id",
    element: <PostDetail />
  },
  {
    path: "/saved",
    element: <Saved />
  },
  {
    path: "/notifications",
    element: <Notifications />
  },
  {
    path: "/story/:id/:tot",
    element: <Viewstory />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </ThemeProvider>
);
