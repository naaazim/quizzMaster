import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosInstance";
import styles from '../style/listExamen.module.css';

const ListExamensACorriger = ({ examinateurId }) => {
  const [examens, setExamens] = useState([]);
  const [isOpen, setIsOpen] = useState(true); // Contrôle de l'ouverture/fermeture de la liste
  const navigate = useNavigate();

  useEffect(() => {
    if (!examinateurId) return;

    // Récupération des examens à corriger pour l'examinateur
    const fetchExamens = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/passe-examen/examen-a-corriger/${examinateurId}`);
        setExamens(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des examens corrigés :", error);
      }
    };

    fetchExamens();
  }, [examinateurId]);

  const toggle = () => {
    setIsOpen(!isOpen); // Affiche ou cache la liste
  };

  const handleCorrection = (passeExamen) => {
    // Redirige vers la page de correction avec les bons paramètres
    navigate(`../corriger-examen/${passeExamen.appUser.id}/${passeExamen.examen.id}`);
  };

  return (
    <div>
      <div className={styles.examHeader} onClick={toggle}>
        <p>Examens à corriger</p>
        <p>{isOpen ? '▼' : '▶'}</p>
      </div>

      {isOpen && (
        <div className={styles.examContainer}>
          {examens.length > 0 ? (
            examens.map((passeExamen) => (
              <div key={passeExamen.id} className={styles.examCard}>
                <div className={styles.examInfo}>
                  {/* Affiche les informations de l'examen et de l'étudiant */}
                  <p><span style={{ color: "#ffb600" }}> Intitulé:</span> {
                    passeExamen.examen?.intitule &&
                    passeExamen.examen.intitule.charAt(0).toUpperCase() +
                    passeExamen.examen.intitule.slice(1).toLowerCase()
                  }</p>
                  <p><span style={{ color: "#ffb600" }}> Nom:</span> {
                    passeExamen.appUser?.firstName &&
                    passeExamen.appUser.firstName.charAt(0).toUpperCase() +
                    passeExamen.appUser.firstName.slice(1).toLowerCase()
                  }</p>
                  <p><span style={{ color: "#ffb600" }}> Prénom:</span> {
                    passeExamen.appUser?.lastName &&
                    passeExamen.appUser.lastName.charAt(0).toUpperCase() +
                    passeExamen.appUser.lastName.slice(1).toLowerCase()
                  }</p>
                </div>

                <button
                  className={styles.bouton}
                  onClick={() => handleCorrection(passeExamen)}
                >
                  Corriger
                </button>
              </div>
            ))
          ) : (
            <p>Aucun examen à corriger</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ListExamensACorriger;
