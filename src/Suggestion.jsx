import { useEffect, useState } from "react";

import {
  CURRENT_USER_ID,
  followUser,
  getErrorMessage,
  getFollowing,
  getProfile,
  getSuggestions
} from "./lib/api";

function Suggestion() {
  const [profile, setProfile] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getProfile(), getSuggestions(), getFollowing()])
      .then(([currentProfile, people, following]) => {
        if (!active) return;
        setProfile(currentProfile);
        setSuggestions(people);
        setFollowingIds(following.map((item) => item.userId));
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

  async function handleFollow(user) {
    /* Optimistic: show "Following" straight away. */
    setFollowingIds((current) => [...current, user.id]);

    try {
      await followUser({ ...user, followedBy: CURRENT_USER_ID });
    } catch (err) {
      setFollowingIds((current) =>
        current.filter((id) => id !== user.id)
      );
      setError(getErrorMessage(err));
    }
  }

  if (status === "loading") {
    return (
      <aside className="rail" aria-label="Suggestions" aria-busy="true">
        {[1, 2, 3].map((item) => (
          <div className="rail-row" key={item}>
            <span className="skeleton skeleton-avatar" />
            <span className="skeleton skeleton-text" />
          </div>
        ))}
      </aside>
    );
  }

  if (status === "error") {
    return (
      <aside className="rail" aria-label="Suggestions">
        <p className="state state-error" role="alert">
          {error}
        </p>
      </aside>
    );
  }

  return (
    <aside className="rail" aria-label="Suggestions">
      {profile && (
        <div className="rail-account">
          <img
            className="rail-avatar"
            src={profile.profilePic}
            alt=""
            loading="lazy"
          />
          <div className="rail-user">
            <strong>{profile.username}</strong>
            <span>Signed in</span>
          </div>
          <button type="button" className="rail-switch" disabled>
            Switch
          </button>
        </div>
      )}

      <div className="rail-heading">
        <span>Suggested for you</span>
        <button type="button" className="rail-see-all" disabled>
          See all
        </button>
      </div>

      {suggestions.length ? (
        <ul className="rail-list">
          {suggestions.map((user) => {
            const isFollowing = followingIds.includes(user.id);

            return (
              <li className="rail-row" key={user.id}>
                <img
                  className="rail-avatar"
                  src={user.profilePic}
                  alt=""
                  loading="lazy"
                />

                <div className="rail-user">
                  <strong>{user.username}</strong>
                  <span>Suggested for you</span>
                </div>

                <button
                  type="button"
                  className={`rail-follow${isFollowing ? " is-following" : ""}`}
                  onClick={() => handleFollow(user)}
                  disabled={isFollowing}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="state">No suggestions right now.</p>
      )}

      {error && (
        <p className="state state-error" role="alert">
          {error}
        </p>
      )}

      <footer className="rail-footer">
        A React demo project · Data served by json-server
      </footer>
    </aside>
  );
}

export default Suggestion;
