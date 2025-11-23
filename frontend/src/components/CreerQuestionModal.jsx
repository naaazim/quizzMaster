import { useState, useEffect } from "react";
import axiosInstance from "../api";
import styles from "../style/CreerQuestionModal.module.css";


// Ce composant affiche une pop-up pour créer ou modifier une question
const CreerQuestionModal = ({ examenId, onClose, onQuestionCreated, questionToEdit = null }) => {

  // États locaux pour les champs du formulaire
  const [type, setType] = useState("QCM");      // Type de la question 
  const [texte, setTexte] = useState("");       // Texte de la question
  const [nbPoints, setNbPoints] = useState(1);  // Nombre de points attribués
  const [temps, setTemps] = useState(60);       // Temps imparti pour répondre
  const [reponses, setReponses] = useState([{   // options de réponse pour QCM et QCU
    texte: "",
    valeur: false
  }]);
  const [error, setError] = useState("");

  //  Permet de charger les données de la question si on ouvre la question en mode édition
  useEffect(() => {
    if (questionToEdit) {
      setType(questionToEdit.type);
      setTexte(questionToEdit.texte);
      setNbPoints(questionToEdit.nbPoints);
      setTemps(questionToEdit.temps);

      // Récupère les réponses existantes de la question à modifier
      axiosInstance
        .get(`/api/v1/question/${questionToEdit.id}/reponses`)
        .then((res) => setReponses(res.data))
        .catch((err) => {
          console.error("Erreur chargement des réponses :", err);
        });
    }
  }, [questionToEdit]);

  // Ajoute une nouvelle réponse à la liste
  const handleAddReponse = () => {
    setReponses([...reponses, { texte: "", valeur: false }]);
  };

  // Supprime une réponse de la liste selon son indice
  const handleRemoveReponse = (index) => {
    const updated = [...reponses];
    updated.splice(index, 1);
    setReponses(updated);
  };

  // Met à jour un champ d'une réponse
  const handleReponseChange = (index, field, value) => {
    const updated = [...reponses];
    updated[index][field] = field === "valeur" ? value === "true" : value;
    setReponses(updated);
  };

  // Fonction qui gère la soumission du formulaire (création ou mise à jour d’une question)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prépare l'objet à envoyer à l'API pour créer ou mettre à jour une question
    const questionReq = {
      type,
      texte,
      nbPoints,
      temps,
      examenId,
    };

    // Validation pour le cas ou on essaye de créer un QCM ou QCU avec une seule réponse
    if ((type === "QCM" || type === "QCU") && reponses.length < 2) {
      setError("Impossible de créer un QCM/QCU avec une seule réponse");
      return;
    }

    // Validation spécifique pour QCM : au moins une bonne réponse
    if (type === "QCM") {
      const bonnesReponses = reponses.filter((r) => r.valeur === true);
      if (bonnesReponses.length === 0) {
        setError("Un QCM doit avoir au moins une bonne réponse.");
        return;
      }
    }

    // Validation pour QCU : Obligatoirement une seule réponse
    if (type === "QCU") {
      const bonnesReponses = reponses.filter((r) => r.valeur === true);
      if (bonnesReponses.length === 0) {
        setError("Un QCU doit avoir une bonne réponse.");
        return;
      } else if (bonnesReponses.length > 1) {
        setError("Un QCU ne peut avoir qu'une seule bonne réponse.");
        return;
      }
    }

    try {
      setError(""); // on efface l'erreur si la validation passe
      let questionId = null;

      // Si on modifie une question existante
      if (questionToEdit) {
        await axiosInstance.put(
          `/api/v1/question/update/${questionToEdit.id}`,
          questionReq
        );
        questionId = questionToEdit.id;
      } else {
        // Si on crée une nouvelle question
        const res = await axiosInstance.post("/api/v1/question/create", questionReq);
        questionId = res.data.id;
      }

      // Si c'est une QCM ou QCU, on ajoute les réponses associées
      if (type === "QCM" || type === "QCU") {
        for (const rep of reponses) {
          await axiosInstance.post("/api/v1/question/create-reponse", {
            texte: rep.texte,
            valeur: rep.valeur,
            questionId: questionId,
          });
        }
      } else {
        await axiosInstance.post("/api/v1/question/create-reponse", {
          texte: "",
          valeur: false,
          questionId: questionId,
        });
      }

      // Réinitialise tous les champs à leurs valeurs par défaut
      setTexte("");
      setNbPoints(1);
      setTemps(60);
      setReponses([{ texte: "", valeur: false }]);
      setType("QCM");

      await onQuestionCreated(); // Rafraîchit la liste des questions affichées dans ModifierExamen
      onClose();                 // Ferme la modale
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
  };

  return (
    <>
      <div className={styles["modal-container"]}>
        <h2>{questionToEdit ? "Modifier la question" : "Créer une question"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Type :</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="QCM">QCM</option>
            <option value="QCU">QCU</option>
            <option value="LIBRE">Réponse Libre</option>
            <option value="PIECE">Pièce Jointe</option>
          </select>

          <label>Texte :</label>
          <textarea
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            required
          />

          <label>Nombre de points :</label>
          <input
            type="number"
            min={1}
            value={nbPoints}
            onChange={(e) => setNbPoints(Number(e.target.value))}
          />

          <label>Durée (en secondes) :</label>
          <input
            type="number"
            min={10}
            value={temps}
            onChange={(e) => setTemps(e.target.value)}
          />

          {(type === "QCM" || type === "QCU") && (
            <>
              <label>Réponses :</label>
              {reponses.map((rep, index) => (
                <div key={index} className={styles["reponse-row"]}>
                  <input
                    type="text"
                    placeholder={`Réponse ${index + 1}`}
                    value={rep.texte}
                    onChange={(e) =>
                      handleReponseChange(index, "texte", e.target.value)
                    }
                    required
                    className={rep.valeur === true ? styles["reponse-correcte"] : ""}
                  />
                  <select
                    value={rep.valeur}
                    onChange={(e) =>
                      handleReponseChange(index, "valeur", e.target.value)
                    }
                  >
                    <option value="false">Fausse</option>
                    <option value="true">Correcte</option>
                  </select>
                  <button type="button" onClick={() => handleRemoveReponse(index)}>Supprimer</button>
                </div>
              ))}
              <button type="button" className={styles["bt-ajouter"]} onClick={handleAddReponse}>
                + Ajouter une réponse
              </button>
            </>
          )}

          {type === "PIECE" && (
            <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
              L’élève devra déposer un fichier en réponse à cette question.
            </p>
          )}
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles["modal-buttons"]}>
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Valider</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreerQuestionModal;