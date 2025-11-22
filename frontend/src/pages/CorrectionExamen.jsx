import Navbar from "../components/Navbar";
import styles from "../style/CorrectionExamen.module.css";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import PopUp from "../components/popUp"; // Changé de popUp à PopUp
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
    const [popup, setPopup] = useState({ message: "", etat: "" });
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
    };

    const refreshPage = () => {
        window.location.reload();
    };

    const soumettreCorrection = (reponseId, questionId) => {
        if (corrections[reponseId] <= reponsesACorriger.find(u => u.id == reponseId).reponse.question.nbPoints && corrections[reponseId] >= 0) {
            axiosInstance.put(`/api/v1/repond/corriger`, {
                userId: examineId,
                questionId,
                note: corrections[reponseId]
            })
                .then(() => {
                    setPopup({ message: "Correction enregistrée", etat: "success" });
                    setTimeout(() => {
                        refreshPage();
                    }, 2000);
                })
                .catch(error => {
                    console.error("Erreur lors de l'enregistrement :", error);
                    setPopup({ message: "Erreur lors de l'enregistrement", etat: "failure" })
                });
        }
        else {
            setPopup({ message: "La note doit être conforme", etat: "failure" })
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
            {popup.message && <PopUp message={popup.message} etat={popup.etat} />} {/* Changé de popUp à PopUp */}
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
                                    <p><strong style={{ color: "#ffb600" }}>Question :</strong> {response.reponse?.question?.texte || "Question avec PJ"}</p>
                                    <p style={{ width: "70%" }}>
                                        <strong style={{ color: "#ffb600" }}>Réponse :</strong>
                                        {response.piece ? (
                                            <button onClick={() => downloadPieceJointe(response.piece.id)}>
                                                Télécharger la pièce jointe
                                            </button>
                                        ) : (
                                            <span> {response.texte}</span>
                                        )}
                                    </p>
                                </div>
                                {(response.reponse.question.type != "QCM" && response.reponse.question.type != "QCU") && (<div className={styles.divCorrection}>
                                    <div className={styles.correctionContainer}>
                                        <label className={styles.maCheckbox}>Note : </label>
                                        <input
                                            value={corrections[response.id]}
                                            style={{ height: "25px", width: "50px", cursor: "pointer" }}
                                            type="number"
                                            onChange={(e) => handleNoteChange(response.id, e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.divSoumettre}>
                                        <button
                                            onClick={() => soumettreCorrection(
                                                response.id,
                                                response.reponse?.question?.id || 0
                                            )}
                                            className={styles.boutonSoumettre}
                                        >
                                            Soumettre correction
                                        </button>
                                    </div>
                                </div>)}

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CorrectionExamen;