'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

type RawArticle = {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  author: { name: string };
  createdAt: string;
};

type Article = {
  id: number;
  title: string;
  subtitle?: string;
  date: string;
  author: string;
  image: string;
};

export default function MyArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserArticles() {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Você precisa estar logado para ver seus artigos.');
        return;
      }

      let userId: number | null = null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id;
      } catch (err) {
        toast.error('Token inválido.');
        console.log(err);
        return;
      }

      try {
        const res = await fetch(`http://localhost:8000/articles/all/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Falha ao buscar seus artigos');

        const data: RawArticle[] = await res.json();

        setArticles(
          data.map(a => ({
            id: a.id,
            title: a.title,
            subtitle: a.content.slice(0, 60) + (a.content.length > 60 ? '...' : ''),
            date: new Date(a.createdAt).toLocaleDateString(),
            author: a.author.name,
            image: a.image ?? '/images/user.png',
          }))
        );
      } catch (err: unknown) {

        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error('Erro ao carregar seus artigos');
        }
      }
    }

    fetchUserArticles();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/articles/edit/${id}`);
  };

  return (
    <main className="bg-white text-black min-h-screen">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Meus Artigos</h1>

        {articles.length === 0 ? (
          <p className="text-gray-600">Você ainda não publicou nenhum artigo.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <div key={article.id} className="border rounded-md p-4 flex flex-col">
                <Image
                  src={article.image}
                  alt={article.title}
                  width={400}
                  height={220}
                  className="rounded-md object-cover mb-4"
                />
                <h2 className="text-xl font-semibold">{article.title}</h2>
                <p className="text-gray-700 mt-2 flex-grow">{article.subtitle}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Por {article.author} — {article.date}
                </p>
                <button
                  onClick={() => handleEdit(article.id)}
                  className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                  Editar Artigo
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
