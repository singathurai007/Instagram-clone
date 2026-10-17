import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import Profile from "./Profile.jsx";
import Viewstory from "./Viewstory.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
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
  <RouterProvider router={router} />
);
