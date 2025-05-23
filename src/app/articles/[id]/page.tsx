'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../../../components/Navbar';
import toast from 'react-hot-toast';

type RawArticle = {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  author: { name: string };
  createdAt: string;
};

export default function ArticlePage() {
  const params = useParams();
  const id = params?.id as string;

  console.log(id);
  
  const [article, setArticle] = useState<RawArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Token não encontrado. Faça login novamente.');
          return;
        }

        const res = await fetch(`http://localhost:8000/articles/:${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Não autorizado. Faça login novamente.');
          }
          throw new Error('Erro ao buscar o artigo');
        }

        const data: RawArticle = await res.json();
        setArticle(data);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
          console.error(err);
        } else {
          toast.error('Erro inesperado ao carregar o artigo');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Artigo não encontrado.</p>
      </main>
    );
  }

  return (
    <main className="bg-white text-black min-h-screen">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

        <p className="text-sm text-gray-500 mb-6">
          Por {article.author.name} — {new Date(article.createdAt).toLocaleDateString('pt-BR')}
        </p>

        {article.image && (
          <Image
            src={article.image}
            alt={article.title}
            width={800}
            height={400}
            className="rounded-md object-cover mb-8"
          />
        )}

        <article className="prose prose-lg max-w-none">
          {article.content.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </article>
      </section>
    </main>
  );
}
