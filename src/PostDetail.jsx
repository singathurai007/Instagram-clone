import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaBookmark,
  FaHeart,
  FaPaperPlane,
  FaRegBookmark,
  FaRegHeart,
  FaRegComment,
  FaTrash
} from "react-icons/fa";

import Comments from "./Comments";
import {
  CURRENT_USER_ID,
  deletePost,
  getErrorMessage,
  getPost,
  getSaved,
  getUsers,
  savePost,
  unsavePost,
  updatePost
} from "./lib/api";
import { formatLikes, formatRelativeTime } from "./lib/format";
import { copyToClipboard, postLink } from "./lib/share";
import { useToast } from "./context/toast.jsx";

function PostDetail() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [authors, setAuthors] = useState({});
  const [savedRecordId, setSavedRecordId] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [burst, setBurst] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;

    Promise.all([getPost(id), getUsers(), getSaved()])
      .then(([postData, users, savedRecords]) => {
        if (!active) return;

        setPost(postData);
        setAuthors(
          users.reduce((map, user) => ({ ...map, [user.id]: user }), {})
        );
        setSavedRecordId(
          savedRecords.find((record) => String(record.postId) === String(id))
            ?.id ?? null
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
  }, [id]);

  const author = post ? authors[post.userId] : null;
  const likes = post?.likes ?? [];
  const liked = likes.includes(CURRENT_USER_ID);
  const isMine = String(post?.userId) === String(CURRENT_USER_ID);

  const toggleLike = useCallback(async () => {
    if (!post) {
      return;
    }

    const currentLikes = post.likes ?? [];
    const isLiked = currentLikes.includes(CURRENT_USER_ID);

    const nextLikes = isLiked
      ? currentLikes.filter((userId) => userId !== CURRENT_USER_ID)
      : [...currentLikes, CURRENT_USER_ID];

    setPost((current) => ({ ...current, likes: nextLikes }));

    try {
      const updated = await updatePost(post.id, { ...post, likes: nextLikes });
      setPost(updated);
    } catch (err) {
      setPost((current) => ({ ...current, likes: currentLikes }));
      showToast(getErrorMessage(err), "error");
    }
  }, [post, showToast]);

  function handleDoubleClick() {
    if (!post || liked) {
      return;
    }

    toggleLike();
    setBurst(true);
    window.setTimeout(() => setBurst(false), 900);
  }

  async function toggleSave() {
    const wasSaved = Boolean(savedRecordId);

    if (wasSaved) {
      setSavedRecordId(null);

      try {
        await unsavePost(savedRecordId);
        showToast("Removed from saved.", "info");
      } catch (err) {
        setSavedRecordId(wasSaved ? savedRecordId : null);
        showToast(getErrorMessage(err), "error");
      }

      return;
    }

    try {
      const record = await savePost(post.id);
      setSavedRecordId(record.id);
      showToast("Saved to your collection.", "success");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  }

  async function handleShare() {
    const copied = await copyToClipboard(postLink(post.id));

    showToast(
      copied ? "Link copied to clipboard." : "Could not copy the link.",
      copied ? "success" : "error"
    );
  }

  async function handleDelete() {
    if (!window.confirm("Delete this post? This cannot be undone.")) {
      return;
    }

    try {
      await deletePost(post.id);
      showToast("Post deleted.", "success");
      navigate("/");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  }

  if (status === "loading") {
    return (
      <div className="page page-wide" aria-busy="true">
        <div className="post-detail">
          <span className="skeleton skeleton-square" />
          <div className="post-detail-panel">
            <span className="skeleton skeleton-text" />
            <span className="skeleton skeleton-text" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="page">
        <p className="state state-error" role="alert">
          {error}
        </p>
        <button
          type="button"
          className="btn btn-dark"
          onClick={() => navigate("/")}
        >
          Back to feed
        </button>
      </div>
    );
  }

  return (
    <div className="page page-wide">
      <header className="page-header">
        <button
          type="button"
          className="page-back"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <i className="bi bi-arrow-left" aria-hidden="true" />
        </button>

        <h1>Post</h1>

        {isMine && (
          <button
            type="button"
            className="page-icon-btn"
            onClick={handleDelete}
            aria-label="Delete post"
          >
            <FaTrash aria-hidden="true" />
          </button>
        )}
      </header>

      <div className="post-detail">
        <div className="post-detail-media">
          <img
            src={post.image}
            alt={post.caption || "Post"}
            onDoubleClick={handleDoubleClick}
          />

          {burst && (
            <span className="heart-burst" aria-hidden="true">
              <FaHeart />
            </span>
          )}
        </div>

        <div className="post-detail-panel">
          <header className="post-detail-author">
            <img
              className="post-avatar"
              src={author?.profilePic}
              alt=""
              loading="lazy"
            />
            <div className="post-meta">
              <strong>{author?.username ?? "unknown"}</strong>
              {post.location && (
                <span className="post-location">{post.location}</span>
              )}
            </div>
          </header>

          {post.caption && (
            <p className="post-detail-caption">
              <strong>{author?.username ?? "unknown"}</strong> {post.caption}
            </p>
          )}

          <div className="post-actions">
            <button
              type="button"
              className={`post-action${liked ? " is-liked" : ""}`}
              onClick={toggleLike}
              aria-pressed={liked}
              aria-label={liked ? "Unlike post" : "Like post"}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
            </button>

            <button
              type="button"
              className="post-action"
              onClick={() => navigate(`/post/${post.id}`)}
              aria-label="Comment on post"
            >
              <FaRegComment />
            </button>

            <button
              type="button"
              className="post-action"
              onClick={handleShare}
              aria-label="Share post"
            >
              <FaPaperPlane />
            </button>

            <button
              type="button"
              className="post-action post-action-end"
              onClick={toggleSave}
              aria-pressed={Boolean(savedRecordId)}
              aria-label={savedRecordId ? "Remove from saved" : "Save post"}
            >
              {savedRecordId ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>

          <p className="post-likes">{formatLikes(likes.length)}</p>

          {post.createdAt && (
            <time className="post-detail-time" dateTime={post.createdAt}>
              {formatRelativeTime(post.createdAt)}
            </time>
          )}

          <Comments
            post={post}
            authors={authors}
            onPostChange={setPost}
            className="comments--panel"
          />
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
