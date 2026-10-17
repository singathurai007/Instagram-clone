import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { getErrorMessage, getStory } from "./lib/api";

function Viewstory() {
  const { id, tot } = useParams();

  const position = Number(id);
  const total = Number(tot);

  const [story, setStory] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const [failedId, setFailedId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const isOutOfRange =
    !Number.isInteger(position) || position < 1 || position > total;

  const isLoading = loadedId !== id && failedId !== id;

  useEffect(() => {
    if (isOutOfRange) {
      return;
    }

    let active = true;

    getStory(id)
      .then((data) => {
        if (!active) return;
        setStory(data);
        setLoadedId(id);
        setFailedId(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(getErrorMessage(err));
        setFailedId(id);
      });

    return () => {
      active = false;
    };
  }, [id, isOutOfRange]);

  /* An out-of-range story id should send the visitor back to the feed. */
  if (isOutOfRange) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="story-viewer">
      <header className="page-header story-viewer-header">
        <button
          type="button"
          className="page-back"
          onClick={() => navigate("/")}
          aria-label="Close story"
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>

        <div className="story-progress" role="presentation">
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              className={`story-progress-bar${
                index < position ? " filled" : ""
              }`}
            />
          ))}
        </div>
      </header>

      <div className="story-viewer-body">
        {isLoading && (
          <p className="state" aria-busy="true">
            Loading story…
          </p>
        )}

        {failedId === id && (
          <p className="state state-error" role="alert">
            {error}
          </p>
        )}

        {!isLoading && failedId !== id && story && (
          <figure className="story-card">
            <img src={story.image} alt={`Story by ${story.user?.username}`} />

            <figcaption>{story.user?.username ?? "unknown"}</figcaption>
          </figure>
        )}
      </div>

      <nav className="story-viewer-nav" aria-label="Story navigation">
        {position > 1 ? (
          <Link className="story-nav-btn" to={`/story/${position - 1}/${total}`}>
            ‹ Prev
          </Link>
        ) : (
          <span className="story-nav-btn is-disabled">‹ Prev</span>
        )}

        <span className="story-count">
          {position} / {total}
        </span>

        {position < total ? (
          <Link className="story-nav-btn" to={`/story/${position + 1}/${total}`}>
            Next ›
          </Link>
        ) : (
          <span className="story-nav-btn is-disabled">Next ›</span>
        )}
      </nav>
    </div>
  );
}

export default Viewstory;
