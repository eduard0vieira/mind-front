'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  subtitle: string;
  date: string;
  author: string;
  image: string;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('http://localhost:8000/articles/get');
        if (!res.ok) throw new Error('Erro ao buscar artigos');

        const data: RawArticle[] = await res.json();
        const mapped: Article[] = data.map(a => ({
          id: a.id,
          title: a.title,
          subtitle: a.content.slice(0, 100) + '...',
          date: new Date(a.createdAt).toLocaleDateString(),
          author: a.author.name,
          image: a.image ?? '/images/user.png',
        }));

        setArticles(mapped);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
          toast.error(err.message || 'Erro ao carregar artigos');
        } else {
          toast.error('Erro ao carregar artigos');
        }
      }
    }

    fetchArticles();
  }, []);

  return (
    <main className="bg-white text-black min-h-screen">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Todos os Artigos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <div key={article.id} className="border rounded-md p-4 shadow-sm hover:shadow-md transition">
              <Image
                src={article.image}
                alt={article.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-xl font-semibold mt-4">{article.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Por {article.author} — {article.date}
              </p>
              <p className="mt-2 text-gray-700">{article.subtitle}</p>
              <Link
                href={`/articles/${article.id}`}
                className="inline-block mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Ler Mais
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
