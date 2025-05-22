'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: number;
  sub: number;
}

export default function NewArticlePage() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [fileName, setFileName] = useState('');
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setTitle('');
    setImage('');
    setContent('');
    setImagePreview('');
    setFileName('');
  };

  const handleCancel = () => {
    clearForm();
    router.push('/');
  };

  const handleSave = async () => {
    if (!title || !content) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Você precisa estar logado para criar um artigo.');
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log(decoded);
      userId = decoded.sub;
    } catch (err) {
      toast.error('Token inválido.');
      console.log(err);
      return;
    }

    console.log('UserId decoded:', userId);

    const article = {
      title,
      content,
      image,
      authorId: Number(userId),
    };

    try {
      const res = await fetch('http://localhost:8000/articles/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(article),
      });

      if (res.ok) {
        toast.success('Artigo criado com sucesso!');
        clearForm();
        router.push('/');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erro ao criar o artigo.');
      }
    } catch (error) {
      toast.error('Erro de conexão com o servidor.');
      console.log(error);
    }
  };

  return (
    <main className="bg-white text-black min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6">Novo Artigo</h1>

        <div className="mb-6">
          <label className="block font-medium mb-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Adicione um título"
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1">
            <label className="block font-medium mb-1">Inserir imagem</label>
            <div className="flex items-center gap-4">
              <div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                  Escolher imagem
                </label>
              </div>
              {fileName && <span className="text-sm text-gray-600">{fileName}</span>}
            </div>
          </div>

          {imagePreview && (
            <div className="w-60 border rounded flex items-center justify-center bg-gray-100 ml-auto">
              <Image
                src={imagePreview}
                alt="Prévia da imagem"
                width={240}
                height={160}
                className="object-cover rounded"
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-1">Texto</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Escreva seu artigo"
            className="w-full border rounded p-2 h-64"
          />
        </div>

        <div className="flex gap-4">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Salvar
          </button>
        </div>
      </div>
    </main>
  );
}
