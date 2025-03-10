export const BLOG_CATEGORIES: {
  title: string;
  slug: "news" | "education";
  description: string;
}[] = [
  {
    title: "News",
    slug: "news",
    description: "Atualizações e anúncios do FinControl.",
  },
  {
    title: "Education",
    slug: "education",
    description: "Conteúdos educacionais sobre o FinControl.",
  },
];

export const BLOG_AUTHORS = {
  dreeilima: {
    name: "Andrei Lima",
    image: "/_static/avatars/dreeilima.png",
    twitter: "dreeilima",
  },
  shadcn: {
    name: "shadcn",
    image: "/_static/avatars/shadcn.jpeg",
    twitter: "shadcn",
  },
};
