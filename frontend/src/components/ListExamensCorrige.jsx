import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosInstance";
import styles from '../style/listExamen.module.css';

// Composant qui affiche la liste des examens déja corrigés par l'examinateur
const ListExamensCorriges = ({ examinateurId }) => {
  const [examens, setExamens] = useState([]); // Etat qui contien les examens corrigés
  const [isOpen, setIsOpen] = useState(true); // Etat qui gère l'ouverture ou la fermeture de la liste
  const navigate = useNavigate();

  // Effet qui se déclence dès que l'ID de l'examinateur est disponible
  useEffect(() => {
    if (!examinateurId) return;
    const fetchExamens = async () => {
      try {
        const response = await axiosInstance.get(`/v1/passe-examen/examen-corriges-examinateur/${examinateurId}`);
        setExamens(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des examens corrigés :", error);
      }
    };
    fetchExamens();
  }, [examinateurId]);

  // Fonction qui permet d'ouvrir ou de femer la liste des examens
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  // Fonction qui gère le click sur correction et qui redirige sur la page correction en mode update de la correction
  const handleCorrection = (passeExamen) => {
    navigate(`/corriger-examen/${passeExamen.appUser.id}/${passeExamen.examen.id}`, {
      state: { mode: "update" }
    });
  };

  return (
    <div className={styles.listExamens}>
      <div className={styles.examHeader} onClick={toggle}>
        <p>Examens corrigés</p>
        <p>{isOpen ? '▼' : '▶'}</p>
      </div>
      {isOpen && (
        <div className={styles.examContainer}>
          {examens.length > 0 ? (
            examens.map((passeExamen) => (
              <div key={passeExamen.id} className={styles.examCard}>
                <div className={styles.examInfo}>
                  <p><span>Intitulé :</span> {
                    passeExamen.examen?.intitule &&
                    passeExamen.examen.intitule.charAt(0).toUpperCase() +
                    passeExamen.examen.intitule.slice(1).toLowerCase()
                  }</p>
                  <p><span>Nom :</span> {
                    passeExamen.appUser?.firstName &&
                    passeExamen.appUser.firstName.charAt(0).toUpperCase() +
                    passeExamen.appUser.firstName.slice(1).toLowerCase()
                  }</p>
                  <p><span>Prénom :</span> {
                    passeExamen.appUser?.lastName &&
                    passeExamen.appUser.lastName.charAt(0).toUpperCase() +
                    passeExamen.appUser.lastName.slice(1).toLowerCase()
                  }</p>
                </div>
                <button className={styles.correctButton} onClick={() => handleCorrection(passeExamen)}>
                  Corriger
                </button>
              </div>
            ))
          ) : (
            <p>Aucun examen corrigé</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ListExamensCorriges;