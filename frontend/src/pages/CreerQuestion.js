
import { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";

function CreerQuestion({ examenId }) {
    //Variables
    const [type, setType] = useState("QCM"); //variable pour l'aff. des opt. de rép
    const [nbPoints, setNbPoints] = useState(0);
    const [melange, setMelange] = useState(false); //melange ?
    const [texte, setTexte] = useState(""); //var. pour le texte de la qu.
    const [options, setOptions] = useState([]); //opt. de rép.
    const [nbOptions, setNbOptions] = useState(""); //nb d'opt. de rép.
    const naviguer = useNavigate();


    async function saveQuestion(event) {
        event.preventDefault();
        const question = await axiosInstance.post("/api/v1/question/create", {
            type: type,
            texte: texte,
            nbPoints: nbPoints,
            examenId: examenId
        });

        if (type === "QCM" || type === "QCU") {
            options.forEach((reponse) => {
                axiosInstance.post("/api/v1/question/create-reponse", {
                    texte: reponse.texte,
                    valeur: reponse.valeur,
                    questionId: question.data.id
                });

            });
        } else {
            axiosInstance.post("/api/v1/question/create-reponse", {
                texte: "",
                valeur: false,
                questionId: question.data.id
            });
        }

    }

    const handleTypeChange = (e) => {
        setType(e.target.value);
    }

    const handleNbPointsChange = (e) => {
        setNbPoints(Number(e.target.value));
    }

    const handleMelangeChange = (e) => {
        setMelange(e.target.checked);
    }

    const handleTexteChange = (e) => {
        setTexte(e.target.value);
    }

    //m.a.j. le nombre d'options de réponses
    const handleNbOptionsChange = (e) => {
        setNbOptions(e.target.value);

        if (Number(e.target.value) > 0) {
            setOptions(Array.from({ length: Number(e.target.value) }, () => ({ texte: "", valeur: false })));
        } else {
            setOptions([]);
        }
    }

    //m.a.j. du texte d'une option à un indice
    const handleOptionTexteChange = (i, val) => {
        const nvOptions = [...options];
        nvOptions[i].texte = val;
        setOptions(nvOptions);
    }

    //m.a.j. de la var correcte d'une option à un indice
    const handleOptionCorrecteChange = (i, checked) => {
        const nvOptions = [...options];
        nvOptions[i].valeur = checked;
        console.log(checked);
        setOptions(nvOptions);
    }

    //m.a.j des options lorsque c'est une pj
    const handleFileChange = (e) => {
        const fich = e.target.files[0];
        if (fich) {
            const nvOption = { id: Date.now(), element: fich };
            setOptions([nvOption]);
        }
        else {
            setOptions([]);
        }
    }

    //m.a.j. le nombre d'options de réponses
    const handleRepTexteChange = (e) => {
        setOptions([e.target.value]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const questionData = {
            type,
            nbPoints,
            melange,
            texte,
            options,
        };
        console.log("q :", questionData);
    }
    return (
        <div className="creerQuestion">
            {/*---------- déb. du form. ----------*/}
            <form onSubmit={saveQuestion} className="form">
                <div className="ligne1">
                    <label>
                        Type :
                        <select value={type} onChange={handleTypeChange}>
                            <option value="QCM">QCM</option>
                            <option value="QCU">QCU</option>
                            <option value="PIECE">Pièce jointe</option>
                            <option value="LIBRE">Texte</option>
                        </select>
                    </label>

                    <label>
                        Nombre de points :
                        <input type="number" value={nbPoints} onChange={handleNbPointsChange} />
                    </label>

                    <label>
                        Mélanger les réponses ?
                        <input type="checkbox" value={melange} onChange={(e) => setMelange(e.target.checked)} />
                    </label>
                </div>

                <div className="ligne2">
                    <label>
                        Texte :
                        <input type="text" value={texte} onChange={handleTexteChange} />
                    </label>
                </div>
                {(type === "QCM" || type === "QCU") && (
                    <div className="ligne3">
                        <label>
                            Nombre d'options :
                            <input type="number" value={nbOptions} onChange={handleNbOptionsChange} min="1" />
                        </label>

                        <hr className="separator" />

                        {options.map((option, i) => (
                            <div key={i} className="option">
                                <div className="optiontexte">
                                    <label>
                                        Option {i + 1} :
                                        <input type="text" value={option.texte} onChange={(e) => handleOptionTexteChange(i, e.target.value)} />
                                    </label>
                                </div>
                                <div className="optioncheck">
                                    <label htmlFor={`checkbox-${i}`}>
                                        Bonne réponse ?
                                        <input
                                            id={`checkbox-${i}`}
                                            type="checkbox"
                                            className="checkbox-bonne-reponse"
                                            onChange={(e) => handleOptionCorrecteChange(i, e.target.checked)}
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="bouton">
                    <button type="submit">Valider</button>
                </div>
            </form>
            {/*---------- fin du form. ----------*/}
        </div>
    );
}

export default CreerQuestion;