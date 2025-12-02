
import Layout from "../components/Layout";
import axiosInstance from "../axiosInstance";
import { CookieService } from "../utils/cookieUtils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import succesImg from "../assets/succes.png";
import styles from "../style/roles.module.css"

function DB_ADMIN() {
  const [userId, setUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [examines, setExamines] = useState([]);
  const [examinateurs, setExaminateurs] = useState([]);
  const [roles, setRoles] = useState({});
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EXAMINATEUR");
  const [ajout, setAjout] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState(false);
  const [message, setMessage] = useState('');
  const actions = ["Examinateurs à valider", "Examinés à valider", "Roles"];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = CookieService.getToken();
      const response = await axiosInstance.get(`/v1/user/get-to-update`);
      setUsers(response.data);
      setExamines((await axiosInstance.get(`/v1/user/get-examine-validate`)).data);
      setExaminateurs((await axiosInstance.get(`/v1/user/get-examinateur-validate`)).data);

      // Initialiser les rôles choisis avec une valeur par défaut
      const initialRoles = {};
      response.data.forEach(user => {
        initialRoles[user.email] = user.appUserRole; // ou "EXAMINATEUR", à toi de voir la valeur par défaut
      });
      setRoles(initialRoles);
    } catch (error) {
      console.log(error);
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    }
  };



  useEffect(() => {
    const userData = CookieService.getUser();
    if (!userData) {
      navigate("/login");
      return;
    }
    fetchUsers();

    setUserId(userData?.id);

  }, []);


  const updateUser = async (email, role) => {
    try {
      const response = await axiosInstance.put(`/v1/user/role`, {
        email: email,
        role: role
      });
      setSucces(true);
      setTimeout(() => {
        setSucces(false);
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    }
  }

  const validateUser = async (mail) => {
    try {
      await axiosInstance.put(`/v1/user/valider/${mail}`);
      fetchUsers();
    } catch (error) {

    }
  }

  const validateAllExamine = async () => {
    examines.forEach(async (examine) => {
      try {
        await axiosInstance.put(`/v1/user/valider/${examine.email}`);
      } catch (error) {

      }
    })
    fetchUsers();
  }

  const validateAllExaminateur = async () => {
    examinateurs.forEach(async (examine) => {
      try {
        await axiosInstance.put(`/v1/user/valider/${examine.email}`);
      } catch (error) {

      }
    })
    fetchUsers();
  }

  const handleRoleChange = (email, newRole) => {
    setRoles((prev) => ({
      ...prev,
      [email]: newRole
    }));
  };

  const addUser = async () => {
    try {
      await axiosInstance.post(`/v1/auth/admin-add`, {
        firstName: FirstName,
        lastName: LastName,
        email: email,
        password: password,
        role: role
      });
      fetchUsers();
      setAjout(false);
      setErreur(false);
    } catch (error) {
      setMessage(error.response.data);
      setErreur(true);
    }
  };

  const deleteUser = async (mail) => {
    try {
      await axiosInstance.delete(`/v1/user/delete/${mail}`);
      fetchUsers();
    } catch (error) {
      console.log((error));
    }
  };


  return (
    <Layout title="Gestion des utilisateurs">
      {succes && (
        <div className={styles.successNotification}>
          <img src={succesImg} className={styles.successIcon} alt="Success" />
          <p className={styles.successMessage}>Changement effectué avec succès</p>
        </div>
      )}

      <div className={styles.container}>
        {/* Tabs */}
        <div className={styles.tabsContainer}>
          {actions.map((action, index) => (
            <button
              key={index}
              className={index === selectedIndex ? styles.tabActive : styles.tab}
              onClick={() => setSelectedIndex(index)}
            >
              {action}
            </button>
          ))}
        </div>

        {/* Examinateurs à valider */}
        {selectedIndex === 0 && (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Liste des examinateurs en attente</h2>
              {examinateurs.length > 0 && (
                <button className={styles.headerButton} onClick={() => validateAllExaminateur()}>
                  ✓ Tout valider
                </button>
              )}
            </div>

            {examinateurs.length > 0 ? (
              <div className={styles.usersGrid}>
                {examinateurs.map((user) => (
                  <div key={user.id} className={styles.userCard}>
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>{user.firstName} {user.lastName}</div>
                      <select
                        className={styles.roleSelect}
                        value={roles[user.email]}
                        onChange={(e) => handleRoleChange(user.email, e.target.value)}
                      >
                        <option value="EXAMINATEUR">EXAMINATEUR</option>
                        <option value="EXAMINE">EXAMINÉ</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                    <div className={styles.actionButtons}>
                      <button className={`${styles.actionButton} ${styles.btnDelete}`} onClick={() => deleteUser(user.email)}>
                        Supprimer
                      </button>
                      <button className={`${styles.actionButton} ${styles.btnValidate}`} onClick={() => validateUser(user.email)}>
                        Valider
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <h3>Aucun examinateur en attente</h3>
                <p>Tous les examinateurs ont été validés</p>
              </div>
            )}
          </div>
        )}

        {/* Examinés à valider */}
        {selectedIndex === 1 && (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Liste des examinés en attente</h2>
              {examines.length > 0 && (
                <button className={styles.headerButton} onClick={() => validateAllExamine()}>
                  ✓ Tout valider
                </button>
              )}
            </div>

            {examines.length > 0 ? (
              <div className={styles.usersGrid}>
                {examines.map((user) => (
                  <div key={user.id} className={styles.userCard}>
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>{user.firstName} {user.lastName}</div>
                    </div>
                    <div className={styles.actionButtons}>
                      <button className={`${styles.actionButton} ${styles.btnDelete}`} onClick={() => deleteUser(user.email)}>
                        Supprimer
                      </button>
                      <button className={`${styles.actionButton} ${styles.btnValidate}`} onClick={() => validateUser(user.email)}>
                        Valider
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <h3>Aucun examiné en attente</h3>
                <p>Tous les examinés ont été validés</p>
              </div>
            )}
          </div>
        )}

        {/* Gestion des rôles */}
        {selectedIndex === 2 && (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Liste des utilisateurs</h2>
              <button className={styles.headerButton} onClick={() => setAjout(true)}>
                + Ajouter un utilisateur
              </button>
            </div>

            {users.length > 0 ? (
              <div className={styles.usersGrid}>
                {users.map((user) => (
                  <div key={user.id} className={styles.userCard}>
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>{user.firstName} {user.lastName}</div>
                      <select
                        className={styles.roleSelect}
                        value={roles[user.email]}
                        onChange={(e) => handleRoleChange(user.email, e.target.value)}
                      >
                        <option value="EXAMINATEUR">EXAMINATEUR</option>
                        <option value="EXAMINE">EXAMINÉ</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                    <div className={styles.actionButtons}>
                      <button className={`${styles.actionButton} ${styles.btnDelete}`} onClick={() => deleteUser(user.email)}>
                        Supprimer
                      </button>
                      <button className={`${styles.actionButton} ${styles.btnValidate}`} onClick={() => updateUser(user.email, roles[user.email])}>
                        Valider
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <h3>Aucun utilisateur inscrit</h3>
                <p>Commencez par ajouter un utilisateur</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add User Modal - Compact Version with Overlay */}
      {ajout && (
        <>
          {/* Overlay - Click outside to close */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 999
            }}
            onClick={() => { setAjout(false); setErreur(false); }}
          />

          {/* Modal Content */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '500px',
              zIndex: 1000
            }}
            className='card-glass p-3'
            onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique dans le formulaire
          >
            <button className='position-absolute top-0 end-0 btn-close m-2' aria-label='Close' onClick={() => { setAjout(false); setErreur(false) }}></button>

            <h3 className='text-center mb-3' style={{ fontSize: '1.25rem' }}>Ajouter un utilisateur</h3>

            {erreur && (
              <div style={{
                color: 'var(--error)',
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem',
                textAlign: 'center',
                fontSize: '0.9rem'
              }}>
                ✗ {message}
              </div>
            )}

            <form onSubmit={(event) => { event.preventDefault(); addUser(); }}>
              {/* Prénom et Nom sur la même ligne */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                    Prénom
                  </label>
                  <input
                    required
                    type="text"
                    className="input-primary"
                    placeholder="Prénom"
                    style={{ height: '48px', fontSize: '0.95rem' }}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                    Nom
                  </label>
                  <input
                    required
                    type="text"
                    className="input-primary"
                    placeholder="Nom"
                    style={{ height: '48px', fontSize: '0.95rem' }}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                  E-mail
                </label>
                <input
                  required
                  type="email"
                  className="input-primary"
                  placeholder="exemple@email.com"
                  style={{ height: '48px', fontSize: '0.95rem' }}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              {/* Mot de passe et Rôle sur la même ligne */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    className="input-primary"
                    placeholder="••••••••"
                    style={{ height: '48px', fontSize: '0.95rem' }}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                    Rôle
                  </label>
                  <select
                    className="select-primary"
                    style={{
                      height: '48px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      background: 'rgba(255, 255, 255, 0.1)',
                      paddingLeft: '1rem',
                      lineHeight: '48px'
                    }}
                    onChange={(e) => setRole(e.target.value)}
                    value={role}
                  >
                    <option value="EXAMINATEUR" style={{ background: 'var(--background)', color: 'var(--text-primary)' }}>Examinateur</option>
                    <option value="EXAMINE" style={{ background: 'var(--background)', color: 'var(--text-primary)' }}>Examiné</option>
                  </select>
                </div>
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                Ajouter l'utilisateur
              </button>
            </form>
          </div>
        </>
      )}

    </Layout>
  );
}

export default DB_ADMIN;