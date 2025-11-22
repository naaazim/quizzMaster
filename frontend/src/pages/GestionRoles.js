
import Layout from "../components/Layout";
import axiosInstance from "../axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import succesImg from "../assets/succes.png";
import style from "../style/roles.module.css"

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
      const token = localStorage.getItem("jwt_token");
      const response = await axiosInstance.get(`/api/v1/user/get-to-update`);
      setUsers(response.data);
      setExamines((await axiosInstance.get(`/api/v1/user/get-examine-validate`)).data);
      setExaminateurs((await axiosInstance.get(`/api/v1/user/get-examinateur-validate`)).data);

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
    const userDataString = localStorage.getItem("user");
    if (!userDataString) {
      navigate("/login");
      return;
    }
    fetchUsers();

    const userData = JSON.parse(userDataString);
    setUserId(userData?.id);

  }, []);


  const updateUser = async (email, role) => {
    try {
      const response = await axiosInstance.put(`/api/v1/user/role`, {
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
      await axiosInstance.put(`/api/v1/user/valider/${mail}`);
      fetchUsers();
    } catch (error) {

    }
  }

  const validateAllExamine = async () => {
    examines.forEach(async (examine) => {
      try {
        await axiosInstance.put(`/api/v1/user/valider/${examine.email}`);
      } catch (error) {

      }
    })
    fetchUsers();
  }

  const validateAllExaminateur = async () => {
    examinateurs.forEach(async (examine) => {
      try {
        await axiosInstance.put(`/api/v1/user/valider/${examine.email}`);
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
      await axiosInstance.post(`/api/v1/auth/admin-add`, {
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
      await axiosInstance.delete(`/api/v1/user/delete/${mail}`);
      fetchUsers();
    } catch (error) {
      console.log((error));
    }
  };


  return (
    <Layout title="Gestion des utilisateurs">
      {succes && (
        <div style={{
          position: 'fixed',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--surface)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--success)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 1000
        }}>
          <img src={succesImg} width={60} alt="Success" />
          <p style={{ color: 'var(--success)', margin: 0, fontWeight: 600 }}>Changement effectué avec succès</p>
        </div>
      )}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
        margin: '2rem auto',
        maxWidth: '1200px'
      }}>
        {actions.map((action, index) => (
          <button key={index} className={index == selectedIndex ? style.buttonActionActive : style.buttonAction} onClick={() => { setSelectedIndex(index) }}>{action}</button>
        ))}
      </div>
      {selectedIndex == 0 && (<div className='d-flex flex-column justify-content-center'>
        <h2 className='montserrat mx-auto text-center '>Liste des examinateurs en attente</h2>
        {examinateurs.length > 0 && (<button className='btn btn-outline-primary mx-auto w-400 rounded-2 p-2' onClick={() => validateAllExaminateur()}>Tout valider</button>
        )}
        {examinateurs.length > 0 && examinateurs.map((user) => (
          <div key={user.id} className='d-flex flex-md-row justify-content-center m-3'>
            <p className='bg-bleu p-3 rounded-3 w-400 text-white text-center montserrat m-2'>{user.firstName} {user.lastName}</p>
            <select className='border border-warning m-2 rounded-3 montserrat' value={roles[user.email]} onChange={(e) => handleRoleChange(user.email, e.target.value)}>
              <option value={"EXAMINATEUR"}>EXAMINATEUR</option>
              <option value={"EXAMINE"}>EXAMINE</option>
              <option value={"ADMIN"}>ADMIN</option>
            </select>
            <button className='btn btn-outline-danger m-2' onClick={() => { deleteUser(user.email) }}>Supprimer</button>
            <button className='btn btn-outline-primary m-2' onClick={() => { validateUser(user.email) }}>Valider</button>
          </div>
        ))}
        {examinateurs.length == 0 && (<><h3 className='text-danger montserrat mx-auto text-center'>Aucun examinateur en attente</h3></>)}
      </div>)}
      {selectedIndex == 1 && (<div className='d-flex flex-column justify-content-center'>
        <h2 className='montserrat mx-auto text-center '>Liste des examinés en attente</h2>
        {examines.length > 0 && (<button className='btn btn-outline-primary mx-auto w-400 rounded-2 p-2' onClick={() => validateAllExamine()}>Tout valider</button>
        )}
        {examines.length > 0 && examines.map((user) => (
          <div key={user.id} className='d-flex flex-md-row justify-content-center m-3'>
            <p className='bg-bleu p-3 rounded-3 w-400 text-white text-center montserrat m-2'>{user.firstName} {user.lastName}</p>
            <button className='btn btn-outline-danger m-2' onClick={() => { deleteUser(user.email) }}>Supprimer</button>
            <button className='btn btn-outline-primary m-2' onClick={() => { validateUser(user.email) }}>Valider</button>
          </div>
        ))}
        {examines.length == 0 && (<><h3 className='text-danger montserrat mx-auto text-center'>Aucun examine en attente</h3></>)}
      </div>)}
      {selectedIndex == 2 && (<div className='d-flex flex-column justify-content-center'>
        <h2 className='montserrat mx-auto text-center '>Liste des utilisateurs</h2>
        {users.length > 0 && users.map((user) => (
          <div key={user.id} className='d-flex flex-md-row justify-content-center m-3'>
            <p className='bg-bleu p-3 rounded-3 w-400 text-white text-center montserrat m-2'>{user.firstName} {user.lastName}</p>
            <select className='border border-warning m-2 rounded-3 montserrat' value={roles[user.email]} onChange={(e) => handleRoleChange(user.email, e.target.value)}>
              <option value={"EXAMINATEUR"}>EXAMINATEUR</option>
              <option value={"EXAMINE"}>EXAMINE</option>
              <option value={"ADMIN"}>ADMIN</option>
            </select>
            <button className='btn btn-outline-danger m-2' onClick={() => { deleteUser(user.email) }}>Supprimer</button>
            <button className='btn btn-outline-primary m-2' onClick={() => { updateUser(user.email, roles[user.email]) }}>Valider</button>
          </div>
        ))}
        {users.length == 0 && (<><h3 className='text-danger montserrat mx-auto text-center'>Aucun utilisateur inscrit</h3></>)}
        <button className='btn btn-outline-primary mx-auto w-400 rounded-5 p-2' onClick={() => setAjout(true)}>Ajouter un utilisateur</button>
      </div>)}
      {ajout && (<div className='p-4 justify-content-center d-flex flex-column rounded-3 border border-warning bg-white position-fixed top-50 start-50 translate-middle w-50 '>
        <button className='position-absolute top-0 end-0 btn-close m-2' aria-label='Close' onClick={() => { setAjout(false); setErreur(false) }}></button>
        <h3 className='text-center montserrat'>Ajouter un utilisateur</h3>
        {erreur && (<p style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '1rem' }}>✗ {message}</p>)}
        <form className={style.formContainer} onSubmit={(event) => { event.preventDefault(); addUser(); }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className={style.formGroup}>
              <label className={style.label}>Prénom</label>
              <input
                required
                type="text"
                className={style.input}
                id="FirstName"
                placeholder="Entrez votre prénom"
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
            <div className={style.formGroup}>
              <label className={style.label}>Nom</label>
              <input
                required
                type="text"
                className={style.input}
                id="LastName"
                placeholder="Entrez votre nom"
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>
          </div>
          <div className={style.formGroup}>
            <label className={style.label}>E-mail</label>
            <input
              required
              type="email"
              className={style.input}
              id="email"
              placeholder="Entrez votre Email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className={style.formGroup}>
            <label className={style.label}>Mot de passe</label>
            <input
              type="password"
              className={style.input}
              id="password"
              placeholder="Entrez votre mot de passe"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className={style.formGroup}>
            <label className={style.label}>Attribuer le rôle :</label>
            <select className={style.select} onChange={(e) => setRole(e.target.value)} value={role}>
              <option value="EXAMINATEUR">Examinateur</option>
              <option value="EXAMINE">Examiné</option>
            </select>
          </div>
          <button type="submit" className={style.submitBtn}>Valider</button>
        </form>
      </div>)}

    </Layout>
  );
}

export default DB_ADMIN;