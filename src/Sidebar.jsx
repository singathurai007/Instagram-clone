import { NavLink, useNavigate } from "react-router-dom";

import logo from "./assets/images.png";

const LINKS = [
  { icon: "bi-house", label: "Home", to: "/" },
  { icon: "bi-search", label: "Search" },
  { icon: "bi-compass", label: "Explore" },
  { icon: "bi-collection-play", label: "Reels" },
  { icon: "bi-chat-dots-fill", label: "Messages" },
  { icon: "bi-chat-square-heart", label: "Notifications" },
  { icon: "bi-plus-square", label: "Create" },
  { icon: "bi-person-circle", label: "Profile", to: "/profile" }
];

function Sidebar() {
  const navigate = useNavigate();

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
          {LINKS.map(({ icon, label, to }) =>
            to ? (
              <li key={label}>
                <NavLink
                  to={to}
                  end
                  className={({ isActive }) =>
                    `sidebar-link${isActive ? " active" : ""}`
                  }
                >
                  <i className={`bi ${icon}`} aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ) : (
              <li key={label}>
                <button type="button" className="sidebar-link" disabled>
                  <i className={`bi ${icon}`} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              </li>
            )
          )}
        </ul>
      </div>

      <div className="sidebar-bottom">
        <button type="button" className="sidebar-link" disabled>
          <i className="bi bi-threads" aria-hidden="true" />
          <span>Threads</span>
        </button>

        <button type="button" className="sidebar-link" disabled>
          <i className="bi bi-list" aria-hidden="true" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
