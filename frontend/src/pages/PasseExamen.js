import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import Navbar from "../components/Navbar.js";

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
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.id) {
      setUserId(userData.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;
    axiosInstance.get(`/api/v1/examens/${examenId}/questions`)
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
        axiosInstance.get(`/api/v1/question/${currentQuestion.id}/options`)
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
            const reponseFictive = await axiosInstance.get(`/api/v1/question/${question.id}/options`);
            const formData = new FormData();
            formData.append("file", userResponse.file);
            formData.append("request", new Blob([JSON.stringify({
              userId,
              questionId: question.id,
              reponseId: reponseFictive.data[0].id
            })], { type: "application/json" }));

            await axiosInstance.post('/api/v1/repond/create-piece', formData, {
              headers: { "Content-Type": "multipart/form-data" }
            });
          }
          continue;
        }

        if (question.type === 'LIBRE') {
          const reponseFictive = await axiosInstance.get(`/api/v1/question/${question.id}/options`);
          await axiosInstance.post('/api/v1/repond', {
            texte: userResponse.texte || '',
            userId: userId,
            reponseId: reponseFictive.data[0].id
          });
        } else {
          const questionOptions = options[question.id] || [];
          for (const reponseId of userResponse.reponseIds || []) {
            const selectedOption = questionOptions.find(opt => opt.id === reponseId);
            await axiosInstance.post('/api/v1/repond', {
              texte: selectedOption?.texte || '',
              userId: userId,
              reponseId
            });
          }
        }
      }

      await axiosInstance.post(`/api/v1/passe-examen/finir/${examenId}`);
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

  if (isLoading) return <div>Chargement des questions...</div>;
  if (questions.length === 0) return <div>Aucune question trouvée.</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const currentOptions = options[currentQuestion.id] || [];
  const currentReponse = reponses.find(r => r.questionId === currentQuestion.id) || { texte: '', reponseIds: [] };

  return (
    <>
      <Navbar title={"PASSAGE D'EXAMEN"} />
      <div className='bgImage'></div>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>EXAMEN: {questions[0]?.examen?.intitule || 'Examen'}</h2>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            Temps restant: {formatTime(timeLeft)}
          </div>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
          <h3>Question {currentQuestionIndex + 1}/{questions.length}</h3>
          <p><strong>Type:</strong> {currentQuestion.type}</p>
          <p><strong>Points:</strong> {currentQuestion.nbPoints}</p>
          <hr />
          <p style={{ fontSize: '18px', margin: '20px 0' }}>{currentQuestion.texte}</p>

          {currentQuestion.type === 'LIBRE' && (
            <textarea
              style={{ width: '100%', minHeight: '100px', padding: '10px' }}
              placeholder="Votre réponse..."
              value={currentReponse.texte}
              onChange={(e) => handleReponseChange(e, currentQuestion.id)}
            />
          )}

          {(currentQuestion.type === 'QCM' || currentQuestion.type === 'QCU') && (
            <div style={{ marginLeft: '20px' }}>
              {currentOptions.map(option => (
                <div key={option.id} style={{ margin: '10px 0' }}>
                  <input
                    type={currentQuestion.type === 'QCM' ? 'checkbox' : 'radio'}
                    id={`option-${option.id}`}
                    name={`question-${currentQuestion.id}`}
                    value={option.id}
                    checked={currentReponse.reponseIds.includes(option.id)}
                    onChange={(e) => handleReponseChange(e, currentQuestion.id)}
                  />
                  <label htmlFor={`option-${option.id}`} style={{ marginLeft: '10px' }}>
                    {option.texte}
                  </label>
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === 'PIECE' && (
            <div style={{ marginTop: '15px' }}>
              <label><strong>Uploader votre pièce jointe :</strong></label>
              <input type="file" onChange={(e) => handleFileChange(e, currentQuestion.id)} />
            </div>
          )}
        </div>

        <button
          onClick={handleNextQuestion}
          disabled={isSubmitting}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: isSubmitting ? '#cccccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            float: 'right'
          }}
        >
          {isSubmitting ? 'Envoi en cours...' : (currentQuestionIndex < questions.length - 1 ? 'Question suivante' : 'Terminer l\'examen')}
        </button>
      </div>
    </>
  );
}

export default PasseExamen;