import axiosInstance from "../axiosInstance";

function Getreponse() {
  const downloadFile = async () => {
    try {
      const response = await axiosInstance.get(`http://localhost:8080/api/v1/repond/get-piece/4`, { responseType: "blob" });

      // Crée un objet File à partir des données binaires récupérées

      const file = new File([response.data], "file", { type: response.data.type });

      // Crée un lien temporaire pour déclencher le téléchargement
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file); // Crée une URL blob pour le fichier
      link.download = "file"; // Nom du fichier à télécharger
      link.click(); // Déclenche le téléchargement
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier :", error);
    }
  };


  return (
    <div>
      <button onClick={downloadFile}>Télécharger le fichier</button>
    </div>
  );
}

export default Getreponse;
