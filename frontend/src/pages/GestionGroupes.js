import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import ListeExaminesDansGroupe from "../components/ListesExaminesDansGroupe";
import ListeExaminesPasDansGroupe from "../components/ListeExaminesPasDansGroupe";
import CreationGroupe from "../components/CreationGroupes";
import { useNavigate } from "react-router-dom";
import styles from "../style/GestionGroupes.module.css";

function GestionGroupes() {
    const [groupes, setGroupes] = useState([]);
    const [examines, setExamines] = useState([]);
    const [nonExamines, setNonExamines] = useState([]);
    const [groupeId, setGroupeId] = useState(null);
    const [popupGroupe, setPopupGroupe] = useState(false);
    const [ajout, setAjout] = useState(false);

    const naviguer = useNavigate();
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchGroupes = async () => {
        try {
            let response = await axiosInstance.get(`/api/v1/groupe/get-by-user/${userId}`);
            if (user.appUserRole == "ADMIN") {
                response = await axiosInstance.get(`/api/v1/groupe/get-all`);
            }
            setGroupes(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des examens :", error);
        }
    };

    const fetchExamines = async () => {
        if (!groupeId) return;
        try {
            const response = await axiosInstance.get(`/api/v1/appartient-groupe/get-users-in/${groupeId}`);
            setExamines(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des examinés :", error);
        }
    };

    const fetchNonExamines = async () => {
        if (!groupeId) return;
        try {
            const response = await axiosInstance.get(`/api/v1/appartient-groupe/get-users-not-in/${groupeId}`);
            setNonExamines(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des non-examinés :", error);
        }
    };

    useEffect(() => {
        fetchGroupes();
    }, []);

    useEffect(() => {
        if (groupes.length > 0 && !groupeId) {
            setGroupeId(groupes[0].id);
        }
    }, [groupes]);

    useEffect(() => {
        if (groupeId) {
            fetchExamines();
            fetchNonExamines();
        }
    }, [groupeId]);

    const supprimerDuGroupe = async (id) => {
        try {
            await axiosInstance.delete(`/api/v1/appartient-groupe/supprimer/${id}/${groupeId}`);
            await fetchGroupes();
            await fetchExamines();
            await fetchNonExamines();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    const ajouterGroupe = async (intitule) => {
        try {
            await axiosInstance.post(`/api/v1/groupe/create`, { intitule: intitule, createurId: userId });
            await fetchGroupes();
            await fetchExamines();
            await fetchNonExamines();
            setPopupFalse();
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
        }
    };

    const ajouterdansGroupe = async (id) => {
        try {
            await axiosInstance.post(`/api/v1/appartient-groupe/ajouter/${id}/${groupeId}`);
            await fetchGroupes();
            await fetchExamines();
            await fetchNonExamines();
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
        }
    };

    const setPopupFalse = () => setPopupGroupe(false);

    return (
        <Layout title="Gestion des groupes">
            <div className={styles.pageContainer}>
                <div className={styles.actionBar}>
                    <div className={styles.groupSelector}>
                        <label className={styles.label}>Groupe :</label>
                        <select className={styles.select} onChange={(e) => setGroupeId(e.target.value)} value={groupeId || ""}>
                            {groupes.map((groupe) => (
                                <option key={groupe.id} value={groupe.id}>{groupe.titre}</option>
                            ))}
                        </select>
                    </div>
                    <button className={styles.addButton} onClick={() => { setAjout(true) }}>Ajouter des examinés</button>
                    <button className={styles.addButton} onClick={() => setPopupGroupe(true)}>Ajouter un groupe</button>
                </div>

                {popupGroupe && <CreationGroupe userId={userId} fonction1={setPopupFalse} fonction2={ajouterGroupe} />}
                <div className={styles.listsContainer}>
                    {groupeId && <ListeExaminesDansGroupe examines={examines} fonction={supprimerDuGroupe} />}
                    {ajout && <ListeExaminesPasDansGroupe examines={nonExamines} fonction={ajouterdansGroupe} fonction1={() => setAjout(false)} />}
                </div>
                <button onClick={() => naviguer("/dashboard-examinateur")} className={styles.finishButton}>Terminer</button>
            </div>
        </Layout>
    );
}

export default GestionGroupes;