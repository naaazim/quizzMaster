import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { CookieService } from "../utils/cookieUtils";
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
    const user = CookieService.getUser();
    const userId = CookieService.getUser()?.id;

    const fetchGroupes = async () => {
        try {
            const response = await axiosInstance.get(`/v1/groupe/get-by-user/${userId}`);
            setGroupes(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des examens :", error);
        }
    };

    const fetchExamens = async () => {
        try {
            let res = await axiosInstance.get(`/v1/examens/by-createur`, {
                params: {
                    createurId: userId,
                },
            });
            if (user.appUserRole == "ADMIN") {
                res = await axiosInstance.get(`/v1/examens/get-all`);

            }
            setExamens(res.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des examens :", error);
        }
    };

    const fetchExamines = async () => {
        if (!examenId) return;
        try {
            const response = await axiosInstance.get(`/v1/passe-examen/users-in-examen/${examenId}`);
            setExamines(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des examinés :", error);
        }
    };

    const fetchNonExamines = async () => {
        if (!examenId) return;
        try {
            const response = await axiosInstance.get(`/v1/passe-examen/users-not-in-examen/${examenId}`);
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

    useEffect(() => {
        if (ajoutexamine) {
            fetchNonExamines();
        }
    }, [ajoutexamine]);

    useEffect(() => {
        if (ajoutgroupe) {
            fetchGroupes();
        }
    }, [ajoutgroupe]);

    const supprimerPasseExamen = async (id) => {
        try {
            await axiosInstance.delete(`/v1/passe-examen/supprimer/${id}/${examenId}`);
            await fetchExamines();  // Rafraîchir après suppression
            await fetchNonExamines();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    const ajouterPasseExamen = async (id) => {
        try {
            await axiosInstance.post(`/v1/passe-examen/ajouter?appUserId=${id}&examenId=${examenId}`, {});
            await fetchExamines();  // Rafraîchir après ajout
            await fetchNonExamines();
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
        }
    };

    const ajouterPasseExamenGroupe = async (id) => {
        try {
            await axiosInstance.post(`/v1/passe-examen/ajouter-groupe?groupeId=${id}&examenId=${examenId}`, {});
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

            <div style={{
                maxWidth: '1200px',
                margin: '2rem auto',
                padding: '0 1.5rem',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Header Section */}
                <div style={{
                    background: 'var(--surface)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '1.5rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '300px' }}>
                        <h2 style={{
                            margin: 0,
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap'
                        }}>
                            Examen :
                        </h2>
                        <select
                            style={{
                                flex: 1,
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: 'var(--radius-md)',
                                padding: '0.75rem 1rem',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                outline: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onChange={(e) => setExamenId(e.target.value)}
                            value={examenId || ""}
                        >
                            {examens.map((examen) => (
                                <option key={examen.id} value={examen.id} style={{ background: '#1a1a1a' }}>
                                    {examen.intitule}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="btn-primary"
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            onClick={() => { setAjoutExamine(true) }}
                        >
                            <span>+</span> Ajouter des examinés
                        </button>
                        <button
                            className="btn-secondary"
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'var(--text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            onClick={() => { setAjoutGroupe(true) }}
                        >
                            <span>+</span> Ajouter des groupes
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ minHeight: '400px' }}>
                    {examenId && <ListeExaminesQuiPassent examines={examines} fonction={supprimerPasseExamen} />}
                    {ajoutgroupe && <ListeGroupes groupes={groupes} fonction={ajouterPasseExamenGroupe} fonction1={() => { setAjoutGroupe(false) }} />}
                    {ajoutexamine && <ListeExaminesQuiPassentPas examines={nonExamines} fonction={ajouterPasseExamen} fonction1={() => { setAjoutExamine(false) }} />}
                </div>

                {/* Footer Action */}
                <div style={{
                    marginTop: '3rem',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={() => naviguer("/dashboard-examinateur")}
                        style={{
                            background: 'linear-gradient(135deg, var(--primary), hsl(250, 100%, 60%))',
                            color: 'white',
                            border: 'none',
                            padding: '1rem 3rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 8px 24px var(--primary-glow)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 12px 32px var(--primary-glow)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 24px var(--primary-glow)';
                        }}
                    >
                        Terminer
                    </button>
                </div>
            </div>
        </>
    );
}

export default AjouterPasseExamen;
