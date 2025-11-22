import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import Layout from "../components/Layout";
import QuestionCard from "../components/QuestionCard";
import CreerQuestionModal from "../components/CreerQuestionModal";
import styles from "../style/ModificationExamen.module.css";
import ConfirmationModal from "../components/ConfirmationModal";

function ModifierExamen() {

  const navigate = useNavigate(); // Pour rediriger vers une autre page
  const { examenId } = useParams(); // Récupère l'ID de l'examen depuis l'URL
  const [selectedQuestion, setSelectedQuestion] = useState(null); // Stocke la question sélectionnée pour édition
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  // Stocke les infos de l'examen 
  const [examData, setExamData] = useState({
    intitule: "",
    noteSur: 20,
    questions: [],
    createurId: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);// Gère l'ouverture/fermeture de la modale

  // useEffect s'exécute au chargement de la page pour récupérer les données de l'examen
  useEffect(() => {
    const chargerExamen = async () => {
      try {
        const resExamen = await axiosInstance.get(`/api/v1/examens/${examenId}`);
        console.log(resExamen);
        const resQuestions = await axiosInstance.get(`/api/v1/examens/${examenId}/questions`);

        setExamData({
          intitule: resExamen.data.intitule || "",
          noteSur: resExamen.data.note_max || 20,
          createurId: resExamen.data.createur.id,
          questions: Array.isArray(resQuestions.data) ? resQuestions.data : [],
        });
      } catch (err) {
        console.error("Erreur lors du chargement de l'examen :", err);
      }
    };

    chargerExamen();
  }, [examenId]);

  // Met a jour le champ modifié dans examData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fonction pour supprimer une question
  const confirmerSuppression = async () => {
    if (questionToDelete !== null) {
      try {
        await axiosInstance.delete(`/api/v1/question/delete/${questionToDelete}`);
        await refreshQuestions(); // Recharge la liste
        setShowConfirmModal(false); // Ferme la modale
        setQuestionToDelete(null);  // Réinitialise l'ID
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
      }
    }
  };

  // Fonction qui va gerer le cas ou l'utilisateur va annuler la suppression
  const annulerSuppression = () => {
    setQuestionToDelete(null);
    setShowConfirmModal(false);
  };

  const modifier = async () => {
    try {

      if (examData.intitule != "") {
        await axiosInstance.post(`/api/v1/examens/modifier`,
          {
            id: examenId,
            intitule: examData.intitule,
            note_max: examData.noteSur,
            createurId: examData.createurId
          }
        );
      }
    } catch {

    }
  }

  // Recharge les questions de l’examen
  const refreshQuestions = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/examens/${examenId}/questions`);
      setExamData((prev) => ({
        ...prev,
        questions: Array.isArray(res.data) ? res.data : [],
      }));
    } catch (err) {
      console.error("Erreur lors du rechargement des questions :", err);
    }
  };

  // Fonction qui va afficher la modale de confirmation pour la supression d'une question
  const demanderConfirmationSuppression = (questionId) => {
    setQuestionToDelete(questionId);
    setShowConfirmModal(true);
  };

  return (
    <Layout title="MODIFIER UN EXAMEN">
      <div className={styles.container}>
        <label className={styles.intitule}>Intitulé:</label>
        <input
          required
          type="text"
          name="intitule"
          value={examData.intitule}
          onChange={handleChange}
        />

        <label className={styles.note}>Note sur :</label>
        <input
          required
          type="number"
          name="noteSur"
          value={examData.noteSur}
          onChange={handleChange}
        />
      </div>

      <div>
        {examData.questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onDelete={() => demanderConfirmationSuppression(question.id)}
            onEdit={(q) => {
              setSelectedQuestion(q);
              setIsModalOpen(true);
            }}
          />
        ))}
      </div>

      <div className={styles["buttons-container"]}>
        <button className={styles["bt-newquestion"]} onClick={() => setIsModalOpen(true)}>
          Nouvelle Question
        </button>
        <button className={styles["bt-terminer"]} onClick={async () => { try { await modifier(); navigate("/gestion-examens") } catch (err) { } }}>
          Terminer
        </button>
      </div>

      {isModalOpen && (
        <CreerQuestionModal
          examenId={Number(examenId)}
          questionToEdit={selectedQuestion}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedQuestion(null);
          }}
          onQuestionCreated={refreshQuestions}
        />
      )}

      {showConfirmModal && (
        <ConfirmationModal
          message="Voulez-vous vraiment supprimer cette question ?"
          onConfirm={confirmerSuppression}
          onCancel={annulerSuppression}
        />
      )}
    </Layout>
  );
}

export default ModifierExamen;