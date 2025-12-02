import { useState } from "react";
import styles from "../style/CreerExamenModal.module.css";
import Modal from "./Modal";
import axiosInstance from "../api";
import { CookieService } from "../utils/cookieUtils";

const CreerExamenModal = ({ onClose, onCreate }) => {
  const [intitule, setIntitule] = useState("");
  const [noteMax, setNoteMax] = useState(20);
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    const newErrors = {};

    if (intitule.trim() === "") {
      newErrors.intitule = "L'intitulé ne peut pas être vide.";
    }

    if (noteMax <= 0) {
      newErrors.noteMax = "La note doit être supérieure à 0.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const userId = CookieService.getUser()?.id;
      await axiosInstance.post(
        `/v1/examens/create/${userId}`,
        {
          intitule: intitule,
          note_max: noteMax,
        }
      );
      onCreate();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création :", error);
    }
  };

  const footer = (
    <>
      <button className={styles.btnCancel} onClick={onClose}>Annuler</button>
      <button className={styles.btnSubmit} onClick={handleSubmit}>Créer l'examen</button>
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Nouvel Examen"
      footer={footer}
    >
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Intitulé</label>
          <input
            type="text"
            className={styles.input}
            value={intitule}
            placeholder="Ex: Examen de Java"
            onChange={(e) => {
              setIntitule(e.target.value);
              setErrors((prev) => ({ ...prev, intitule: "" }));
            }}
          />
          {errors.intitule && (
            <p className={styles.error}>{errors.intitule}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Note sur</label>
          <input
            type="number"
            min="1"
            className={styles.input}
            value={noteMax}
            onChange={(e) => {
              setNoteMax(e.target.value);
              setErrors((prev) => ({ ...prev, noteMax: "" }));
            }}
          />
          {errors.noteMax && (
            <p className={styles.error}>{errors.noteMax}</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreerExamenModal;