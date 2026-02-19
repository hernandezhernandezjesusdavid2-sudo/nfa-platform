import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const res = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Algo salió mal');

            if (isLogin) {
                login(data.user, data.token);
            } else {
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex align-center justify-center" style={{ minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
                    {isLogin ? 'Iniciar Sesión' : 'Registro'}
                </h2>
                {error && <p style={{ color: 'var(--danger)', marginBottom: '10px' }}>{error}</p>}
                <form onSubmit={handleSubmit} className="flex" style={{ flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="card"
                        style={{ padding: '12px', background: 'rgba(255,255,255,0.05)' }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="card"
                        style={{ padding: '12px', background: 'rgba(255,255,255,0.05)' }}
                        required
                    />
                    <button type="submit" className="primary">
                        {isLogin ? 'Entrar' : 'Registrarse'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', color: 'var(--primary)', marginTop: '10px' }}
                    >
                        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Ingresa'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
