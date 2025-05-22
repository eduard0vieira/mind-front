'use client';

import { useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import AuthLayout from '@/components/AuthLayout';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordReset, setPasswordReset] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error('Algo deu errado, tente novamente!');
      return;
    }

    if (res.ok) {
      toast.success('Sucesso ao Logar!');

      setTimeout(() => {
        toast.success('Bem vindo!');
      }, 1500)

      setTimeout(() => {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      }, 2000);
      return;
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6 text-center">Esqueci a senha</h1>
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
          value={passwordReset}
          onChange={(e) => setPasswordReset(e.target.value)}
          placeholder="*****"
          required
        />

        <Button type="submit">Alterar</Button>

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
