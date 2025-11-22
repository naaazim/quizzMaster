
import { useState } from "react";

function CreationGroupe({ fonction1, fonction2 }) {
    const [titre, setTitre] = useState("");

    return (
        <>
            <div className='p-2 justify-content-center d-flex flex-column rounded-3 border border-warning bg-white position-fixed top-50 start-50 translate-middle w-50 h-50'>
                <button className='position-absolute top-0 end-0 btn-close m-2' aria-label='Close' onClick={() => fonction1()}></button>
                <h3 className='text-center'>Ajouter un groupe</h3>
                <form className='w-100 d-flex flex-column align-items-center' onSubmit={(e) => { e.preventDefault(); fonction2(titre); }}>
                    <input type='text' id='titre' className='p-2 rounded-3 border border-warning bg-white m-2' required placeholder='Exemple : 5emeA' onChange={(event) => {
                        setTitre(event.target.value);
                    }} />
                    <button type='submit' className='btn btn-outline-primary m-2'>Valider</button>
                </form>
            </div>
        </>
    );
}

export default CreationGroupe;
