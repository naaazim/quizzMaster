import Navbar from "../components/Navbar";
import styles from "../style/CorrectionExamen.module.css";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useParams, useLocation } from "react-router-dom";

function CorrectionExamen() {
    const { examineId, examenId } = useParams();
    const location = useLocation();
    const mode = location.state?.mode || "create";
    const [reponsesACorriger, setReponsesACorriger] = useState([]);
    const [corrections, setCorrections] = useState({});
    const [loading, setLoading] = useState(true);
    const [examenInfo, setExamenInfo] = useState('');
    const [examineInfo, setExamineInfo] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState({});

    useEffect(() => {
        if (examineId && examenId) {
            const endpoint =
                mode === "update"
                    ? `/api/v1/repond/get-by-exam-user/${examenId}/${examineId}`
                    : `/api/v1/repond/getReponsesACorriger/${examineId}/${examenId}`;

            axiosInstance.get(endpoint)
                .then(response => {
                    setReponsesACorriger(response.data);

                    const initialCorrections = {};
                    response.data.forEach(reponse => {
                        initialCorrections[reponse.id] = reponse.note || 0;
                    });
                    setCorrections(initialCorrections);

                    if (response.data.length > 0) {
                        setExamenInfo(response.data[0].reponse?.question?.examen?.intitule || 'Examen');
                        setExamineInfo(`${response.data[0].user.firstName} ${response.data[0].user.lastName}`);
                    }

                    setLoading(false);
                })
                .catch(error => {
                    console.error("Erreur:", error);
                    setLoading(false);
                });
        }
    }, [examineId, examenId]);

    const handleNoteChange = (reponseId, note) => {
        setCorrections(prev => ({
            ...prev,
            [reponseId]: note
        }));
        // Reset status when user changes note
        if (submissionStatus[reponseId]) {
            setSubmissionStatus(prev => ({ ...prev, [reponseId]: null }));
        }
    };

    const soumettreCorrection = (reponseId, questionId) => {
        const reponse = reponsesACorriger.find(u => u.id === reponseId);
        if (corrections[reponseId] <= reponse.reponse.question.nbPoints && corrections[reponseId] >= 0) {
            axiosInstance.put(`/api/v1/repond/corriger`, {
                userId: examineId,
                questionId,
                note: corrections[reponseId]
            })
                .then(() => {
                    setSubmissionStatus(prev => ({ ...prev, [reponseId]: 'success' }));
                    // Optional: clear success message after a few seconds
                    setTimeout(() => {
                        setSubmissionStatus(prev => ({ ...prev, [reponseId]: null }));
                    }, 3000);
                })
                .catch(error => {
                    console.error("Erreur lors de l'enregistrement :", error);
                    setSubmissionStatus(prev => ({ ...prev, [reponseId]: 'error' }));
                });
        }
        else {
            // alert("La note doit être conforme"); // Or handle validation error in UI
            setSubmissionStatus(prev => ({ ...prev, [reponseId]: 'invalid' }));
        }
    };

    const downloadPieceJointe = async (pieceId) => {
        try {
            const response = await axiosInstance.get(`/api/v1/repond/get-piece/${pieceId}`, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'piece_jointe');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Erreur lors du téléchargement de la pièce jointe :", error);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar title={"CORRECTION DES EXAMENS"} />
                <div className={styles.p}>Chargement...</div>
            </>
        );
    }

    if (!reponsesACorriger || reponsesACorriger.length === 0) {
        return (
            <>
                <Navbar title={"CORRECTION DES EXAMENS"} />
                <div className={styles.p}>Aucune réponse à corriger</div>
            </>
        );
    }

    return (
        <>
            <Navbar title={"CORRECTION DES EXAMENS"} />
            <div className={styles.examensACorriger}>
                <div className={styles.examenContainer}>
                    <div className={styles.menuDeroulant}>
                        <strong>Examen :</strong> {examenInfo} -
                        <strong> Examiné :</strong> {examineInfo}
                    </div>

                    <div className={styles.reponsesContainer}>
                        {reponsesACorriger.map((response, idx) => (
                            <div key={idx} className={styles.divReponse}>
                                <div>
                                    <p><strong>Question :</strong> {response.reponse?.question?.texte || "Question avec PJ"}</p>
                                    <p style={{ width: "100%" }}>
                                        <strong>Réponse :</strong>
                                        {response.piece ? (
                                            <button className="btn-secondary" onClick={() => downloadPieceJointe(response.piece.id)}>
                                                Télécharger la pièce jointe
                                            </button>
                                        ) : (
                                            <span> {response.texte}</span>
                                        )}
                                    </p>
                                </div>
                                {(response.reponse.question.type != "QCM" && response.reponse.question.type != "QCU") && (
                                    <div className={styles.divCorrection}>
                                        <div className={styles.correctionControls}>
                                            <div className={styles.inputGroup}>
                                                <label className={styles.maCheckbox}>Note : </label>
                                                <input
                                                    value={corrections[response.id]}
                                                    className="input-primary"
                                                    style={{ width: "70px", padding: "0.4rem" }}
                                                    type="number"
                                                    onChange={(e) => handleNoteChange(response.id, e.target.value)}
                                                />
                                            </div>
                                            <button
                                                onClick={() => soumettreCorrection(
                                                    response.id,
                                                    response.reponse?.question?.id || 0
                                                )}
                                                className="btn-primary"
                                                disabled={submissionStatus[response.id] === 'success'}
                                            >
                                                {submissionStatus[response.id] === 'success' ? 'Enregistré' : 'Soumettre'}
                                            </button>
                                        </div>
                                        {submissionStatus[response.id] === 'success' && (
                                            <span className={styles.successMessage}>
                                                ✓ Correction sauvegardée
                                            </span>
                                        )}
                                        {submissionStatus[response.id] === 'invalid' && (
                                            <span className={styles.errorMessage}>
                                                ⚠ Note invalide (Max: {response.reponse.question.nbPoints})
                                            </span>
                                        )}
                                        {submissionStatus[response.id] === 'error' && (
                                            <span className={styles.errorMessage}>
                                                ⚠ Erreur lors de l'enregistrement
                                            </span>
                                        )}
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CorrectionExamen;