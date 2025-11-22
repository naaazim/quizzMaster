import { useEffect, useState } from 'react';
import styles from "../style/listExamen.module.css"; // Importation du module CSS
import axiosInstance from "../axiosInstance"; // Axios est utilisé ici à la place de fetch
import { useNavigate } from 'react-router-dom'; // Pour rediriger l'utilisateur

const ListExamens = () => {
  const [examens, setExamens] = useState([]); // Stocke la liste des examens
  const [isOpen, setIsOpen] = useState(false); // Contrôle l'affichage des examens
  const [userId, setUserId] = useState(null); // ID de l'utilisateur connecté
  const [notes, setNotes] = useState({});

  const navigate = useNavigate(); // Hook pour la navigation

  const recupererNote = async (examen) => {
    return await axiosInstance.get(`/api/v1/passe-examen/get-note/${userId}/${examen}`).data;
  };

  // Récupération du user depuis le localStorage, et modification du style du <html>
  useEffect(() => {
    if (examens.length > 0 && userId) {
      const fetchNotes = async () => {
        const newNotes = {};
        for (let examen of examens) {
          try {
            const res = await axiosInstance.get(`/api/v1/passe-examen/get-note/${userId}/${examen.examen.id}`);
            newNotes[examen.examen.id] = res.data;
          } catch (err) {
            console.error(`Erreur pour l'examen ${examen.examen.id} :`, err);
            newNotes[examen.examen.id] = 'Erreur';
          }
        }
        setNotes(newNotes);
      };
      fetchNotes();
    }
  }, [examens]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // Stockage dans le navigateur
    if (storedUser) {
      const user = JSON.parse(storedUser); // On transforme la chaîne en objet
      setUserId(user.id); // On extrait l'ID
    }
  }, []);

  //Axios est utilisé ici pour l'appel API (plus propre et plus simple que fetch)
  useEffect(() => {
    if (userId) {
      axiosInstance.get(`/api/v1/passe-examen/examen-corriges/${userId}`)
        .then(response => {
          setExamens(response.data); // On récupère directement les données
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des examens passés :", error);
        });
    }
  }, [userId]); // Dépendance = si userId change, on refait la requête

  const toggle = () => {
    setIsOpen(!isOpen); // Ouvre/ferme la liste
  };

  // Action quand on clique sur "Consulter"
  const handleConsulterClick = (examenId) => {
    navigate(`/consulter-examen/${examenId}/${userId}`); // Redirection dynamique
  };

  return (
    <div className={styles.listExamens}>
      <div className={styles.examensPasses} onClick={toggle}>
        <p>Examens Passés</p>
        <p>{isOpen ? '▼' : '▶'}</p>
      </div>

      {isOpen && (
        <div>
          {examens.length > 0 ? (
            examens.map((passeExamen) => (
              <div className={styles.flex} key={passeExamen.id}>
                <div className={styles.examenItems}>
                  <p className={styles.titre}><span>Examen:</span> {passeExamen.examen?.intitule}</p>
                  <p className={styles.titre}><span>Note:</span> {notes[passeExamen.examen.id] ?? 'Chargement...'}/{passeExamen.examen?.note_max}</p>
                  <p className={styles.titre}><span>Etat: </span>
                    {passeExamen.etat.charAt(0).toUpperCase() + passeExamen.etat.slice(1).toLowerCase()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>Aucun examen passé</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ListExamens;
