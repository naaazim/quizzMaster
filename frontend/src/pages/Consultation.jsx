import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../style/consultation.module.css"
import Navbar from "../components/Navbar";
import axiosInstance from "../axiosInstance";

function Consultation() {
  const { examenId, userId } = useParams(); // Récupération des paramètres passés dans l'URL
  const [data, setData] = useState([]); // État pour stocker les réponses de l'utilisateur

  useEffect(() => {
    // Requête pour récupérer les réponses de l'utilisateur à un examen spécifique
    axiosInstance.get(`/v1/repond/get-by-exam-user/${examenId}/${userId}`)
      .then((response) => {
        setData(response.data); // Stocke les données reçues dans le state
      })
      .catch((error) => {
        console.error("Erreur de la requête", error); // Affiche une erreur en cas d'échec de la requête
      });
  }, []);
  return (
    <>
      <Navbar title={"CONSULTATION D'EXAMENS"} /> {/* Barre de navigation avec un titre */}
      <div className='bgImage'></div>
      <div className={styles.sheet}>
        {data.map((value, key) => ( // Boucle sur les réponses pour les afficher
          <div key={key} className={styles.questionBlock}>
            {key === 0 && (
              <h1 className={styles.titre}>Examen: {value.reponse.question.examen.intitule}</h1> // Affiche le titre de l'examen une seule fois
            )}
            <div className={value.valeur ? styles.bonneReponse : styles.mauvaiseReponse}> {/* Applique un style selon la correction */}
              <p><strong>Question {key + 1}:</strong> {value.reponse.question.texte}</p> {/* Affiche l'intitulé de la question */}
              <p><strong>Votre réponse:</strong> {value.texte}</p> {/* Affiche la réponse de l'utilisateur */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Consultation;
