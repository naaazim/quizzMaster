import React, { useState } from "react";
import axiosInstance from "../axiosInstance";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");  // Message d'erreur pour l'extension de fichier

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // Vérification de l'extension du fichier (PDF ou DOCX)
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

      if (!validTypes.includes(selectedFile.type)) {
        setErrorMessage("Seuls les fichiers PDF ou DOCX sont autorisés.");
        setFile(null);  // Réinitialisation du fichier si le type n'est pas valide
      } else {
        setErrorMessage("");  // Réinitialisation du message d'erreur si le fichier est valide
        setFile(selectedFile);  // Enregistrement du fichier
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si aucun fichier n'est sélectionné ou que l'extension n'est pas valide
    if (!file) {
      setErrorMessage("Veuillez télécharger un fichier PDF ou DOCX.");
      return;
    }

    // Créer un objet de requête JSON
    const request = {
      texte: "",
      userId: 13,
      reponseId: 2
    };

    // Créer un FormData pour envoyer des fichiers
    const formData = new FormData();
    formData.append("file", file);  // Ajout du fichier
    formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));  // Ajout de l'objet JSON sous forme de chaîne

    try {
      const response = await axiosInstance.post(
        "/v1/repond",
        formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi : ", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>

        <div>
          <label>Fichier (PDF ou DOCX) : </label>
          <input
            type="file"
            accept=".pdf, .docx"
            onChange={handleFileChange}
          />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}  {/* Affichage du message d'erreur */}
        </div>

        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
}

export default FileUpload;
