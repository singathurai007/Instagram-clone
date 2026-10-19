import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

import {
  CURRENT_USER_ID,
  addComment,
  deleteComment,
  getErrorMessage
} from "./lib/api";
import { formatNumber, formatRelativeTime } from "./lib/format";
import { useToast } from "./context/toast.jsx";

/**
 * Comment thread + "add a comment" form for a single post.
 *
 * Controlled component: the parent owns the post, and every successful write
 * is handed back through `onPostChange` so lists stay in sync.
 *
 * @param {object} props
 * @param {number|string} [props.limit] show only the newest N comments
 */
function Comments({ post, authors, onPostChange, limit, className = "" }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingId, setPendingId] = useState(null);

  const { showToast } = useToast();

  const comments = post.comments ?? [];
  const visible =
    typeof limit === "number" ? comments.slice(-limit) : comments;
  const hidden = comments.length - visible.length;

  async function handleSubmit(event) {
    event.preventDefault();

    const value = text.trim();

    if (!value || busy) {
      return;
    }

    setBusy(true);

    try {
      const updated = await addComment(post, value);
      onPostChange(updated);
      setText("");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(commentId) {
    setPendingId(commentId);

    try {
      const updated = await deleteComment(post, commentId);
      onPostChange(updated);
      showToast("Comment deleted.", "success");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className={`comments ${className}`.trim()}>
      {hidden > 0 && (
        <Link className="comments-more" to={`/post/${post.id}`}>
          View all {formatNumber(comments.length)} comments
        </Link>
      )}

      {!comments.length && (
        <p className="comments-empty">No comments yet — be the first.</p>
      )}

      {comments.length > 0 && (
        <ul className="comments-list">
          {visible.map((comment) => {
            const author = authors[comment.userId];
            const isMine =
              String(comment.userId) === String(CURRENT_USER_ID);

            return (
              <li className="comment" key={comment.id}>
                <img
                  className="comment-avatar"
                  src={author?.profilePic}
                  alt=""
                  loading="lazy"
                />

                <div className="comment-body">
                  <p className="comment-text">
                    <strong>{author?.username ?? "unknown"}</strong>{" "}
                    {comment.text}
                  </p>

                  <div className="comment-meta">
                    {comment.createdAt && (
                      <time dateTime={comment.createdAt}>
                        {formatRelativeTime(comment.createdAt)}
                      </time>
                    )}

                    {isMine && (
                      <button
                        type="button"
                        className="comment-delete"
                        onClick={() => handleDelete(comment.id)}
                        disabled={pendingId === comment.id}
                        aria-label="Delete comment"
                      >
                        <FaTrash aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="comment-input"
          placeholder="Add a comment…"
          aria-label="Add a comment"
          value={text}
          maxLength={220}
          onChange={(event) => setText(event.target.value)}
        />

        <button
          type="submit"
          className="comment-submit"
          disabled={busy || !text.trim()}
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default Comments;
