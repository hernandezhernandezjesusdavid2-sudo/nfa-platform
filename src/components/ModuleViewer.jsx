import React, { useState, useEffect } from 'react';

const ModuleViewer = ({ moduleId, onBack, userId }) => {
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchModule();
    }, [moduleId]);

    const fetchModule = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/modules/${moduleId}`);
            const data = await res.json();
            setModule(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const markComplete = async () => {
        try {
            await fetch(`http://localhost:5000/api/modules/${moduleId}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            onBack();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="container">Cargando...</div>;

    return (
        <div className="container">
            <button onClick={onBack} style={{ marginBottom: '20px', background: 'var(--glass)', color: 'white' }}>← Volver</button>
            <div className="card">
                <h1 style={{ marginBottom: '30px', color: 'var(--primary)' }}>{module.title}</h1>
                <div className="flex" style={{ flexDirection: 'column', gap: '20px' }}>
                    {module.content.map((item, index) => (
                        <div key={index} style={{
                            padding: item.type === 'important' ? '20px' : '0',
                            background: item.type === 'important' ? 'rgba(99, 102, 241, 0.1)' : 'none',
                            borderLeft: item.type === 'important' ? '4px solid var(--primary)' : 'none',
                            borderRadius: '8px'
                        }}>
                            {item.type === 'text' && <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{item.value}</p>}
                            {item.type === 'important' && <p style={{ fontWeight: '600', color: 'var(--primary)' }}>{item.value}</p>}
                            {item.type === 'list' && (
                                <ul style={{ paddingLeft: '20px' }}>
                                    {item.items.map((li, i) => <li key={i} style={{ marginBottom: '10px' }}>{li}</li>)}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    className="primary"
                    style={{ marginTop: '40px', width: '100%', padding: '15px' }}
                    onClick={markComplete}
                >
                    Finalizar Módulo y Volver al Listado
                </button>
            </div>
        </div>
    );
};

export default ModuleViewer;
