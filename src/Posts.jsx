import { useEffect, useState } from "react";

import {
  FaBookmark,
  FaHeart,
  FaPaperPlane,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart
} from "react-icons/fa";

import {
  CURRENT_USER_ID,
  getErrorMessage,
  getPosts,
  api,
  updatePost
} from "./lib/api";
import {
  formatComments,
  formatLikes,
  formatRelativeTime
} from "./lib/format";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState({});
  const [saved, setSaved] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getPosts(), api.get("/users").then((res) => res.data)])
      .then(([postList, users]) => {
        if (!active) return;
        setPosts(postList);
        setAuthors(
          users.reduce((map, user) => ({ ...map, [user.id]: user }), {})
        );
        setStatus("ready");
      })
      .catch((err) => {
        if (!active) return;
        setError(getErrorMessage(err));
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  async function toggleLike(post) {
    const likes = post.likes ?? [];
    const liked = likes.includes(CURRENT_USER_ID);

    const nextLikes = liked
      ? likes.filter((id) => id !== CURRENT_USER_ID)
      : [...likes, CURRENT_USER_ID];

    /* Optimistic update, rolled back if the request fails. */
    setPosts((current) =>
      current.map((item) =>
        item.id === post.id ? { ...item, likes: nextLikes } : item
      )
    );

    try {
      await updatePost(post.id, { ...post, likes: nextLikes });
    } catch (err) {
      setPosts((current) =>
        current.map((item) =>
          item.id === post.id ? { ...item, likes } : item
        )
      );
      setError(getErrorMessage(err));
    }
  }

  function toggleSave(id) {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  if (status === "loading") {
    return (
      <div className="posts">
        {[1, 2].map((item) => (
          <article className="post-card" key={item} aria-busy="true">
            <div className="post-header">
              <span className="skeleton skeleton-avatar" />
              <span className="skeleton skeleton-text" />
            </div>
            <div className="skeleton skeleton-media" />
          </article>
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="posts">
        <p className="state state-error" role="alert">
          {error}
        </p>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="posts">
        <p className="state">No posts to show yet.</p>
      </div>
    );
  }

  return (
    <div className="posts">
      {error && (
        <p className="state state-error" role="alert">
          {error}
        </p>
      )}

      {posts.map((post) => {
        const author = authors[post.userId];
        const likes = post.likes ?? [];
        const liked = likes.includes(CURRENT_USER_ID);
        const comments = post.comments ?? [];
        const isSaved = saved.includes(post.id);

        return (
          <article className="post-card" key={post.id}>
            <header className="post-header">
              <img
                className="post-avatar"
                src={author?.profilePic}
                alt=""
                loading="lazy"
              />

              <div className="post-meta">
                <strong>{author?.username ?? "unknown"}</strong>
                {post.createdAt && (
                  <time dateTime={post.createdAt}>
                    {formatRelativeTime(post.createdAt)}
                  </time>
                )}
              </div>
            </header>

            <img
              className="post-media"
              src={post.image}
              alt={post.caption ?? "Post"}
              loading="lazy"
            />

            <div className="post-actions">
              <button
                type="button"
                className={`post-action${liked ? " is-liked" : ""}`}
                onClick={() => toggleLike(post)}
                aria-pressed={liked}
                aria-label={liked ? "Unlike post" : "Like post"}
              >
                {liked ? <FaHeart /> : <FaRegHeart />}
              </button>

              <button
                type="button"
                className="post-action"
                aria-label="Comment on post"
              >
                <FaRegComment />
              </button>

              <button type="button" className="post-action" aria-label="Share post">
                <FaPaperPlane />
              </button>

              <button
                type="button"
                className="post-action post-action-end"
                onClick={() => toggleSave(post.id)}
                aria-pressed={isSaved}
                aria-label={isSaved ? "Remove from saved" : "Save post"}
              >
                {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            </div>

            <div className="post-body">
              <p className="post-likes">{formatLikes(likes.length)}</p>

              <p className="post-caption">
                <strong>{author?.username ?? "unknown"}</strong> {post.caption}
              </p>

              <p className="post-comments">{formatComments(comments.length)}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default Posts;
