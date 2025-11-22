import React from 'react';


function ListeExaminesQuiPassentPas({ examines, fonction, fonction1 }) {
    return (
        <>
            <div className='p-2 justify-content-center d-flex flex-column rounded-3 border border-warning bg-white position-fixed top-50 start-50 translate-middle h-50 overflow-auto' >
                <button className='position-absolute top-0 end-0 btn-close m-2' aria-label='Close' onClick={() => fonction1()}></button>
                <p className='font-24 montserrat m-3 mx-auto'>Ajouter des examinés :</p>
                <div className='d-flex flex-column'>
                    {examines.length > 0 ? (
                        examines.map((examine) => (
                            <div key={examine.id} className='d-flex align-items-center m-2'>
                                <div className='bg-bleu text-white montserrat text-dark p-3 rounded-pill align-items-center w-400 text-center'>
                                    {examine.firstName} {examine.lastName}
                                </div>
                                <button className='btn btn-outline-primary p-3  rounded-5 m-2 montserrat' onClick={() => fonction(examine.id)}>Ajouter</button>
                            </div>
                        ))
                    ) : (
                        <p className='mx-auto text-danger'>Aucun examiné trouvé.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default ListeExaminesQuiPassentPas;
