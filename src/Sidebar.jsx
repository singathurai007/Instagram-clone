import { NavLink, useNavigate } from "react-router-dom";

import logo from "./assets/images.png";
import { useTheme } from "./context/theme.jsx";

const LINKS = [
  { icon: "bi-house", label: "Home", to: "/" },
  { icon: "bi-compass", label: "Explore", to: "/explore" },
  { icon: "bi-plus-square", label: "Create", to: "/create" },
  {
    icon: "bi-chat-square-heart",
    label: "Notifications",
    to: "/notifications"
  },
  { icon: "bi-person-circle", label: "Profile", to: "/profile" },
  { icon: "bi-bookmark", label: "Saved", to: "/saved" },
  /* Wireframes for the areas this demo does not implement. */
  { icon: "bi-collection-play", label: "Reels", muted: true },
  { icon: "bi-chat-dots-fill", label: "Messages", muted: true }
];

function Sidebar() {
  const navigate = useNavigate();
  const { resolvedTheme, toggleTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <nav className="sidebar" aria-label="Primary">
      <div className="sidebar-top">
        <button
          type="button"
          className="sidebar-logo"
          onClick={() => navigate("/")}
          aria-label="Instagram home"
        >
          <img src={logo} alt="Instagram" />
        </button>

        <ul className="sidebar-links">
          {LINKS.map(({ icon, label, to, muted }) => (
            <li
              key={label}
              className={muted ? "sidebar-item-secondary" : undefined}
            >
              {to ? (
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `sidebar-link${isActive ? " active" : ""}`
                  }
                >
                  <i className={`bi ${icon}`} aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              ) : (
                <button
                  type="button"
                  className="sidebar-link"
                  disabled
                  title={`${label} — coming soon`}
                >
                  <i className={`bi ${icon}`} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-link"
          onClick={toggleTheme}
          aria-pressed={isDark}
          title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
          <i
            className={`bi ${isDark ? "bi-moon-stars-fill" : "bi-sun-fill"}`}
            aria-hidden="true"
          />
          <span>{isDark ? "Light mode" : "Dark mode"}</span>
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
