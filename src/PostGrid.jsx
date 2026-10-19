import { Link } from "react-router-dom";
import { FaBookmark, FaHeart, FaRegComment } from "react-icons/fa";

import { formatCompact } from "./lib/format";

/**
 * Square thumbnail grid used by the Explore and Saved pages.
 *
 * @param {function} [onRemove] optional handler that renders a remove button
 */
function PostGrid({ posts, authors, emptyMessage = "Nothing to show yet.", onRemove }) {
  if (!posts.length) {
    return <p className="state">{emptyMessage}</p>;
  }

  return (
    <ul className="post-grid">
      {posts.map((post) => {
        const author = authors[post.userId];

        return (
          <li className="post-grid-cell" key={post.id}>
            <Link
              className="post-grid-item"
              to={`/post/${post.id}`}
              aria-label={`Open post by ${author?.username ?? "unknown"}`}
            >
              <img
                src={post.image}
                alt={post.caption || "Post"}
                loading="lazy"
              />

              <span className="post-grid-overlay">
                <span>
                  <FaHeart aria-hidden="true" />{" "}
                  {formatCompact((post.likes ?? []).length)}
                </span>
                <span>
                  <FaRegComment aria-hidden="true" />{" "}
                  {formatCompact((post.comments ?? []).length)}
                </span>
              </span>
            </Link>

            {onRemove && (
              <button
                type="button"
                className="post-grid-remove"
                onClick={() => onRemove(post.id)}
                aria-label="Remove from saved"
              >
                <FaBookmark aria-hidden="true" />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default PostGrid;
