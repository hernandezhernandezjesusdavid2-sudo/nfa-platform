import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import ModuleViewer from './components/ModuleViewer';
import NFASimulator from './components/NFASimulator';
import NFAToDFAConverter from './components/NFAToDFAConverter';
import Exam from './components/Exam';
import './index.css';

const App = () => {
  const { token, user, logout } = useAuth();
  const [view, setView] = useState('home');
  const [modules, setModules] = useState([]);

  useEffect(() => {
    if (token) {
      fetchModules();
    }
  }, [token, view]);

  const fetchModules = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/modules?userId=${user?.id}`);
      const data = await res.json();
      setModules(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) return <div className="container"><Auth /></div>;

  const totalModules = modules.length;
  const completedModules = modules.filter(m => m.completed).length;
  const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div>
      <nav className="card flex justify-between align-center" style={{ margin: '10px', borderRadius: '12px', padding: '15px 30px' }}>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setView('home')}>NFA Platform</h1>
        <div className="flex gap-4 align-center">
          <button onClick={() => setView('simulator')} style={{ background: 'var(--glass)', fontSize: '0.8rem' }}>Simulador</button>
          <button onClick={() => setView('converter')} style={{ background: 'var(--glass)', fontSize: '0.8rem' }}>Conversor</button>
          {progressPercent === 100 && <button onClick={() => setView('final-exam')} style={{ background: 'var(--accent)', color: 'white', fontSize: '0.8rem' }}>Examen Final</button>}
          <span style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>{user?.username} ({progressPercent}%)</span>
          <button onClick={logout} style={{ padding: '5px 15px', fontSize: '0.8rem', background: 'var(--danger)', color: 'white' }}>Salir</button>
        </div>
      </nav>

      <main className="container">
        {view === 'home' && (
          <div style={{ padding: '40px 0' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Domina los <span style={{ color: 'var(--primary)' }}>AFND</span></h1>
              <p style={{ color: 'var(--gray)', fontSize: '1.2rem' }}>Plataforma interactiva para el aprendizaje de Autómatas Finitos No Deterministas.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              {modules.map(m => (
                <div key={m.id} className="card" style={{ transition: 'transform 0.3s', position: 'relative' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  {m.completed && <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--accent)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>Completado</span>}
                  <h3 style={{ marginBottom: '10px' }}>Módulo {m.id}: {m.title}</h3>
                  <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '20px' }}>{m.description}</p>
                  <button className="primary" style={{ width: '100%' }} onClick={() => setView(`module-${m.id}`)}>
                    {m.completed ? 'Repasar' : 'Comenzar'}
                  </button>
                </div>
              ))}
            </div>

            <footer className="card" style={{ marginTop: '80px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '20px' }}>Referencias Bibliográficas</h3>
              <ul style={{ listStyle: 'none', color: 'var(--gray)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>Hopcroft, Motwani & Ullman (HMU) - <i>Introduction to Automata Theory</i></li>
                <li>Michael Sipser - <i>Introduction to the Theory of Computation</i></li>
                <li>CS103 - Stanford University (Subset Construction)</li>
              </ul>
            </footer>
          </div>
        )}

        {view.startsWith('module-') && (
          <ModuleViewer
            moduleId={view.split('-')[1]}
            onBack={() => setView('home')}
            userId={user?.id}
          />
        )}

        {view === 'simulator' && <NFASimulator />}
        {view === 'converter' && <NFAToDFAConverter />}
        {view === 'final-exam' && <Exam examId={2} userId={user?.id} onComplete={() => setView('home')} />}
      </main>
    </div>
  );
};

export default App;
