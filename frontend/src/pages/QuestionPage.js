import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

function PageDeQuestion({ examId, onNext }) {

    const [questionIndex, setQuestionIndex] = useState(0);
    const [listeQuestions, setListeQuestions] = useState([]);
    const [listeReponses, setListeReponses] = useState([]);
    const questionActuelle = listeQuestions[questionIndex];

    const [reponseTexte, setReponseTexte] = useState("");
    const [fichier, setFichier] = useState(null);
    const [reponsesCochees, setReponsesCochees] = useState([]);

    const [temps, setTemps] = useState(0);
    const idQuestion = questionActuelle?.id;

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/examens/9/questions`)
            .then((res) => res.json())
            .then((data) => { setListeQuestions(data); console.log(data[0].temps) })
            .catch((err) => console.error("Erreur pendant le chargement:", err));
    }, []);

    useEffect(() => {
        if (!questionActuelle) return;
        console.log(questionActuelle);
        setTemps(questionActuelle.temps || 30);

        const timer = setInterval(() => {
            setTemps((ancienTemps) => {
                if (ancienTemps <= 1) {
                    clearInterval(timer);
                    allerAQuestionSuivante();
                    return 0;
                }
                return ancienTemps - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [questionIndex]);

    if (!questionActuelle) return <div>Chargement en cours...</div>;

    const envoyerFichier = (fichier, donnees) => {
        const formData = new FormData();
        formData.append("request", new Blob([JSON.stringify(donnees)], { type: "application/json" }));
        formData.append("file", fichier);

        return fetch("http://localhost:8080/api/v1/repond", {
            method: "POST",
            body: formData,
        }).then((res) => res.json());
    };

    const gererClicChoix = (valeur) => {
        if (questionActuelle.type === "QCM") {
            if (reponsesCochees.includes(valeur)) {
                setReponsesCochees(reponsesCochees.filter((v) => v !== valeur));
            } else {
                setReponsesCochees([...reponsesCochees, valeur]);
            }
        } else {
            setReponsesCochees([valeur]);
        }
    };

    const allerAQuestionSuivante = () => {
        const type = questionActuelle.type;
        const donneesAEnvoyer = {
            texte: type === "LIBRE" ? reponseTexte : "",
            userId: 1,
            reponseId: 2,
        };

        if (type === "PIECE" && fichier) {
            envoyerFichier(fichier, donneesAEnvoyer)
                .then((data) => console.log("Réponse (fichier) envoyée:", data))
                .catch((err) => console.error("Erreur fichier:", err));
        } else {
            envoyerFichier(new Blob(), donneesAEnvoyer)
                .then((data) => console.log("Réponse envoyée:", data))
                .catch((err) => console.error("Erreur:", err));
        }

        setQuestionIndex(questionIndex += 1);
    };

    return (
        <div>
            <h2>{questionActuelle.texte}</h2>
            <p>Temps restant : {temps}s</p>

            {(questionActuelle.type === "QCM" || questionActuelle.type === "QCU") &&
                questionActuelle.options.map((opt, i) => (
                    <div key={i}>
                        <input
                            type={questionActuelle.type === "QCU" ? "radio" : "checkbox"}
                            name="choix"
                            value={opt.texte}
                            checked={reponsesCochees.includes(opt.texte)}
                            onChange={() => gererClicChoix(opt.texte)}
                        />
                        <label>{opt.texte}</label>
                    </div>
                ))}

            {questionActuelle.type === "LIBRE" && (
                <textarea
                    value={reponseTexte}
                    onChange={(e) => setReponseTexte(e.target.value)}
                />
            )}

            {questionActuelle.type === "PIECE" && (
                <input
                    type="file"
                    onChange={(e) => setFichier(e.target.files[0])}
                />
            )}

            {questionIndex < listeQuestions.length - 1 ? (
                <button onClick={allerAQuestionSuivante}>Question suivante</button>
            ) : (
                <button onClick={allerAQuestionSuivante}>Terminer</button>
            )}
        </div>
    );
}

function PassageExamen() {
    const [indice, setIndice] = useState(0);

    return (
        <PageDeQuestion
            examId="9"
            onNext={() => setIndice((i) => i + 1)}
        />
    );
}

export default PassageExamen;
