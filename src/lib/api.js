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

export const getPost = (id) => api.get(`/posts/${id}`).then((res) => res.data);

/**
 * Publishes a new post. json-server assigns the id, so the payload only
 * carries the fields the create form collects.
 */
export const createPost = ({ image, caption, location }) =>
  api
    .post("/posts", {
      userId: CURRENT_USER_ID,
      image,
      caption: caption ?? "",
      location: location ?? "",
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    })
    .then((res) => res.data);

export const updatePost = (id, payload) =>
  api.put(`/posts/${id}`, payload).then((res) => res.data);

export const deletePost = (id) => api.delete(`/posts/${id}`);

/**
 * Adds a comment to a post. Comments live inside the post document, so the
 * whole post is written back with the new comment appended.
 */
export async function addComment(post, text) {
  const comment = {
    id: Date.now(),
    userId: CURRENT_USER_ID,
    text,
    createdAt: new Date().toISOString()
  };

  return updatePost(post.id, {
    ...post,
    comments: [...(post.comments ?? []), comment]
  });
}

/** Removes one comment from a post. */
export async function deleteComment(post, commentId) {
  return updatePost(post.id, {
    ...post,
    comments: (post.comments ?? []).filter(
      (comment) => String(comment.id) !== String(commentId)
    )
  });
}

/* ---------------- Stories ---------------- */

export const getStories = () => api.get("/stories").then((res) => res.data);

export const getStory = (id) =>
  api.get(`/stories/${id}`).then((res) => res.data);

/* ---------------- Users ---------------- */

export const getUsers = () => api.get("/users").then((res) => res.data);

export const getUser = (id = CURRENT_USER_ID) =>
  api.get(`/users/${id}`).then((res) => res.data);

export const updateUser = (id, payload) =>
  api.put(`/users/${id}`, payload).then((res) => res.data);

/* ---------------- Profile card ---------------- */

export const getProfile = (id = CURRENT_USER_ID) =>
  api.get(`/profile/${id}`).then((res) => res.data);

export const updateProfile = (id, payload) =>
  api.put(`/profile/${id}`, payload).then((res) => res.data);

/* ---------------- Suggestions / following ---------------- */

export const getSuggestions = () =>
  api.get("/suggestion").then((res) => res.data);

export const getFollowing = () => api.get("/following").then((res) => res.data);

/**
 * Follows a suggested account. The record keeps the followed user's id in a
 * dedicated field because json-server generates its own primary key.
 */
export const followUser = (user) =>
  api
    .post("/following", {
      userId: user.id,
      username: user.username,
      profilePic: user.profilePic,
      followedBy: CURRENT_USER_ID
    })
    .then((res) => res.data);

export const unfollowUser = (id) => api.delete(`/following/${id}`);

/* ---------------- Saved posts ---------------- */

export const getSaved = () => api.get("/saved").then((res) => res.data);

export const savePost = (postId) =>
  api
    .post("/saved", { postId: String(postId), userId: CURRENT_USER_ID })
    .then((res) => res.data);

export const unsavePost = (recordId) => api.delete(`/saved/${recordId}`);

/* ---------------- Notifications ---------------- */

export const getNotifications = () =>
  api.get("/notifications").then((res) => res.data);

export const markNotificationRead = (id) =>
  api.get(`/notifications/${id}`).then((res) =>
    api
      .put(`/notifications/${id}`, { ...res.data, read: true })
      .then((updated) => updated.data)
  );

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
