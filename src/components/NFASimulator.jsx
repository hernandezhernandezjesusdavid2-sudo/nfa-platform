import React, { useState, useEffect } from 'react';

const NFASimulator = () => {
    const [states, setStates] = useState('q0,f1');
    const [alphabet, setAlphabet] = useState('0,1');
    const [transitions, setTransitions] = useState('q0,0,q0\nq0,1,q0\nq0,1,f1');
    const [initialState, setInitialState] = useState('q0');
    const [acceptStates, setAcceptStates] = useState('f1');
    const [inputString, setInputString] = useState('0101');

    const [activeStates, setActiveStates] = useState([]);
    const [step, setStep] = useState(0);
    const [history, setHistory] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    const parseNFA = () => {
        const transMap = {};
        transitions.split('\n').forEach(line => {
            const [from, symbol, to] = line.split(',').map(s => s.trim());
            if (!from || !symbol || !to) return;
            if (!transMap[from]) transMap[from] = {};
            if (!transMap[from][symbol]) transMap[from][symbol] = [];
            transMap[from][symbol].push(to);
        });
        return transMap;
    };

    const resetSimulation = () => {
        setActiveStates([initialState]);
        setStep(0);
        setHistory([{ states: [initialState], symbol: 'Start' }]);
        setIsRunning(false);
    };

    const nextStep = () => {
        if (step >= inputString.length) return;

        const symbol = inputString[step];
        const transMap = parseNFA();
        const nextStates = new Set();

        activeStates.forEach(s => {
            if (transMap[s] && transMap[s][symbol]) {
                transMap[s][symbol].forEach(ns => nextStates.add(ns));
            }
        });

        const newActive = Array.from(nextStates);
        setActiveStates(newActive);
        setStep(step + 1);
        setHistory([...history, { states: newActive, symbol }]);
    };

    return (
        <div className="card">
            <h2 style={{ marginBottom: '20px', color: 'var(--primary)' }}>Simulador de AFND</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div className="flex" style={{ flexDirection: 'column', gap: '10px' }}>
                    <label>Estados (separados por coma)</label>
                    <input className="card" value={states} onChange={e => setStates(e.target.value)} style={{ padding: '8px' }} />

                    <label>Transiciones (de,símbolo,a - una por línea)</label>
                    <textarea className="card" value={transitions} onChange={e => setTransitions(e.target.value)} style={{ padding: '8px', minHeight: '100px' }} />
                </div>

                <div className="flex" style={{ flexDirection: 'column', gap: '10px' }}>
                    <label>Estado Inicial</label>
                    <input className="card" value={initialState} onChange={e => setInitialState(e.target.value)} style={{ padding: '8px' }} />

                    <label>Estados de Aceptación</label>
                    <input className="card" value={acceptStates} onChange={e => setAcceptStates(e.target.value)} style={{ padding: '8px' }} />

                    <label>Cadena de Entrada</label>
                    <input className="card" value={inputString} onChange={e => setInputString(e.target.value)} style={{ padding: '8px' }} />
                </div>
            </div>

            <div className="flex gap-4" style={{ marginBottom: '30px' }}>
                <button className="primary" onClick={resetSimulation}>Reiniciar</button>
                <button
                    className="primary"
                    onClick={nextStep}
                    disabled={step >= inputString.length || activeStates.length === 0}
                    style={{ opacity: (step >= inputString.length || activeStates.length === 0) ? 0.5 : 1 }}
                >
                    Siguiente Paso
                </button>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <h3>Estado de la Simulación</h3>
                <p style={{ margin: '10px 0' }}>Símbolos procesados: {inputString.slice(0, step)}</p>
                <div className="flex gap-2 align-center">
                    <span>Estados Activos: </span>
                    {activeStates.length > 0 ? (
                        activeStates.map(s => (
                            <span key={s} style={{
                                background: acceptStates.split(',').map(ss => ss.trim()).includes(s) && step === inputString.length ? 'var(--accent)' : 'var(--primary)',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '0.8rem'
                            }}>{s}</span>
                        ))
                    ) : (
                        <span style={{ color: 'var(--danger)' }}>{step === 0 ? 'Esperando inicio' : 'Atascado (No hay transiciones posibles)'}</span>
                    )}
                </div>
                {step === inputString.length && (
                    <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', textAlign: 'center', background: activeStates.some(s => acceptStates.split(',').map(ss => ss.trim()).includes(s)) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }}>
                        {activeStates.some(s => acceptStates.split(',').map(ss => ss.trim()).includes(s))
                            ? '✅ CADENA ACEPTADA'
                            : '❌ CADENA RECHAZADA'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NFASimulator;
