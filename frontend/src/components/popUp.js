import styles from "../style/popUp.module.css";
import { useEffect, useState } from "react";
function PopUp({ message, etat }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className={etat === "success" ? styles.success : styles.failure}>
            <img src={etat === "success" ? "/succes.png" : "/fail.png"}
                alt={etat === "success" ? "Succés" : "Echec"}
                width={"50"}
                className={styles.image}
            />
            <p>{message}</p>
        </div>
    );
}

export default PopUp;