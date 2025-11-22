import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import styles from "../style/Navbar.module.css";

function Navbar({ title }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userDataString = localStorage.getItem("user");
  const user = userDataString ? JSON.parse(userDataString) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt_token");
    navigate("/login");
  };

  const initials = user ? (user.firstName?.[0] + user.lastName?.[0]).toUpperCase() : "";
  const isExaminateurOrAdmin = user?.appUserRole === "EXAMINATEUR" || user?.appUserRole === "ADMIN";
  const isAdmin = user?.appUserRole === "ADMIN";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        {isExaminateurOrAdmin && (
          <div className={styles.menuContainer}>
            <button
              className={`${styles.menuToggle} ${isMenuOpen ? styles.open : ''}`}
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className={`${styles.menuDropdown} ${isMenuOpen ? styles.open : ''}`}>
              <Link to="/dashboard-examinateur" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>Tableau de bord</Link>
              <Link to="/gestion-groupes" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>Gestion des groupes</Link>
              <Link to="/gestion-examens" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>Gestion des examens</Link>
              <Link to="/ajouter-passe-examen" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>Gestion des passages</Link>
              <Link to="/analyses" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>Analyses</Link>
              {isAdmin && (
                <Link to="/gestion-roles" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>Gestion des rôles</Link>
              )}
            </div>
          </div>
        )}

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/LOGO.png" alt="QuizzMaster Logo" className={styles.logo} />
          <span className={styles.logoText}>Quizz<span className={styles.logoHighlight}>Master</span></span>
        </Link>
      </div>

      <div className={styles.navLinks}>
        {title && <h2 className={styles.navTitle}>{title}</h2>}
      </div>

      <div className={styles.userSection}>
        {user ? (
          <>
            <div className={styles.avatar} title={`${user.firstName} ${user.lastName}`}>
              {initials}
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <div className={styles.navLinks}>
            <Link to="/login" className={styles.navLink}>Connexion</Link>
            <Link to="/signup" className={styles.btnPrimary}>Inscription</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

