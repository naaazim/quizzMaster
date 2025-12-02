import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import styles from "../style/ModificationExamen.module.css";


// Composant qui permet l'affichage de chacune des questions sur la page modification examen
const QuestionCard = ({ question, onEdit, onDelete }) => {
  // Etat pour stocker les reponses de la question
  const [reponses, setReponses] = useState([]);

  useEffect(() => {
    const fetchReponses = async () => {
      try {
        const res = await axiosInstance.get(
          `/v1/question/${question.id}/reponses`  // Requête HTTP pour récupérer les réponses associées à la question via son ID
        );
        setReponses(res.data || []); // Stockage des réponses dans l'état local
      } catch (err) {
        console.error("Erreur lors du chargement des réponses :", err);
      }
    };

    fetchReponses();
  }, [question]); // Si la question change useEffect sera relancé

  // Fonction pour afficher dynamiquement les réponses selon le type de question
  const renderReponse = () => {
    switch (question.type) {
      case "QCU": {  // Cas QCU
        if (!reponses || reponses.length === 0) {
          return <p className={styles.reponse}>Aucune réponse trouvée</p>;
        }
        const bonne = reponses.find((r) => r.valeur === true); //récupère l'unique réponse correcte
        return (
          <p className={styles.reponse}>
            {bonne ? (
              <span>
                <span className={styles.indice}>A.</span> {bonne.texte}
              </span>
            ) : (
              " Aucune réponse juste"
            )}
          </p>
        );
      }

      case "QCM": {    // cas QCM
        if (!reponses || reponses.length === 0) {
          return <p className={styles.reponse}>Aucune réponse juste</p>;
        }
        const bonnes = reponses.filter((r) => r.valeur === true); // On filtre la ou les bonnes réponses 
        return (
          <div className={styles.reponse}>
            <ul>
              {bonnes.length > 0 ? (
                bonnes.map((r, idx) => (
                  <li key={r.id}>
                    <span className={styles.indice}>{String.fromCharCode(65 + idx)}.</span> {r.texte}
                  </li>
                ))
              ) : (
                "Aucune réponse juste"
              )}
            </ul>
          </div>
        );
      }

      case "LIBRE":
        return <p className={styles.reponse}>Réponse libre</p>;

      case "PIECE":
        return <p className={styles.reponse}>Pièce jointe attendue</p>;

      default:
        return <p className={styles.reponse}>Type inconnu</p>;
    }
  };

  return (
    <div className={styles["question-card"]}>
      <div className={styles["question-header"]}>
        <span className={styles.type}>Type : {question.type}</span>
        <span className={styles.points}>Points : {question.nbPoints ?? "?"}</span>
        <span className={styles.temps}>Temps : {question.temps ?? "?"} secondes</span>
        <div className={styles.icons}>
          <i className="fa fa-edit" title="Modifier" onClick={() => onEdit(question)}></i>
          <i className="fa fa-trash" title="Supprimer" onClick={onDelete}></i>
        </div>
      </div>
      <hr />
      <div className={styles["question-body"]}>
        <p className={styles.label}>Texte</p>
        <p className={styles.texte}>{question.texte}</p>
        <p className={styles.label}>Réponse</p>
        {renderReponse()}
      </div>
    </div>
  );
};

export default QuestionCard;