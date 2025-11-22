import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
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

    const userId = JSON.parse(localStorage.getItem("user"))?.id;


    const fetchExamens = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            let res = await axiosInstance.get(`/api/v1/examens/by-createur`, {
                params: {
                    createurId: userId,
                },
            });
            if (user.appUserRole == "ADMIN") {
                res = await axiosInstance.get(`/api/v1/examens/get-all`);

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
                    setExamens((await axiosInstance.get(`/api/v1/examens/by-createur?createurId=${userId}`)).data);
                    setTaux((await axiosInstance.get(`/api/v1/passe-examen/taux-reussite/${examenId}`)).data);
                    setMoy((await axiosInstance.get(`/api/v1/passe-examen/note-moy/${examenId}`)).data);
                    setMax((await axiosInstance.get(`/api/v1/passe-examen/note-max/${examenId}`)).data);
                    setMin((await axiosInstance.get(`/api/v1/passe-examen/note-min/${examenId}`)).data);
                    setMed((await axiosInstance.get(`/api/v1/passe-examen/note-med/${examenId}`)).data);
                    setNb((await axiosInstance.get(`/api/v1/passe-examen/nombre/${examenId}`)).data);
                    setEcart((await axiosInstance.get(`/api/v1/passe-examen/ecart/${examenId}`)).data);

                } catch (error) {
                    console.log("erreur");
                }
            };
            fetchAnalyses();
        }

    }, [examenId]);

    if (examens.length == 0) {
        return (<>
            <Navbar title={"Analyses"} />
            <h1 className="mx-auto text-danger w-400 text-center">Aucun examen trouvé</h1>
        </>)
    }
    if (nb == 0) {
        return (<>
            <Navbar title={"Analyses"} />
            <div className="d-flex flex-row align-items-center m-3">
                <h2 className="montserrat m-3">Examen :</h2>
                <select className="border border-warning rounded-3 w-200 p-2" onChange={(e) => setExamenId(e.target.value)} value={examenId || ""}>
                    {examens.map((examen) => (
                        <option key={examen.id} value={examen.id}>{examen.intitule}</option>
                    ))}
                </select>
            </div>
            <h3 className="mx-auto text-danger w-400 text-center">Aucun passage n'a été effectué</h3>
        </>)
    }
    return (
        <>
            <Navbar title={"Analyses"} />
            <div className='bgImage'></div>
            <div className="d-flex flex-row align-items-center m-3">
                <h2 className="montserrat m-3">Examen :</h2>
                <select className="border border-warning rounded-3 w-200 p-2" onChange={(e) => setExamenId(e.target.value)} value={examenId || ""}>
                    {examens.map((examen) => (
                        <option key={examen.id} value={examen.id}>{examen.intitule}</option>
                    ))}
                </select>
            </div>
            <div className={style.analysesContainer}>
                <div className="d-flex flex-column justify-content-center">
                    <div className="d-flex flex-row m-3 align-items-center">
                        <img src="utilisateur.png" style={{ width: "50px", height: "50px" }}></img>
                        <h4>Nombre de passages : {nb}</h4>
                    </div>
                    <h2 className="montserrat m-3 text-center">Taux de réussite</h2>
                    <CircularProgressBar sqSize={300} strokeWidth={10} percentage={taux * 100} />
                </div>
                <div className={style.notes}>
                    <p className={style.note}>Note moyenne :  {moy}/{examens.find((examen) => examen.id === examenId)?.note_max}</p>
                    <p className={style.note}>Note maximale :  {max}/{examens.find((examen) => examen.id === examenId)?.note_max}</p>
                    <p className={style.note}>Note minimale :  {min}/{examens.find((examen) => examen.id === examenId)?.note_max}</p>
                    <p className={style.note}>Note médiane :  {med}/{examens.find((examen) => examen.id === examenId)?.note_max}</p>
                    <p className={style.note}>Ecart type :  {ecart}</p>
                </div>
            </div>
        </>
    );
}

export default Analyses;
