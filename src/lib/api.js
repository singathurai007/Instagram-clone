import axios from "axios";

/**
 * Base URL of the json-server REST API.
 * Override it with `VITE_API_URL` in a `.env.local` file (see `.env.example`).
 */
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

/** The signed-in user. This demo has no auth layer, so it is a constant. */
export const CURRENT_USER_ID = "1";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

/* ---------------- Posts ---------------- */

export const getPosts = () => api.get("/posts").then((res) => res.data);

export const updatePost = (id, payload) =>
  api.put(`/posts/${id}`, payload).then((res) => res.data);

/* ---------------- Stories ---------------- */

export const getStories = () => api.get("/stories").then((res) => res.data);

export const getStory = (id) =>
  api.get(`/stories/${id}`).then((res) => res.data);

/* ---------------- Profile ---------------- */

export const getProfile = (id = CURRENT_USER_ID) =>
  api.get(`/profile/${id}`).then((res) => res.data);

export const updateProfile = (id, payload) =>
  api.put(`/profile/${id}`, payload).then((res) => res.data);

export const getUser = (id = CURRENT_USER_ID) =>
  api.get(`/users/${id}`).then((res) => res.data);

export const updateUser = (id, payload) =>
  api.put(`/users/${id}`, payload).then((res) => res.data);

/* ---------------- Suggestions / following ---------------- */

export const getSuggestions = () =>
  api.get("/suggestion").then((res) => res.data);

export const getFollowing = () => api.get("/following").then((res) => res.data);

export const followUser = (user) =>
  api.post("/following", user).then((res) => res.data);

export const unfollowUser = (id) => api.delete(`/following/${id}`);

/**
 * Normalises an axios/network error into a message that is safe to render.
 */
export function getErrorMessage(error) {
  if (error?.response?.status === 404) {
    return "Not found.";
  }

  if (error?.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }

  if (error?.response) {
    return `Request failed (${error.response.status}).`;
  }

  return `Cannot reach the API at ${API_URL}. Run "npm run server" and try again.`;
}
