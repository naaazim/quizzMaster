import { useState, useEffect, useRef } from "react";

function CreationGroupe({ fonction1, fonction2 }) {
    const [titre, setTitre] = useState("");
    const modalRef = useRef(null);

    // Fermeture de la modale au clic à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                fonction1();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [fonction1]);

    return (
        <>
            {/* Modal */}
            <div
                ref={modalRef}
                className='position-fixed top-50 start-50 translate-middle'
                style={{
                    width: '100%', // Largeur totale demandée
                    maxWidth: 'none', // Pas de limite max pour prendre toute la largeur
                    zIndex: 9999,
                    background: 'linear-gradient(135deg, hsl(230, 15%, 18%), hsl(230, 15%, 12%))',
                    border: '2px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2.5rem',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)' // Ombre plus marquée car pas de flou
                }}
            >
                <button
                    className='position-absolute top-0 end-0 btn-close m-2'
                    aria-label='Close'
                    onClick={() => fonction1()}
                />

                <h3 className='text-center mb-4' style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, var(--primary), hsl(250,100%,60%))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center' // Centré explicitement
                }}>
                    Créer un groupe
                </h3>

                <form onSubmit={(e) => { e.preventDefault(); fonction2(titre); }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}>
                        <div style={{ width: '100%' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                marginBottom: '0.75rem',
                                textAlign: 'left', // Aligné à gauche
                                letterSpacing: '0.3px'
                            }}>
                                Nom du groupe
                            </label>
                            <div style={{
                                display: 'flex',
                                gap: '1.5rem',
                                alignItems: 'center'
                            }}>
                                <input
                                    type='text'
                                    id='titre'
                                    className='input-primary'
                                    required
                                    placeholder='Exemple : 5èmeA'
                                    style={{
                                        height: '48px',
                                        fontSize: '1rem',
                                        flex: 1,
                                        padding: '0 1rem',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '2px solid var(--primary)',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'var(--text-primary)'
                                    }}
                                    onChange={(event) => setTitre(event.target.value)}
                                />

                                <button
                                    type='submit'
                                    className='btn-primary'
                                    style={{
                                        height: '48px',
                                        padding: '0 2.5rem',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        background: 'linear-gradient(135deg, var(--primary), hsl(250, 100%, 60%))',
                                        boxShadow: '0 4px 16px var(--primary-glow)'
                                    }}
                                >
                                    Créer le groupe
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreationGroupe;
