import { useEffect, useState } from 'react';
import styles from "../style/home.module.css"; // Importation du module CSS
import axiosInstance from "../axiosInstance"; // Axios est utilisé ici à la place de fetch
import { useNavigate } from 'react-router-dom'; // Pour rediriger l'utilisateur
import { CookieService } from "../utils/cookieUtils";

const ListExamens = () => {
  const [examens, setExamens] = useState([]); // Stocke la liste des examens
  const [isOpen, setIsOpen] = useState(false); // Contrôle l'affichage des examens
  const [userId, setUserId] = useState(null); // ID de l'utilisateur connecté
  const navigate = useNavigate(); // Hook pour la navigation

  // Récupération du user depuis les cookies, et modification du style du <html>
  useEffect(() => {
    const user = CookieService.getUser();
    if (user) {
      setUserId(user.id);
    }

    // Modification temporaire du style de la page
    const originalHtmlStyles = {
      backgroundImage: document.documentElement.style.backgroundImage,
      backgroundColor: document.documentElement.style.backgroundColor,
    };

    document.documentElement.style.backgroundImage = 'none';
    document.documentElement.style.backgroundColor = 'white';

    // Nettoyage (remise des styles initiaux) quand le composant est démonté
    return () => {
      document.documentElement.style.backgroundImage = originalHtmlStyles.backgroundImage;
      document.documentElement.style.backgroundColor = originalHtmlStyles.backgroundColor;
    };
  }, []);

  //Axios est utilisé ici pour l'appel API (plus propre et plus simple que fetch)
  useEffect(() => {
    if (userId) {
      axiosInstance.get(`/v1/passe-examen/passe-examen-by-user/${userId}`)
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
                <div className={styles.examensItems}>
                  <p className={styles.titre}>Examen: <span className={styles.json}>{passeExamen.examen?.intitule}</span></p>
                  <p className={styles.titre}>Note: <span className={styles.json}>--/{passeExamen.examen?.note_max}</span></p>
                  <p className={styles.titre}>Etat: <span className={styles.json}>
                    {passeExamen.etat.charAt(0).toUpperCase() + passeExamen.etat.slice(1).toLowerCase()}
                  </span></p>
                </div>
                <button
                  className={styles.consulter}
                  onClick={() => handleConsulterClick(passeExamen.examen.id)} // Redirection avec paramètres
                >
                  Consulter
                </button>
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
