import React, { useState, useEffect } from 'react';

const Exam = ({ examId, examType, userId, onComplete }) => {
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExam();
    }, [examId, examType]);

    const fetchExam = async () => {
        try {
            const endpoint = examType ? `/api/exams/type/${examType}` : `/api/exams/${examId}`;
            const res = await fetch(`http://localhost:5000${endpoint}`);
            const data = await res.json();
            setExam(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/exams/${examId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, answers })
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Cargando examen...</div>;
    if (result) {
        return (
            <div className="card" style={{ textAlign: 'center' }}>
                <h2 style={{ color: 'var(--primary)' }}>Resultado: {result.score}%</h2>
                <p style={{ margin: '20px 0' }}>{result.score >= 80 ? '¡Felicidades! Has aprobado.' : 'No has alcanzado el puntaje mínimo (80%).'}</p>
                {result.certificate && (
                    <div className="card" style={{ border: '2px solid var(--accent)', background: 'rgba(16, 185, 129, 0.1)' }}>
                        <h3 style={{ color: 'var(--accent)' }}>Certificado Generado</h3>
                        <p>Folio: {result.certificate.folio}</p>
                    </div>
                )}
                <button className="primary" style={{ marginTop: '20px' }} onClick={onComplete}>Continuar</button>
            </div>
        );
    }

    return (
        <div className="card">
            <h2 style={{ marginBottom: '30px' }}>{exam.name}</h2>
            <div className="flex" style={{ flexDirection: 'column', gap: '30px' }}>
                {exam.questions.map((q, idx) => (
                    <div key={q.id} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
                        <p style={{ fontWeight: '600', marginBottom: '15px' }}>{idx + 1}. {q.text}</p>
                        <div className="flex" style={{ flexDirection: 'column', gap: '10px' }}>
                            {q.options.map(opt => (
                                <label key={opt} className="flex align-center gap-2" style={{ cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name={`q-${q.id}`}
                                        value={opt}
                                        checked={answers[q.id] === opt}
                                        onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <button
                className="primary"
                style={{ marginTop: '40px', width: '100%' }}
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < exam.questions.length}
            >
                Enviar Respuestas
            </button>
        </div>
    );
};

export default Exam;
