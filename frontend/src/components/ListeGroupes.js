import React from 'react';


function ListeGroupes({ groupes, fonction, fonction1 }) {
    return (
        <>
            <div className='p-2 justify-content-center d-flex flex-column rounded-3 border border-warning bg-white position-fixed top-50 start-50 translate-middle h-50 overflow-auto' >
                <button className='position-absolute top-0 end-0 btn-close m-2' aria-label='Close' onClick={() => fonction1()}></button>
                <h2 className='font-24 montserrat m-3 mx-auto'>Ajouter un groupe :</h2>
                <div className='d-flex flex-column'>
                    {groupes.length > 0 ? (
                        groupes.map((groupe) => (
                            <div key={groupe.id} className='d-flex align-items-center m-2'>
                                <div className='bg-bleu text-white montserrat text-dark p-3 rounded-pill align-items-center w-200 text-center'>
                                    {groupe.titre}
                                </div>
                                <button className='btn btn-outline-primary p-3  rounded-5 m-2 montserrat' onClick={() => fonction(groupe.id)}>Ajouter</button>
                            </div>
                        ))
                    ) : (
                        <p className='font-20 montserrat mx-auto text-danger'>Aucun groupe trouvé.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default ListeGroupes;