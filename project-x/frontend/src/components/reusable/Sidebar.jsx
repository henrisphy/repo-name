import { Link, useLocation } from "react-router-dom";
import "../../styles.css";

function Sidebar({
  navLinks,
  title,
  subtitle,
  showStats = false,
  stats = null,
}) {
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <aside className="sidebar">
      <div className="sidebarHeader">
        <h3>{title}</h3>
        {subtitle && <p className="sidebarSubtitle">{subtitle}</p>}

        {showStats && stats && (
          <div className="sidebarStats">
            <div className="statItem">
              <span className="statLabel">Working</span>
              <span className="statValue working">{stats.working || 0}</span>
            </div>
            <div className="statItem">
              <span className="statLabel">Completed</span>
              <span className="statValue completed">
                {stats.completed || 0}
              </span>
            </div>
          </div>
        )}
      </div>

      <nav className="sidebarNav">
        {navLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className={`sidebarLink ${isActive(link.path)}`}
          >
            {link.icon && <span className="sidebarIcon">{link.icon}</span>}
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
