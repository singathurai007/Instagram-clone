import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CURRENT_USER_ID,
  getErrorMessage,
  getFollowing,
  getUser,
  unfollowUser,
  updateUser
} from "./lib/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    Promise.all([getUser(), getFollowing()])
      .then(([profile, people]) => {
        if (!active) return;
        setUser(profile);
        setFollowing(people);
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

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((current) => ({ ...current, [name]: value }));
    setNotice("");
  }

  async function handleSave(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const updated = await updateUser(CURRENT_USER_ID, user);
      setUser(updated);
      setNotice("Profile updated.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleUnfollow(id) {
    try {
      await unfollowUser(id);
      setFollowing((current) => current.filter((item) => item.id !== id));
      setNotice("Unfollowed.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (status === "loading") {
    return (
      <div className="page" aria-busy="true">
        <div className="profile-card">
          <span className="skeleton skeleton-avatar-lg" />
          <span className="skeleton skeleton-text" />
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
    <div className="page">
      <header className="page-header">
        <button
          type="button"
          className="page-back"
          onClick={() => navigate("/")}
          aria-label="Back to feed"
        >
          <i className="bi bi-arrow-left" aria-hidden="true" />
        </button>

        <h1>Profile</h1>
      </header>

      {notice && <p className="state state-success">{notice}</p>}

      {error && (
        <p className="state state-error" role="alert">
          {error}
        </p>
      )}

      <div className="profile-card">
        <img
          className="profile-avatar"
          src={user.profilePic}
          alt=""
          loading="lazy"
        />

        <div className="profile-summary">
          <h2>{user.username}</h2>
          <p className="profile-fullname">
            {user.fullName ?? "—"}
            {user.bio ? ` · ${user.bio}` : ""}
          </p>

          <ul className="profile-stats">
            <li>
              <strong>{user.posts?.length ?? 0}</strong>
              <span>posts</span>
            </li>
            <li>
              <strong>{user.followers?.length ?? 0}</strong>
              <span>followers</span>
            </li>
            <li>
              <strong>{user.following?.length ?? 0}</strong>
              <span>following</span>
            </li>
          </ul>
        </div>
      </div>

      <form className="profile-form" onSubmit={handleSave}>
        <h3>Edit profile</h3>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          className="form-control"
          value={user.username ?? ""}
          onChange={handleChange}
        />

        <label htmlFor="profilePic">Profile picture URL</label>
        <input
          id="profilePic"
          type="url"
          name="profilePic"
          className="form-control"
          value={user.profilePic ?? ""}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <section className="profile-following">
        <h3>Following</h3>

        {following.length ? (
          <ul className="rail-list">
            {following.map((person) => (
              <li className="rail-row" key={person.id}>
                <img
                  className="rail-avatar"
                  src={person.profilePic}
                  alt=""
                  loading="lazy"
                />
                <div className="rail-user">
                  <strong>{person.username}</strong>
                </div>
                <button
                  type="button"
                  className="rail-follow is-following"
                  onClick={() => handleUnfollow(person.id)}
                >
                  Unfollow
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="state">
            You are not following anyone yet. Follow someone from the feed.
          </p>
        )}
      </section>
    </div>
  );
}

export default Profile;
