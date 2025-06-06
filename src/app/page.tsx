'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
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

export default function Home() {
  const [featured, setFeatured] = useState<Article | null>(null);
  const [news, setNews] = useState<Article[]>([]);
  const [highlights, setHighlights] = useState<Article[]>([]);

useEffect(() => {
  async function fetchData() {
    try {
      const res = await fetch('http://localhost:8000/articles/get');
      if (!res.ok) throw new Error('Falha ao buscar artigos');

      const data: RawArticle[] = await res.json();
      if (data.length === 0) return;

      const first = data[0];
      setFeatured({
        id: first.id,
        title: first.title,
        subtitle: undefined,
        date: new Date(first.createdAt).toLocaleDateString(),
        author: first.author.name,
        image: first.image ?? '/images/user.png',
      });

      setNews(
        data.slice(1, 4).map((a) => ({
          id: a.id,
          title: a.title,
          subtitle: a.content.slice(0, 60) + '...',
          date: new Date(a.createdAt).toLocaleDateString(),
          author: a.author.name,
          image: a.image ?? '/images/user.png',
        }))
      );

      setHighlights(
        data.slice(4, 7).map((a) => ({
          id: a.id,
          title: a.title,
          subtitle: undefined,
          date: new Date(a.createdAt).toLocaleDateString(),
          author: a.author.name,
          image: a.image ?? '/images/user.png',
        }))
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Erro ao carregar artigos');
      }
    }
  }

  fetchData();
}, []);


return (
  <main className="bg-white text-black min-h-screen">
    <Navbar />

    <section className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        {featured && (
          <div>
            <Image
              src={featured.image}
              alt={featured.title}
              width={800}
              height={450}
              className="w-full h-auto object-cover rounded-md"
            />
            <h1 className="text-2xl font-bold mt-4">{featured.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Por {featured.author} — {featured.date}
            </p>
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
              Ler Mais
            </button>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-1/3 bg-black text-white p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-4">New</h2>
        <ul className="space-y-4">
          {news.map(article => (
            <li key={article.id}>
              <h3 className="font-bold">{article.title}</h3>
              <p className="text-sm text-gray-300">{article.subtitle}</p>
            </li>
          ))}
        </ul>
      </aside>
    </section>

    <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
      {highlights.map((item, idx) => (
        <div key={item.id}>
          <Image
            src={item.image}
            alt={item.title}
            width={400}
            height={200}
            className="w-full h-auto object-cover rounded-md"
          />
          <h2 className="text-5xl font-bold mt-4">
            {String(idx + 1).padStart(2, '0')}
          </h2>
          <p className="font-semibold mt-2">{item.title}</p>
          <p className="text-sm text-gray-600">{item.date}</p>
        </div>
      ))}
    </section>
  </main>
);
}
