'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, setToken } from '@/lib/auth';
import StatusBox from '@/components/StatusBox';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [backendMessage, setBackendMessage] = useState('');

  // 🔹 Verificar conexión al backend
  useEffect(() => {
    fetch(`${API}/`)
      .then(res => res.text())
      .then(data => {
        setBackendMessage(data);
      })
      .catch(() => {
        setBackendMessage('❌ Error conectando al backend');
      });
  }, []);

  // 🔹 Si ya hay token, redirigir
  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace('/productos');
    }
  }, [router]);

  const login = async (ev) => {
    ev.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || 'Credenciales incorrectas');
        return;
      }

      setToken(data.token);
      setSuccess('✅ Login correcto');
      
      setTimeout(() => {
        router.replace('/productos');
        router.refresh();
      }, 800);

    } catch (err) {
      setError('❌ Error de red / API no disponible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Manager Login</h1>

      {/* 🔹 Mensaje de conexión backend */}
      <div className="mb-4 text-sm text-gray-600">
        Estado backend: {backendMessage || 'Conectando...'}
      </div>

      <form onSubmit={login} className="space-y-3">
        <Input
          value={email}
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <Input
          value={password}
          placeholder="Password"
          type="password"
          onChange={e => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          alt="Entrar"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="mt-4">
        <StatusBox loading={loading} error={error} success={success} />
      </div>
    </main>
  );
}