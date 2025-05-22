'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function EditarPerfil() {
  const [avatar, setAvatar] = useState<string>(''); 
  const [fileName, setFileName] = useState<string>(''); 
  const [name, setName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:8000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Não autenticado');
        return res.json();
      })
      .then(data => {
        setAvatar(data.image ?? '');
        setName(data.name);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    await fetch('http://localhost:8000/api/auth/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, image: avatar }),
    });

    router.push('/perfil');
  };

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start">
          <div className="w-1/2">
            <h2 className="text-3xl font-semibold mb-6">Editar Perfil</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Inserir avatar</label>
              <input
                type="text"
                value={fileName}
                readOnly
                placeholder="Nenhum arquivo selecionado"
                className="w-full border px-3 py-2 rounded mb-2"
              />
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                id="avatar-input"
                className="hidden"
              />
              <label
                htmlFor="avatar-input"
                className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer inline-block"
              >
                Selecionar
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            {avatar && (
              <Image
                src={avatar || '/images/user.png'}
                alt="Avatar"
                width={180}
                height={180}
                className="rounded-md object-cover"
              />
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => router.back()}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
