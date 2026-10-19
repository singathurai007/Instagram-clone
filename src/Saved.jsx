import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PostGrid from "./PostGrid";
import {
  getErrorMessage,
  getPosts,
  getSaved,
  getUsers,
  unsavePost
} from "./lib/api";
import { useToast } from "./context/toast.jsx";

function Saved() {
  const [savedRecords, setSavedRecords] = useState([]);
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState({});
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;

    Promise.all([getSaved(), getPosts(), getUsers()])
      .then(([records, postList, users]) => {
        if (!active) return;
        setSavedRecords(records);
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

  /* Newest saves first, ignoring records whose post no longer exists. */
  const savedPosts = useMemo(
    () =>
      [...savedRecords]
        .reverse()
        .map((record) =>
          posts.find((post) => String(post.id) === String(record.postId))
        )
        .filter(Boolean),
    [savedRecords, posts]
  );

  async function handleRemove(postId) {
    const record = savedRecords.find(
      (item) => String(item.postId) === String(postId)
    );

    if (!record) {
      return;
    }

    setSavedRecords((current) =>
      current.filter((item) => item.id !== record.id)
    );

    try {
      await unsavePost(record.id);
      showToast("Removed from saved.", "info");
    } catch (err) {
      setSavedRecords((current) => [...current, record]);
      showToast(getErrorMessage(err), "error");
    }
  }

  return (
    <div className="page page-wide">
      <header className="page-header">
        <button
          type="button"
          className="page-back"
          onClick={() => navigate("/")}
          aria-label="Back to feed"
        >
          <i className="bi bi-arrow-left" aria-hidden="true" />
        </button>

        <h1>Saved</h1>
      </header>

      {status === "loading" && (
        <ul className="post-grid" aria-busy="true">
          {[1, 2, 3].map((item) => (
            <li key={item}>
              <span className="skeleton skeleton-square" />
            </li>
          ))}
        </ul>
      )}

      {status === "error" && (
        <p className="state state-error" role="alert">
          {error}
        </p>
      )}

      {status === "ready" && (
        <>
          <h2 className="section-title">
            Only you can see what you have saved
          </h2>

          <PostGrid
            posts={savedPosts}
            authors={authors}
            onRemove={handleRemove}
            emptyMessage="Nothing saved yet. Tap the bookmark icon on a post to keep it here."
          />
        </>
      )}
    </div>
  );
}

export default Saved;
