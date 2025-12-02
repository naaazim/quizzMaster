import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { CookieService } from '../utils/cookieUtils';
import styles from '../style/PasseExamen.module.css';

function PasseExamen() {
  const { id: examenId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [reponses, setReponses] = useState([]);
  const [options, setOptions] = useState({});
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Empêcher le retour en arrière
  useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      window.history.pushState(null, null, window.location.pathname);
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  useEffect(() => {
    const userData = CookieService.getUser();
    if (userData && userData.id) {
      setUserId(userData.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!userId || !examenId) {
      console.warn("Missing userId or examenId", { userId, examenId });
      return;
    }
    console.log("Fetching questions for examen:", examenId);
    axiosInstance.get(`/v1/examens/${examenId}/questions`)
      .then(response => {
        setQuestions(response.data);
        const initialReponses = response.data.map(q => ({
          questionId: q.id,
          texte: '',
          reponseIds: [],
          file: null // Pour type PIECE
        }));
        setReponses(initialReponses);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des questions :", error);
        setIsLoading(false);
      });
  }, [examenId, userId]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length && userId) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion.type === 'QCU' || currentQuestion.type === 'QCM') {
        axiosInstance.get(`/v1/question/${currentQuestion.id}/options`)
          .then(response => {
            setOptions(prev => ({
              ...prev,
              [currentQuestion.id]: response.data
            }
            ));
            console.log(response.data);
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des options :", error);
          });
      }

      setTimeLeft(currentQuestion.temps);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleNextQuestion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, questions, userId]);

  const handleReponseChange = (e, questionId) => {
    const { value, checked, type } = e.target;
    setReponses(prev => prev.map(r => {
      if (r.questionId !== questionId) return r;
      if (type === 'checkbox') {
        const newIds = checked
          ? [...r.reponseIds, parseInt(value)]
          : r.reponseIds.filter(id => id !== parseInt(value));
        return { ...r, reponseIds: newIds };
      } else if (type === 'radio') {
        return { ...r, reponseIds: [parseInt(value)] };
      } else {
        return { ...r, texte: value };
      }
    }));
  };

  const handleFileChange = (e, questionId) => {
    const file = e.target.files[0];
    setReponses(prev =>
      prev.map(r => r.questionId === questionId ? { ...r, file } : r)
    );
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitAllReponses();
    }
  };

  const submitAllReponses = async () => {
    if (!userId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      console.log(reponses);
      for (const question of questions) {
        const userResponse = reponses.find(r => r.questionId === question.id) || {};

        if (question.type === 'PIECE') {
          if (userResponse.file) {
            const reponseFictive = await axiosInstance.get(`/v1/question/${question.id}/options`);
            const formData = new FormData();
            formData.append("file", userResponse.file);
            formData.append("request", new Blob([JSON.stringify({
              userId,
              questionId: question.id,
              reponseId: reponseFictive.data[0].id
            })], { type: "application/json" }));

            await axiosInstance.post('/v1/repond/create-piece', formData, {
              headers: { "Content-Type": "multipart/form-data" }
            });
          }
          continue;
        }

        if (question.type === 'LIBRE') {
          const reponseFictive = await axiosInstance.get(`/v1/question/${question.id}/options`);
          await axiosInstance.post('/v1/repond', {
            texte: userResponse.texte || '',
            userId: userId,
            reponseId: reponseFictive.data[0].id
          });
        } else {
          const questionOptions = options[question.id] || [];
          for (const reponseId of userResponse.reponseIds || []) {
            const selectedOption = questionOptions.find(opt => opt.id === reponseId);
            await axiosInstance.post('/v1/repond', {
              texte: selectedOption?.texte || '',
              userId: userId,
              reponseId
            });
          }
        }
      }

      await axiosInstance.post(`/v1/passe-examen/finir/${examenId}`);
      navigate(`/dashboard-examine`);

    } catch (error) {
      console.log(error);
      console.error("Erreur lors de la soumission des réponses :", error);
      alert("Erreur lors de la soumission des réponses.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading) return <div className={styles.container}><div className={styles.content}>Chargement des questions...</div></div>;
  if (questions.length === 0) return <div className={styles.container}><div className={styles.content}>Aucune question trouvée.</div></div>;

  const currentQuestion = questions[currentQuestionIndex];
  const currentOptions = options[currentQuestion.id] || [];
  const currentReponse = reponses.find(r => r.questionId === currentQuestion.id) || { texte: '', reponseIds: [] };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.examTitle}>{questions[0]?.examen?.intitule || 'Examen'}</div>
        <div className={styles.timer}>
          {formatTime(timeLeft)}
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.questionCard}>
          <div className={styles.questionHeader}>
            <span>Question {currentQuestionIndex + 1} / {questions.length}</span>
            <span>{currentQuestion.nbPoints} Points</span>
          </div>

          <h2 className={styles.questionText}>{currentQuestion.texte}</h2>

          <div className={styles.answerSection}>
            {currentQuestion.type === 'LIBRE' && (
              <textarea
                className={styles.textArea}
                placeholder="Tapez votre réponse ici..."
                value={currentReponse.texte}
                onChange={(e) => handleReponseChange(e, currentQuestion.id)}
              />
            )}

            {(currentQuestion.type === 'QCM' || currentQuestion.type === 'QCU') && (
              <div className={styles.optionsGrid}>
                {currentOptions.map(option => (
                  <label
                    key={option.id}
                    className={`${styles.optionCard} ${currentReponse.reponseIds.includes(option.id) ? styles.selected : ''}`}
                  >
                    <input
                      className={styles.optionInput}
                      type={currentQuestion.type === 'QCM' ? 'checkbox' : 'radio'}
                      name={`question-${currentQuestion.id}`}
                      value={option.id}
                      checked={currentReponse.reponseIds.includes(option.id)}
                      onChange={(e) => handleReponseChange(e, currentQuestion.id)}
                    />
                    <span className={styles.optionLabel}>{option.texte}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'PIECE' && (
              <div className={styles.fileInputContainer}>
                <p style={{ marginBottom: '1rem' }}>Veuillez joindre votre fichier de réponse</p>
                <input type="file" onChange={(e) => handleFileChange(e, currentQuestion.id)} />
              </div>
            )}
          </div>

          <footer className={styles.footer}>
            <button
              className={styles.nextButton}
              onClick={handleNextQuestion}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi...' : (currentQuestionIndex < questions.length - 1 ? 'Suivant' : 'Terminer l\'examen')}
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default PasseExamen;