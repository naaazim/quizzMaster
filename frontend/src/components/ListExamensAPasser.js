import { useEffect, useState } from 'react';
import axiosInstance from "../axiosInstance";
import styles from "../style/listExamen.module.css"
import { useNavigate } from 'react-router-dom';

const ExamensAPasser = ({ userId }) => {
  const navigate = useNavigate();
  const [examens, setExamens] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Récupérer les examens à passer
  useEffect(() => {
    if (!userId) return;
    const fetchExamens = async () => {
      try {
        const response = await axiosInstance.get(`/v1/passe-examen/examen-a-passer/${userId}`);
        setExamens(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des examens corrigés :", error);
      }
    };
    fetchExamens();
  }, [userId]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.listExamens}>
      <div className={styles.examensAPasser} onClick={toggle}>
        <p>Examens à passer</p>
        <p>{isOpen ? '▼' : '▶'}</p>
      </div>
      {isOpen && (
        <div >
          {examens.length > 0 ? (
            examens.map((passeExamen) => (
              <div key={passeExamen.id} className={styles.flex}>
                <div className={styles.examenItems}>
                  <p><span>Examen:</span> {passeExamen.examen?.intitule}</p>
                  <p><span>Note Maximale:</span> {passeExamen.examen?.note_max}</p>
                </div>
                {/* Bouton Commencer pour chaque examen */}
                <button
                  className={styles.bouton}
                  onClick={() => {

                    navigate(`/passe-examen/${passeExamen.examen.id}`);
                  }
                  }
                >
                  Commencer
                </button>
              </div>
            ))
          ) : (
            <p>Aucun examen à passer</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamensAPasser;
