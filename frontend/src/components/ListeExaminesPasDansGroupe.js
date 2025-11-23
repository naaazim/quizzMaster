import React from 'react';

function ListeExaminesPasDansGroupe({ examines, fonction, fonction1 }) {
    return (
        <>
            {/* Overlay */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.85)',
                    zIndex: 9998
                }}
                onClick={() => fonction1()}
            />

            {/* Modal */}
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '700px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    zIndex: 9999,
                    background: 'linear-gradient(135deg, hsl(230, 15%, 15%), hsl(230, 15%, 12%))',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.8), 0 20px 60px rgba(0, 0, 0, 0.9)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className='position-absolute top-0 end-0 btn-close m-2'
                    aria-label='Close'
                    onClick={() => fonction1()}
                />

                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    marginBottom: '2rem',
                    color: 'var(--text-primary)'
                }}>
                    Ajouter des examinés
                </h3>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    {examines.length > 0 ? (
                        examines.map((examine) => (
                            <div
                                key={examine.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '1rem 1.25rem',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(0, 188, 212, 0.2))',
                                    border: '1px solid var(--primary)',
                                    color: 'var(--text-primary)',
                                    padding: '0.625rem 1.5rem',
                                    borderRadius: '24px',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    minWidth: '220px',
                                    textAlign: 'center'
                                }}>
                                    {examine.firstName} {examine.lastName}
                                </div>

                                <button
                                    className='btn-primary'
                                    style={{
                                        height: '44px',
                                        padding: '0 1.75rem',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, var(--primary), hsl(250, 100%, 60%))',
                                        boxShadow: '0 4px 12px var(--primary-glow)'
                                    }}
                                    onClick={() => fonction(examine.id)}
                                >
                                    Ajouter
                                </button>
                            </div>
                        ))
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem 2rem',
                            color: 'var(--text-muted)'
                        }}>
                            <p style={{ fontSize: '1.125rem', color: 'var(--error)' }}>
                                Aucun examiné disponible
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ListeExaminesPasDansGroupe;
