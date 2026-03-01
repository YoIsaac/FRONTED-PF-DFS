'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import StatusBox from '@/components/StatusBox';
import { useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function NuevaTaskPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [due_date, setDueDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function validar() {
    if (!title.trim()) return 'Título requerido';
    return '';
  }

  const crear = async (ev) => {
    ev.preventDefault();
    setError('');
    setSuccess('');

    const v = validar();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description,
          status,
          priority,
          due_date: due_date || null
        })
      });

      setSuccess('Tarea creada correctamente');
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setDueDate('');

      router.refresh();

    } catch (error) {
      if (error.status === 403) {
        setError('No autorizado, necesitas rol de admin');
        return;
      }
      if (error.status === 401) {
        clearToken();
        router.replace('/login');
        return;
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nueva Tarea</h1>

      <form onSubmit={crear} className="space-y-3">
        <Input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
        <Input placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} />
        <Input placeholder="Status (pending/completed)" value={status} onChange={e => setStatus(e.target.value)} />
        <Input placeholder="Prioridad (low/medium/high)" value={priority} onChange={e => setPriority(e.target.value)} />
        <Input placeholder="Fecha límite YYYY-MM-DD" value={due_date} onChange={e => setDueDate(e.target.value)} />

        <Button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Tarea'}
        </Button>
      </form>

      <StatusBox loading={loading} error={error} success={success} />
    </main>
  );
}