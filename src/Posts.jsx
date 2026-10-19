import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBookmark,
  FaHeart,
  FaPaperPlane,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
  FaTrash
} from "react-icons/fa";

import Comments from "./Comments";
import {
  CURRENT_USER_ID,
  deletePost,
  getErrorMessage,
  getPosts,
  getSaved,
  getUsers,
  savePost,
  unsavePost,
  updatePost
} from "./lib/api";
import { formatLikes, formatRelativeTime } from "./lib/format";
import { copyToClipboard, postLink } from "./lib/share";
import { useToast } from "./context/toast.jsx";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState({});
  const [savedRecords, setSavedRecords] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [burstId, setBurstId] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    let active = true;

    Promise.all([getPosts(), getUsers(), getSaved()])
      .then(([postList, users, records]) => {
        if (!active) return;

        setPosts(
          [...postList].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        setAuthors(
          users.reduce((map, user) => ({ ...map, [user.id]: user }), {})
        );
        setSavedRecords(records);
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

  const savedIds = useMemo(
    () => new Set(savedRecords.map((record) => String(record.postId))),
    [savedRecords]
  );

  const replacePost = (updated) =>
    setPosts((current) =>
      current.map((item) => (item.id === updated.id ? updated : item))
    );

  async function toggleLike(post) {
    const likes = post.likes ?? [];
    const liked = likes.includes(CURRENT_USER_ID);

    const nextLikes = liked
      ? likes.filter((id) => id !== CURRENT_USER_ID)
      : [...likes, CURRENT_USER_ID];

    /* Optimistic update, rolled back if the request fails. */
    replacePost({ ...post, likes: nextLikes });

    try {
      await updatePost(post.id, { ...post, likes: nextLikes });
    } catch (err) {
      replacePost({ ...post, likes });
      showToast(getErrorMessage(err), "error");
    }
  }

  /** Instagram-style double tap: like once and play the heart burst. */
  function handleDoubleTap(post) {
    const liked = (post.likes ?? []).includes(CURRENT_USER_ID);

    if (!liked) {
      toggleLike(post);
    }

    setBurstId(post.id);
    window.setTimeout(
      () => setBurstId((current) => (current === post.id ? null : current)),
      900
    );
  }

  async function toggleSave(post) {
    const record = savedRecords.find(
      (item) => String(item.postId) === String(post.id)
    );

    if (record) {
      setSavedRecords((current) =>
        current.filter((item) => item.id !== record.id)
      );

      try {
        await unsavePost(record.id);
      } catch (err) {
        setSavedRecords((current) => [...current, record]);
        showToast(getErrorMessage(err), "error");
      }

      return;
    }

    try {
      const created = await savePost(post.id);
      setSavedRecords((current) => [...current, created]);
      showToast("Saved to your collection.", "success");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  }

  async function handleShare(post) {
    const copied = await copyToClipboard(postLink(post.id));

    showToast(
      copied ? "Link copied to clipboard." : "Could not copy the link.",
      copied ? "success" : "error"
    );
  }

  async function handleDelete(post) {
    if (!window.confirm("Delete this post? This cannot be undone.")) {
      return;
    }

    const previous = posts;
    setPosts((current) => current.filter((item) => item.id !== post.id));

    try {
      await deletePost(post.id);
      showToast("Post deleted.", "success");
    } catch (err) {
      setPosts(previous);
      showToast(getErrorMessage(err), "error");
    }
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
        <p className="state">
          No posts yet. <Link to="/create">Create the first one.</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="posts">
      {posts.map((post) => {
        const author = authors[post.userId];
        const likes = post.likes ?? [];
        const liked = likes.includes(CURRENT_USER_ID);
        const isSaved = savedIds.has(String(post.id));
        const isMine = String(post.userId) === String(CURRENT_USER_ID);

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

                <span className="post-sub">
                  {post.location && (
                    <span className="post-location">{post.location}</span>
                  )}
                  {post.location && post.createdAt && (
                    <span aria-hidden="true"> · </span>
                  )}
                  {post.createdAt && (
                    <time dateTime={post.createdAt}>
                      {formatRelativeTime(post.createdAt)}
                    </time>
                  )}
                </span>
              </div>

              {isMine && (
                <button
                  type="button"
                  className="post-delete"
                  onClick={() => handleDelete(post)}
                  aria-label="Delete post"
                >
                  <FaTrash aria-hidden="true" />
                </button>
              )}
            </header>

            <div className="post-media-wrap">
              <img
                className="post-media"
                src={post.image}
                alt={post.caption ?? "Post"}
                loading="lazy"
                onDoubleClick={() => handleDoubleTap(post)}
              />

              {burstId === post.id && (
                <span className="heart-burst" aria-hidden="true">
                  <FaHeart />
                </span>
              )}
            </div>

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

              <Link
                className="post-action"
                to={`/post/${post.id}`}
                aria-label="Comment on post"
              >
                <FaRegComment />
              </Link>

              <button
                type="button"
                className="post-action"
                onClick={() => handleShare(post)}
                aria-label="Share post"
              >
                <FaPaperPlane />
              </button>

              <button
                type="button"
                className="post-action post-action-end"
                onClick={() => toggleSave(post)}
                aria-pressed={isSaved}
                aria-label={isSaved ? "Remove from saved" : "Save post"}
              >
                {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            </div>

            <div className="post-body">
              <p className="post-likes">{formatLikes(likes.length)}</p>

              <p className="post-caption">
                <strong>{author?.username ?? "unknown"}</strong>{" "}
                {post.caption}
              </p>

              <Comments
                post={post}
                authors={authors}
                onPostChange={replacePost}
                limit={2}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default Posts;
