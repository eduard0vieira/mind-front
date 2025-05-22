'use client';

import { useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import AuthLayout from '@/components/AuthLayout';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    const res = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || 'Erro ao registrar');
      return;
    }

     if (res.ok) {
      toast.success('Sucesso ao Registrar!');

      setTimeout(() => {
        toast.success('Por favor, faça o login');
        localStorage.setItem('token', data.token);
      }, 1500) 
      setTimeout(() => {
        router.push('/login');
      }, 4000);
      return;
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6 text-center">Registrar</h1>

        <Input
          label="Nome:"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          required
        />
        <Input
          label="Email:"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@email.com"
          required
        />
        <Input
          label="Senha:"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="*****"
          required
        />
        <Input
          label="Confirmar Senha:"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="*****"
          required
        />

        <Button type="submit">Criar conta</Button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Já tem cadastro?{' '}
          <a href="/login" className="underline">
            Clique aqui
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
