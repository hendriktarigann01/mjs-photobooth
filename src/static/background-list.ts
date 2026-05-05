export type BackgroundOption = {
  id: number;
  name: string;
  /** URL gambar background (relatif ke /public) */
  url: string;
  /** URL thumbnail kecil untuk preview (bisa sama dengan url) */
  thumbnail: string;
};

export const backgrounds: BackgroundOption[] = [
  {
    id: 1,
    name: "Cafe & Lounge",
    url: "/static/background/bg-1.webp",
    thumbnail: "/static/background/bg-1.webp",
  },
  {
    id: 2,
    name: "Modern Office",
    url: "/static/background/bg-2.webp",
    thumbnail: "/static/background/bg-2.webp",
  },
  {
    id: 3,
    name: "Minimalist Corner",
    url: "/static/background/bg-3.webp",
    thumbnail: "/static/background/bg-3.webp",
  },
  {
    id: 4,
    name: "Cozy Living Room",
    url: "/static/background/bg-4.webp",
    thumbnail: "/static/background/bg-4.webp",
  },
  {
    id: 5,
    name: "Clean Workspace",
    url: "/static/background/bg-5.webp",
    thumbnail: "/static/background/bg-5.webp",
  },
  {
    id: 6,
    name: "Bookshelf Library",
    url: "/static/background/bg-6.webp",
    thumbnail: "/static/background/bg-6.webp",
  },
];
