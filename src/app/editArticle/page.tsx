'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: number;
}

interface RawArticle {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  author: { name: string };
  createdAt: string;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params?.id;

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (!articleId) return;
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Você precisa estar logado.');
      router.push('/');
      return;
    }

    fetch(`http://localhost:8000/articles/${articleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar artigo');
        return res.json() as Promise<RawArticle>;
      })
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
        if (data.image) {
          setImage(data.image);
          setImagePreview(data.image);
        }
      })
      .catch(err => {
        console.error(err);
        toast.error(err.message);
        router.push('/');
      })
  }, [articleId, router]);

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

  const handleCancel = () => {
    router.push('/');
  };

  const handleSave = async () => {
    if (!title || !content) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Você precisa estar logado para editar um artigo.');
      return;
    }

    let userId: number;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      userId = decoded.sub;
      console.log(userId);
    } catch (err) {
      toast.error('Token inválido.');
      console.error(err);
      return;
    }
    const payload: Record<string, string> = { title, content };
    if (image) payload.image = image;

    try {
      const res = await fetch(`http://localhost:8000/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Artigo atualizado com sucesso!');
        router.push('/');
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao atualizar artigo.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Algo deu errado...');
    }
  };

  return (
    <main className="bg-white text-black min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6">Editar Artigo</h1>

        {/* Título */}
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

        {/* Imagem */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1">
            <label className="block font-medium mb-1">Imagem</label>
            <div className="flex items-center gap-4">
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              >
                Escolher imagem
              </label>
              {fileName && (
                <span className="text-sm text-gray-600">{fileName}</span>
              )}
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
            Salvar Alterações
          </button>
        </div>
      </div>
    </main>
  );
}
