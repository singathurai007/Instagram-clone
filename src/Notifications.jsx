import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegComment, FaUserPlus } from "react-icons/fa";

import {
  getErrorMessage,
  getNotifications,
  getUsers,
  markNotificationRead
} from "./lib/api";
import { formatRelativeTime } from "./lib/format";
import { useToast } from "./context/toast.jsx";

const ICONS = {
  like: { Icon: FaHeart, modifier: "is-like" },
  comment: { Icon: FaRegComment, modifier: "is-comment" },
  follow: { Icon: FaUserPlus, modifier: "is-follow" }
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [authors, setAuthors] = useState({});
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;

    Promise.all([getNotifications(), getUsers()])
      .then(([list, users]) => {
        if (!active) return;
        setNotifications(list);
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

  const sorted = useMemo(
    () =>
      [...notifications].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    [notifications]
  );

  const unread = notifications.filter((item) => !item.read);

  async function markAllRead() {
    setBusy(true);

    try {
      const updated = await Promise.all(
        unread.map((item) => markNotificationRead(item.id))
      );

      setNotifications((current) =>
        current.map((item) => {
          const match = updated.find(
            (entry) => String(entry.id) === String(item.id)
          );
          return match ?? item;
        })
      );

      showToast("All notifications marked as read.", "success");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  async function markOne(item) {
    if (item.read) {
      return;
    }

    try {
      const updated = await markNotificationRead(item.id);
      setNotifications((current) =>
        current.map((entry) =>
          String(entry.id) === String(updated.id) ? updated : entry
        )
      );
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
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

        <h1>Notifications</h1>

        {unread.length > 0 && (
          <button
            type="button"
            className="page-text-btn"
            onClick={markAllRead}
            disabled={busy}
          >
            {busy ? "Marking…" : "Mark all as read"}
          </button>
        )}
      </header>

      {status === "ready" && unread.length > 0 && (
        <p className="badge-pill">{unread.length} unread</p>
      )}

      {status === "loading" && (
        <ul className="notification-list" aria-busy="true">
          {[1, 2, 3].map((item) => (
            <li className="notification-row" key={item}>
              <span className="skeleton skeleton-avatar" />
              <span className="skeleton skeleton-text" />
            </li>
          ))}
        </ul>
      )}

      {status === "error" && (
        <p className="state state-error" role="alert">
          {error}
        </p>
      )}

      {status === "ready" && !sorted.length && (
        <p className="state">You have no notifications yet.</p>
      )}

      {status === "ready" && sorted.length > 0 && (
        <ul className="notification-list">
          {sorted.map((item) => {
            const { Icon, modifier } = ICONS[item.type] ?? ICONS.like;
            const actor = authors[item.userId];

            return (
              <li key={item.id}>
                <Link
                  className={`notification-row${item.read ? "" : " is-unread"}`}
                  to={item.postId ? `/post/${item.postId}` : "/profile"}
                  onClick={() => markOne(item)}
                >
                  <span className="notification-avatar">
                    <img
                      src={actor?.profilePic}
                      alt=""
                      loading="lazy"
                    />
                    <span className={`notification-icon ${modifier}`}>
                      <Icon aria-hidden="true" />
                    </span>
                  </span>

                  <span className="notification-text">
                    <strong>{actor?.username ?? "Someone"}</strong> {item.text}
                    <time dateTime={item.createdAt}>
                      {formatRelativeTime(item.createdAt)}
                    </time>
                  </span>

                  {!item.read && (
                    <span className="notification-dot" aria-label="Unread" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
