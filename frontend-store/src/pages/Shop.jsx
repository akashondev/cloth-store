import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import ProductGrid from "../components/ProductGrid";
import ProductGridSkeleton from "../components/ProductGridSkeleton";

export default function Shop() {
  const [products, setProducts] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState("");
  const [query, setQuery] = useState(""), [category, setCategory] = useState("all"), [sort, setSort] = useState("featured");
  useEffect(() => { fetch(`${process.env.REACT_APP_API_URL}/products`).then(async (res) => { const data = await res.json(); if (!res.ok) throw new Error(data.error || "Could not load the shop"); setProducts(Array.isArray(data) ? data : data.data || []); }).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);
  const categories = useMemo(() => ["all", ...new Set(products.map((p) => p.category).filter(Boolean))], [products]);
  const results = useMemo(() => {
    const filtered = products.filter((p) => (category === "all" || p.category === category) && `${p.title} ${p.description || ""}`.toLowerCase().includes(query.toLowerCase()));
    return [...filtered].sort((a,b) => sort === "low" ? Number(a.price)-Number(b.price) : sort === "high" ? Number(b.price)-Number(a.price) : sort === "title" ? String(a.title).localeCompare(String(b.title)) : 0);
  }, [products, query, category, sort]);
  return <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .25 }} className="min-h-screen bg-zinc-50">
    <section className="bg-black text-white"><div className="mx-auto max-w-7xl px-5 py-14 lg:px-8"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-teal-400"><Sparkles size={15}/>The current edit</p><h1 className="mt-4 text-4xl font-bold md:text-6xl">Shop Styllin</h1><p className="mt-4 max-w-xl leading-7 text-white/65">Everyday pieces with a clean point of view—easy to wear, simple to combine, made to stay in rotation.</p></div></section>
    <section className="sticky top-16 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur"><div className="mx-auto grid max-w-7xl gap-3 px-5 py-4 md:grid-cols-[1fr_auto_auto] lg:px-8"><label className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search products" className="h-11 w-full rounded-lg border border-zinc-300 pl-10 pr-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"/></label><select aria-label="Filter category" value={category} onChange={(e)=>setCategory(e.target.value)} className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm">{categories.map((item)=><option value={item} key={item}>{item === "all" ? "All categories" : item}</option>)}</select><select aria-label="Sort products" value={sort} onChange={(e)=>setSort(e.target.value)} className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="title">Title: A–Z</option></select></div></section>
    <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8"><p className="text-sm text-zinc-500"><strong className="text-zinc-950">{results.length}</strong> pieces</p></div>
    {loading ? <ProductGridSkeleton/> : error ? <div className="mx-auto max-w-7xl px-5 py-20 text-center text-red-600">{error}</div> : results.length ? <ProductGrid products={results}/> : <div className="mx-auto max-w-7xl px-5 py-20 text-center"><h2 className="text-2xl font-bold">No pieces found</h2><p className="mt-2 text-zinc-500">Try another search or category.</p></div>}
  </motion.main>;
}
