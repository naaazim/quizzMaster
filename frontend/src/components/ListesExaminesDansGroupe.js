import React from 'react';


function ListeExaminesDansGroupe({ examines, fonction }) {
    return (
        <>
            <div className='d-flex flex-column mx-auto'>
                <h2 className='montserrat m-3'>Composition du groupe :</h2>
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    {examines.length > 0 ? (
                        examines.map((examine) => (
                            <div key={examine.user.id} className='d-flex align-items-center m-2'>
                                <div className='bg-bleu text-white montserrat text-dark p-3 rounded-pill align-items-center w-400 text-center'>
                                    {examine.user.firstName} {examine.user.lastName}
                                </div>
                                <button className='btn btn-outline-danger p-3  rounded-5 m-2 montserrat' onClick={() => fonction(examine.user.id)}>Retirer</button>
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

export default ListeExaminesDansGroupe;