import React, { useState } from 'react';

const NFAToDFAConverter = () => {
    // Basic example NFA: accepts strings ending in '1'
    const nfa = {
        states: ['q0', 'q1'],
        alphabet: ['0', '1'],
        transitions: {
            'q0': { '0': ['q0'], '1': ['q0', 'q1'] },
            'q1': {}
        },
        initial: 'q0',
        accept: ['q1']
    };

    const [dfaStates, setDfaStates] = useState([]);
    const [transitions, setTransitions] = useState([]);
    const [currentQueue, setCurrentQueue] = useState([[nfa.initial]]);
    const [processed, setProcessed] = useState([]);

    const getEclosure = (states) => {
        // Simple NFA for now, no epsilon transitions handled in this helper yet
        // but the structure is ready
        return states.sort();
    };

    const processNext = () => {
        if (currentQueue.length === 0) return;

        const currentSubset = currentQueue[0];
        const subsetName = `{${currentSubset.join(',')}}`;

        const newEntry = { state: subsetName, results: {} };
        const nextSubsets = [];

        nfa.alphabet.forEach(symbol => {
            const reachable = new Set();
            currentSubset.forEach(s => {
                if (nfa.transitions[s] && nfa.transitions[s][symbol]) {
                    nfa.transitions[s][symbol].forEach(ns => reachable.add(ns));
                }
            });

            const targetSubset = Array.from(reachable).sort();
            const targetName = targetSubset.length > 0 ? `{${targetSubset.join(',')}}` : '∅';
            newEntry.results[symbol] = targetName;

            if (targetSubset.length > 0 && !processed.some(p => p.join(',') === targetSubset.join(',')) && !currentQueue.some(q => q.join(',') === targetSubset.join(','))) {
                nextSubsets.push(targetSubset);
            }
        });

        setProcessed([...processed, currentSubset]);
        setDfaStates([...dfaStates, newEntry]);
        setCurrentQueue([...currentQueue.slice(1), ...nextSubsets]);
    };

    const isAcceptState = (subsetStr) => {
        const states = subsetStr.replace('{', '').replace('}', '').split(',');
        return states.some(s => nfa.accept.includes(s));
    };

    return (
        <div className="card">
            <h2 style={{ marginBottom: '20px', color: 'var(--primary)' }}>Conversor AFND → AFD (Subset Construction)</h2>
            <p style={{ marginBottom: '20px', color: 'var(--gray)' }}>Algoritmo: Se basa en crear estados en el AFD que representan conjuntos de estados en el AFND.</p>

            <div className="flex gap-4" style={{ marginBottom: '30px' }}>
                <button className="primary" onClick={processNext} disabled={currentQueue.length === 0}>
                    {currentQueue.length > 0 ? `Procesar siguiente subconjunto: {${currentQueue[0].join(',')}}` : 'Conversión Finalizada'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="card" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <h3>Cola de Trabajo (Pendientes)</h3>
                    <ul style={{ marginTop: '10px' }}>
                        {currentQueue.map((q, i) => <li key={i}>{`{${q.join(',')}}`}</li>)}
                        {currentQueue.length === 0 && <li>¡Listo!</li>}
                    </ul>
                </div>

                <div className="card" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <h3>AFD Resultante (Tabla)</h3>
                    <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Estado AFD</th>
                                {nfa.alphabet.map(a => <th key={a} style={{ padding: '10px' }}>{a}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {dfaStates.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '10px', color: isAcceptState(row.state) ? 'var(--accent)' : 'inherit' }}>
                                        {row.state} {isAcceptState(row.state) && '(Final)'}
                                    </td>
                                    {nfa.alphabet.map(a => <td key={a} style={{ textAlign: 'center' }}>{row.results[a]}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NFAToDFAConverter;
