import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";

const stories = [
  {
    title: "The five-piece weekday wardrobe",
    category: "Wardrobe notes",
    time: "4 min read",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=85",
    copy: "Build more outfits with fewer decisions: one strong layer, two reliable shirts, and trousers that work across the week.",
  },
  {
    title: "How to make relaxed tailoring feel natural",
    category: "How to wear",
    time: "5 min read",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=85",
    copy: "Balance structure with softer fabrics, clean sneakers, and uncomplicated layers.",
  },
  {
    title: "A practical guide to better denim",
    category: "Fabric guide",
    time: "3 min read",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85",
    copy: "Fit, weight, wash, and the small details that help denim earn a permanent place in your rotation.",
  },
  {
    title: "Three ways to refresh familiar basics",
    category: "Style edit",
    time: "4 min read",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85",
    copy: "Change proportion, add one considered color, and let texture do more of the work.",
  },
];
const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.35 },
};

export default function Blog() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-zinc-50"
    >
      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-teal-400">
            <BookOpen size={16} />
            Styllin journal
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Useful ideas for a wardrobe that works harder.
          </h1>
          <p className="mt-5 max-w-xl leading-7 text-white/65">
            Style guidance, fabric notes, and simple ways to get more from the
            pieces you already own.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <motion.article
          {...reveal}
          className="group grid overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm lg:grid-cols-[1.35fr_1fr]"
        >
          <div className="min-h-80 overflow-hidden">
            <img
              src={stories[0].image}
              alt="Curated clothing rail"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-col justify-center p-7 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-600">
              Featured · {stories[0].category}
            </p>
            <h2 className="mt-4 text-3xl font-bold text-zinc-950 md:text-4xl">
              {stories[0].title}
            </h2>
            <p className="mt-4 leading-7 text-zinc-600">{stories[0].copy}</p>
            <p className="mt-6 flex items-center gap-2 text-sm text-zinc-500">
              <Clock3 size={16} />
              {stories[0].time}
            </p>
          </div>
        </motion.article>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-600">
            More from the journal
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Considered, not complicated.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {stories.slice(1).map((story, i) => (
            <motion.article
              key={story.title}
              {...reveal}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={story.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  {story.category}
                </p>
                <h3 className="mt-3 text-xl font-bold">{story.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {story.copy}
                </p>
                <p className="mt-5 flex items-center gap-2 text-xs text-zinc-500">
                  <Clock3 size={14} />
                  {story.time}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </motion.main>
  );
}
