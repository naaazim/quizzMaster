import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import ListeExaminesQuiPassent from "../components/ListeExaminesQuiPassent";
import ListeExaminesQuiPassentPas from "../components/ListeExaminesQuiPassentPas";
import ListeGroupes from "../components/ListeGroupes";
import { useNavigate, useLocation } from "react-router-dom";

function AjouterPasseExamen() {
    const [examens, setExamens] = useState([]);
    const [examenId, setExamenId] = useState(null);
    const [examines, setExamines] = useState([]);
    const [nonExamines, setNonExamines] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [ajoutgroupe, setAjoutGroupe] = useState(false);
    const [ajoutexamine, setAjoutExamine] = useState(false);

    const naviguer = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = JSON.parse(localStorage.getItem("user"))?.id;

    const fetchGroupes = async () => {
        try {
            const response = await axiosInstance.get(`/api/v1/groupe/get-by-user/${userId}`);
            setGroupes(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des examens :", error);
        }
    };

    const fetchExamens = async () => {
        try {
            let res = await axiosInstance.get(`/api/v1/examens/by-createur`, {
                params: {
                    createurId: userId,
                },
            });
            if (user.appUserRole == "ADMIN") {
                res = await axiosInstance.get(`/api/v1/examens/get-all`);

            }
            setExamens(res.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des examens :", error);
        }
    };

    const fetchExamines = async () => {
        if (!examenId) return;
        try {
            const response = await axiosInstance.get(`/api/v1/passe-examen/users-in-examen/${examenId}`);
            setExamines(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des examinés :", error);
        }
    };

    const fetchNonExamines = async () => {
        if (!examenId) return;
        try {
            const response = await axiosInstance.get(`/api/v1/passe-examen/users-not-in-examen/${examenId}`);
            setNonExamines(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des non-examinés :", error);
        }
    };

    useEffect(() => {
        fetchExamens();
        fetchGroupes();
    }, []);

    useEffect(() => {
        if (examens.length > 0 && !examenId) {
            setExamenId(examens[0].id);
        }
    }, [examens]);

    useEffect(() => {
        if (examenId) {
            fetchExamines();
            fetchNonExamines();
        }
    }, [examenId]);

    const supprimerPasseExamen = async (id) => {
        try {
            await axiosInstance.delete(`/api/v1/passe-examen/supprimer/${id}/${examenId}`);
            await fetchExamines();  // Rafraîchir après suppression
            await fetchNonExamines();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    const ajouterPasseExamen = async (id) => {
        try {
            await axiosInstance.post(`/api/v1/passe-examen/ajouter?appUserId=${id}&examenId=${examenId}`);
            await fetchExamines();  // Rafraîchir après ajout
            await fetchNonExamines();
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
        }
    };

    const ajouterPasseExamenGroupe = async (id) => {
        try {
            await axiosInstance.post(`/api/v1/passe-examen/ajouter-groupe?groupeId=${id}&examenId=${examenId}`);
            await fetchExamines();  // Rafraîchir après ajout
            await fetchNonExamines();
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
        }
    };

    return (
        <>
            <Navbar title={"Gestion des examens"} />
            <div className='bgImage'></div>
            <div className="d-flex flex-row align-items-center m-3">
                <h2 className="montserrat m-3">Examen :</h2>
                <select className="border border-warning rounded-3 w-200 p-2" onChange={(e) => setExamenId(e.target.value)} value={examenId || ""}>
                    {examens.map((examen) => (
                        <option key={examen.id} value={examen.id}>{examen.intitule}</option>
                    ))}
                </select>
                <button className="btn btn-outline-primary p-2  rounded-5 m-2 montserrat" onClick={() => { setAjoutExamine(true) }}>Ajouter des examines</button>
                <button className='btn btn-outline-primary p-2  rounded-5 m-2 montserrat' onClick={() => { setAjoutGroupe(true) }}>Ajouter des groupes</button>
            </div>
            <div className="d-flex flex-column justify-content-center w-100">
                {examenId && <ListeExaminesQuiPassent examines={examines} fonction={supprimerPasseExamen} />}
                {ajoutgroupe && <ListeGroupes groupes={groupes} fonction={ajouterPasseExamenGroupe} fonction1={() => { setAjoutGroupe(false) }} />}
                {ajoutexamine && <ListeExaminesQuiPassentPas examines={nonExamines} fonction={ajouterPasseExamen} fonction1={() => { setAjoutExamine(false) }} />}
            </div>
            <button onClick={() => naviguer("/dashboard-examinateur")} className="position-absolute bg-bleu w-200 p-2 text-white m-2 montserrat rounded-5 bottom-0 end-0">Terminer</button>
        </>
    );
}

export default AjouterPasseExamen;
