import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import CreerExamenModal from "../components/CreerExamenModal";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import styles from "../style/GestionExamen.module.css";
import ConfirmationModal from "../components/ConfirmationModal";

const GestionExamens = () => {
  const [examens, setExamens] = useState([]);
  const [showModal, setShowModal] = useState(false); //Etat pour afficher la pop up de création d'examen
  const [showConfirmModal, setShowConfirmModal] = useState(false); //état pour afficher pop up de confirmation lors de la suppression d'un examen
  const [examToDelete, setExamToDelete] = useState(null);// Etat pour stocker l'id de l'examen qu'on va supprimer
  const navigate = useNavigate(); // Constante pour permettre de naviguer d'une page a l'autre

  // Fonction permettant de récuperer les examens crée par l'examinateur connecté
  const fetchExamens = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const user = JSON.parse(localStorage.getItem("user"));
      let res = await axiosInstance.get(`/api/v1/examens/by-createur`, {
        params: {
          createurId: userId,
        },
      });
      if (user.appUserRole === "ADMIN") {
        res = await axiosInstance.get(`/api/v1/examens/get-all`);

      }
      setExamens(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des examens :", error);
    }
  };

  // Fonction pour supprimer un examen
  const deleteExamen = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/examens/${id}`);
      fetchExamens();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  // Fonction pour gerer la supression d'un examen, elle va afficher la modale de confirmation
  const handleConfirmDelete = (id) => {
    setExamToDelete(id);
    setShowConfirmModal(true);
  };

  // Fonction qui va gerer le cas ou l'utilisateur va confirmer la suppresion
  const handleDeleteConfirmed = () => {
    if (examToDelete !== null) {
      deleteExamen(examToDelete);
      setExamToDelete(null);
      setShowConfirmModal(false);
    }
  };

  // Fonction qui va gerer le cas ou l'utilisateur va annuler la suppresion
  const handleCancelDelete = () => {
    setExamToDelete(null);
    setShowConfirmModal(false);
  };

  // Pour charger les examens lors du chargement de la page
  useEffect(() => {
    fetchExamens();
  }, []);

  return (
    <Layout title="GESTION DES EXAMENS">
      <div className={styles["gestion-examens-container"]}>
        <div className={styles["examens-header"]}>
          <span>Intitulé</span>
          <span>Note maximale</span>
          <span>Actions</span>
        </div>

        {examens.map((exam) => (
          <div key={exam.id} className={styles["examen-card"]}>
            <span>{exam.intitule}</span>
            <span>{exam.note_max}</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className={styles["bt-supprimer"]}
                onClick={() => handleConfirmDelete(exam.id)}
              >
                Supprimer
              </button>
              <button
                className={styles["bt-modifier"]}
                onClick={() => navigate(`/modification-examen/${exam.id}`)}
              >
                Modifier
              </button>
            </div>
          </div>
        ))}

        <div className={styles["examens-actions"]}>
          <button
            className={styles["bt-ajouter"]}
            onClick={() => setShowModal(true)}
          >
            + Ajouter un examen
          </button>
          <button
            className={styles["bt-terminer"]}
            onClick={() => navigate("/dashboard-examinateur")}
          >
            Terminer
          </button>
        </div>

        {showModal && (
          <CreerExamenModal onClose={() => setShowModal(false)} onCreate={fetchExamens} />
        )}

        {showConfirmModal && (
          <ConfirmationModal
            message="Voulez-vous vraiment supprimer cet examen ?"
            onConfirm={handleDeleteConfirmed}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    </Layout>
  );
};

export default GestionExamens;