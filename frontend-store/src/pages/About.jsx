import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const values = [
  {
    icon: Layers3,
    title: "Useful by design",
    copy: "Pieces selected for repeat wear, easy combinations, and real everyday routines.",
  },
  {
    icon: Sparkles,
    title: "A clear point of view",
    copy: "Modern silhouettes and thoughtful details without noise or unnecessary complication.",
  },
  {
    icon: ShieldCheck,
    title: "Confidence in every order",
    copy: "Transparent totals, secure checkout, and clear delivery updates from cart to door.",
  },
];

export default function About() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-zinc-50"
    >
      <section className="overflow-hidden bg-black text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-teal-400">
              About Styllin
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
              Style should make everyday life feel easier.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/65">
              Styllin is a focused online wardrobe destination: modern pieces,
              clear presentation, and a shopping experience built around
              confidence rather than clutter.
            </p>
            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#0D9488] px-5 py-3 font-semibold text-white"
            >
              Explore the shop
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=85"
              alt="Curated modern clothing"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/15" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-3"
        >
          {values.map(({ icon: Icon, title, copy }) => (
            <motion.article
              whileHover={{ y: -4 }}
              key={title}
              className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-50 text-teal-700">
                <Icon size={22} />
              </div>
              <h2 className="mt-5 text-xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{copy}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=85"
              alt="Modern fashion store interior"
              className="h-full w-full object-cover"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-600">
              How we think
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              A smaller, stronger wardrobe.
            </h2>
            <p className="mt-5 leading-8 text-zinc-600">
              We present products with the information that matters: shape,
              price, and how each piece can fit into daily life. The goal is not
              endless choice—it is finding reliable pieces with less friction.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-zinc-50 p-4">
                <p className="text-2xl font-bold text-teal-700">Clear</p>
                <p className="mt-1 text-sm text-zinc-500">
                  product presentation
                </p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4">
                <p className="text-2xl font-bold text-teal-700">Secure</p>
                <p className="mt-1 text-sm text-zinc-500">
                  account and checkout flow
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
    </motion.main>
  );
}