import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { CookieService } from "../utils/cookieUtils";
import CircularProgressBar from "../components/CircularProgressBar";
import { useNavigate, useLocation } from "react-router-dom";
import style from "../style/Analyses.module.css"

function Analyses() {
    const [examens, setExamens] = useState([]);
    const [examenId, setExamenId] = useState(null);
    const [taux, setTaux] = useState(0);
    const [moy, setMoy] = useState(0);
    const [max, setMax] = useState(0);
    const [min, setMin] = useState(0);
    const [med, setMed] = useState(0);
    const [nb, setNb] = useState(0);
    const [ecart, setEcart] = useState(0);

    const naviguer = useNavigate();

    const userId = CookieService.getUser()?.id;


    const fetchExamens = async () => {
        try {
            const user = CookieService.getUser();
            let res = await axiosInstance.get(`/v1/examens/by-createur`, {
                params: {
                    createurId: userId,
                },
            });
            if (user.appUserRole == "ADMIN") {
                res = await axiosInstance.get(`/v1/examens/get-all`);

            }
            setExamens(res.data);
            setExamenId((res.data)[0].id);
        } catch (error) {
            console.error("Erreur lors de la récupération des examens :", error);
        }
    };


    useEffect(() => {
        fetchExamens();
    }, []);

    useEffect(() => {
        if (examenId) {
            const fetchAnalyses = async () => {
                try {
                    setExamens((await axiosInstance.get(`/v1/examens/by-createur?createurId=${userId}`)).data);
                    setTaux((await axiosInstance.get(`/v1/passe-examen/taux-reussite/${examenId}`)).data);
                    setMoy((await axiosInstance.get(`/v1/passe-examen/note-moy/${examenId}`)).data);
                    setMax((await axiosInstance.get(`/v1/passe-examen/note-max/${examenId}`)).data);
                    setMin((await axiosInstance.get(`/v1/passe-examen/note-min/${examenId}`)).data);
                    setMed((await axiosInstance.get(`/v1/passe-examen/note-med/${examenId}`)).data);
                    setNb((await axiosInstance.get(`/v1/passe-examen/nombre/${examenId}`)).data);
                    setEcart((await axiosInstance.get(`/v1/passe-examen/ecart/${examenId}`)).data);

                } catch (error) {
                    console.log("erreur");
                }
            };
            fetchAnalyses();
        }

    }, [examenId]);

    if (examens.length == 0) {
        return (
            <>
                <Navbar title={"Analyses"} />
                <div className={style.container}>
                    <div className={style.emptyState}>
                        <h1>Aucun examen trouvé</h1>
                    </div>
                </div>
            </>
        )
    }
    if (nb == 0) {
        return (
            <>
                <Navbar title={"Analyses"} />
                <div className={style.container}>
                    <div className={style.header}>
                        <h2>Examen :</h2>
                        <select className={style.select} onChange={(e) => setExamenId(e.target.value)} value={examenId || ""}>
                            {examens.map((examen) => (
                                <option key={examen.id} value={examen.id}>{examen.intitule}</option>
                            ))}
                        </select>
                    </div>
                    <div className={style.emptyState}>
                        <h3>Aucun passage n'a été effectué</h3>
                    </div>
                </div>
            </>
        )
    }
    const formatStat = (val) => {
        if (val === null || val === undefined || isNaN(val)) return "-";
        return val;
    };

    return (
        <>
            <Navbar title={"Analyses"} />
            <div className={style.container}>
                <div className={style.header}>
                    <h2>Examen :</h2>
                    <select className={style.select} onChange={(e) => setExamenId(e.target.value)} value={examenId || ""}>
                        {examens.map((examen) => (
                            <option key={examen.id} value={examen.id}>{examen.intitule}</option>
                        ))}
                    </select>
                </div>

                <div className={style.analysesContent}>
                    <div className={style.chartSection}>
                        <div className={style.passagesInfo}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ color: '#e2e8f0' }}
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <h4>Nombre de passages : {nb}</h4>
                        </div>
                        <h2 className={style.chartTitle}>Taux de réussite</h2>
                        <CircularProgressBar sqSize={250} strokeWidth={10} percentage={isNaN(taux) ? 0 : taux * 100} />
                    </div>

                    <div className={style.statsSection}>
                        <div className={style.statCard}>
                            <span className={style.statLabel}>Note moyenne</span>
                            <span className={style.statValue}>{formatStat(moy)}<span>/{examens.find((examen) => examen.id === examenId)?.note_max}</span></span>
                        </div>
                        <div className={style.statCard}>
                            <span className={style.statLabel}>Note maximale</span>
                            <span className={style.statValue}>{formatStat(max)}<span>/{examens.find((examen) => examen.id === examenId)?.note_max}</span></span>
                        </div>
                        <div className={style.statCard}>
                            <span className={style.statLabel}>Note minimale</span>
                            <span className={style.statValue}>{formatStat(min)}<span>/{examens.find((examen) => examen.id === examenId)?.note_max}</span></span>
                        </div>
                        <div className={style.statCard}>
                            <span className={style.statLabel}>Note médiane</span>
                            <span className={style.statValue}>{formatStat(med)}<span>/{examens.find((examen) => examen.id === examenId)?.note_max}</span></span>
                        </div>
                        <div className={style.statCard}>
                            <span className={style.statLabel}>Ecart type</span>
                            <span className={style.statValue}>{formatStat(ecart)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Analyses;
