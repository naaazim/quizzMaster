import React from 'react';

function ListeExaminesQuiPassent({ examines, fonction }) {
    return (
        <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '2rem'
        }}>
            <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '2rem',
                textAlign: 'center'
            }}>
                Examinés inscrits à cet examen
            </h2>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                {examines.length > 0 ? (
                    examines.map((examine, index) => (
                        <div
                            key={examine.id || index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'var(--surface)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '1.25rem 1.5rem',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateX(4px)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateX(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(0, 188, 212, 0.25))',
                                border: '1.5px solid var(--primary)',
                                color: 'var(--text-primary)',
                                padding: '0.75rem 1.75rem',
                                borderRadius: '32px',
                                fontWeight: 700,
                                fontSize: '1rem',
                                textAlign: 'center',
                                minWidth: '280px'
                            }}>
                                {examine.appUser?.firstName} {examine.appUser?.lastName}
                            </div>

                            <button
                                className='btn-danger'
                                style={{
                                    height: '44px',
                                    padding: '0 1.75rem',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                                }}
                                onClick={() => fonction(examine.appUser?.id)}
                            >
                                Retirer
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        color: 'var(--text-muted)'
                    }}>
                        <p style={{ fontSize: '1.25rem', color: 'var(--error)' }}>
                            Aucun examiné inscrit
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListeExaminesQuiPassent;
