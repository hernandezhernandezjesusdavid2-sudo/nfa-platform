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
      <nav className="card flex justify-between align-center" style={{ margin: '10px', borderRadius: '12px', padding: '15px 30px', position: 'sticky', top: '10px', zIndex: 100 }}>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setView('home')}>NFA Platform</h1>
        <div className="flex gap-4 align-center">
          <button onClick={() => setView('simulator')} style={{ background: 'var(--glass)', fontSize: '0.8rem' }}>Simulador</button>
          <button onClick={() => setView('converter')} style={{ background: 'var(--glass)', fontSize: '0.8rem' }}>Conversor</button>
          <div className="flex align-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 15px', borderRadius: '20px' }}>
            <div style={{ width: '100px', height: '8px', background: 'var(--glass)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.5s' }}></div>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>{progressPercent}%</span>
          </div>
          {progressPercent === 100 ? (
            <button onClick={() => setView('final-exam')} style={{ background: 'var(--accent)', color: 'white', fontSize: '0.8rem', animation: 'pulse 2s infinite' }}>Examen Final</button>
          ) : (
            <button disabled style={{ background: 'var(--gray)', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', cursor: 'not-allowed' }}>Final Bloqueado</button>
          )}
          <button onClick={logout} style={{ padding: '5px 15px', fontSize: '0.8rem', background: 'var(--danger)', color: 'white' }}>Salir</button>
        </div>
      </nav>

      <main className="container">
        {view === 'home' && (
          <div style={{ padding: '40px 0' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Domina los <span style={{ color: 'var(--primary)' }}>AFND</span></h1>
              <p style={{ color: 'var(--gray)', fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto' }}>Aprende teoría de la computación con contenido académico profundo, simuladores interactivos y certificación oficial.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
              {modules.map(m => (
                <div key={m.id} className="card" style={{ transition: 'all 0.3s', position: 'relative', border: m.completed ? '1px solid var(--accent)' : '1px solid var(--glass-border)' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div className="flex justify-between align-center" style={{ marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase' }}>Módulo {m.id}</span>
                    {m.completed && <span style={{ background: 'var(--accent)', color: 'white', padding: '2px 10px', borderRadius: '4px', fontSize: '0.7rem' }}>Completado</span>}
                  </div>
                  <h3 style={{ marginBottom: '10px', fontSize: '1.4rem' }}>{m.title}</h3>
                  <p style={{ color: 'var(--gray)', fontSize: '0.95rem', marginBottom: '25px', lineHeight: '1.6' }}>{m.description}</p>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ height: '4px', background: 'var(--glass)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: m.completed ? '100%' : '0%', height: '100%', background: m.completed ? 'var(--accent)' : 'var(--primary)' }}></div>
                    </div>
                  </div>

                  <button className={m.completed ? 'primary' : 'primary'} style={{ width: '100%', padding: '12px' }} onClick={() => setView(`module-${m.id}`)}>
                    {m.completed ? 'Repasar Lección' : 'Comenzar Módulo'}
                  </button>
                </div>
              ))}
            </div>

            <footer className="card" style={{ marginTop: '80px', textAlign: 'center', padding: '40px' }}>
              <h3 style={{ marginBottom: '30px', fontSize: '1.8rem' }}>Referencias Bibliográficas Obligatorias</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', textAlign: 'left' }}>
                <div>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>HMU (2006)</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Hopcroft, Motwani & Ullman - Introduction to Automata Theory, Languages, and Computation.</p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Michael Sipser</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Introduction to the Theory of Computation (3rd Edition). Cengage Learning.</p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Stanford CS103</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Mathematical Foundations of Computing - Subset Construction Resources.</p>
                </div>
              </div>
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

        {view === 'simulator' && <div style={{ marginTop: '20px' }}><NFASimulator /></div>}
        {view === 'converter' && <div style={{ marginTop: '20px' }}><NFAToDFAConverter /></div>}
        {view === 'final-exam' && <div style={{ marginTop: '20px' }}><Exam examType="FINAL" userId={user?.id} onComplete={() => setView('home')} /></div>}
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}} />
    </div>
  );
};

export default App;
