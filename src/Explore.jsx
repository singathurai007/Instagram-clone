import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PostGrid from "./PostGrid";
import { getErrorMessage, getPosts, getUsers } from "./lib/api";

function Explore() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    Promise.all([getPosts(), getUsers()])
      .then(([postList, userList]) => {
        if (!active) return;
        setPosts(postList);
        setUsers(userList);
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

  const authors = useMemo(
    () => users.reduce((map, user) => ({ ...map, [user.id]: user }), {}),
    [users]
  );

  const term = query.trim().toLowerCase();

  /* Client-side search keeps the demo usable without extra API routes. */
  const matchingPosts = useMemo(() => {
    if (!term) {
      return posts;
    }

    return posts.filter((post) => {
      const author = authors[post.userId];

      return [author?.username, author?.fullName, post.caption, post.location]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [posts, authors, term]);

  const matchingPeople = useMemo(() => {
    if (!term) {
      return [];
    }

    return users.filter((user) =>
      [user.username, user.fullName, user.bio]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [users, term]);

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

        <h1>Explore</h1>
      </header>

      <div className="search-bar">
        <i className="bi bi-search" aria-hidden="true" />

        <input
          type="search"
          className="search-input"
          placeholder="Search people, captions and places…"
          aria-label="Search posts and people"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {query && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        )}
      </div>

      {status === "loading" && (
        <ul className="post-grid" aria-busy="true">
          {[1, 2, 3, 4, 5, 6].map((item) => (
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
          {matchingPeople.length > 0 && (
            <section className="section">
              <h2 className="section-title">People</h2>

              <ul className="people-list">
                {matchingPeople.map((user) => (
                  <li className="people-card" key={user.id}>
                    <img
                      className="rail-avatar"
                      src={user.profilePic}
                      alt=""
                      loading="lazy"
                    />
                    <div className="rail-user">
                      <strong>{user.username}</strong>
                      <span>{user.fullName ?? "Instagram user"}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="section">
            <h2 className="section-title">
              {term ? `Posts matching “${query.trim()}”` : "Recent posts"}
            </h2>

            <PostGrid
              posts={matchingPosts}
              authors={authors}
              emptyMessage={
                term
                  ? "No posts match your search."
                  : "No posts to explore yet."
              }
            />
          </section>
        </>
      )}
    </div>
  );
}

export default Explore;
