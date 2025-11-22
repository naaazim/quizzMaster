import React from 'react';


function ListeExaminesQuiPassent({ examines, fonction }) {
    return (
        <>
            <div className='d-flex flex-column mx-auto'>
                <h2 className='montserrat mx-auto'>Liste des inscrits :</h2>
                <div className='d-flex flex-column'>
                    {examines.length > 0 ? (
                        examines.map((examine) => examine.appUser && (
                            <div key={examine.appUser.id} className='d-flex align-items-center m-2'>
                                <div className='bg-bleu text-white montserrat text-dark p-3 rounded-pill align-items-center w-400 text-center'>
                                    {examine.appUser.firstName} {examine.appUser.lastName}
                                </div>
                                <button className='btn btn-outline-danger p-3  rounded-5 m-2 montserrat' onClick={() => fonction(examine.appUser.id)}>Retirer</button>
                            </div>
                        ))
                    ) : (
                        <p className='font-20 montserrat mx-auto text-danger'>Aucun examiné trouvé.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default ListeExaminesQuiPassent;
