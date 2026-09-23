"use client";
import StoreHeader from "./StoreHeader";
import Link from "next/link";
import { useCart } from "./context/CartContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

import {
  Search,
  ShoppingBag,
  User,
  Menu,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  mrp: number;
  image_url: string;
  description: string;
  stock: number;
  is_active: boolean;
  is_new: boolean;
  is_best_seller: boolean;
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  const router = useRouter();
  const { cartCount } = useCart();

  useEffect(() => {
    const loadHomepageProducts = async () => {
      const { data: newData, error: newError } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("is_new", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (!newError) {
        setNewArrivals(newData || []);
      }

      const { data: bestData, error: bestError } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("is_best_seller", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (!bestError) {
        setBestSellers(bestData || []);
      }
    };

    loadHomepageProducts();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const searchBar = document.getElementById("navbar-search");
    searchBar?.classList.add("hidden");

    router.push(
      `/shop?search=${encodeURIComponent(searchTerm.trim())}`
    );
  };

  return (
    <main className="min-h-screen bg-[#fffaf8] text-[#2a1f1d]">

      <StoreHeader />
      
      {/* Hero Section */}
<section className="relative overflow-hidden bg-gradient-to-b from-[#fffaf8] via-[#fff8f5] to-[#fffaf8]">
  {/* Decorative Background Glows */}
  <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#f3d6cb]/35 blur-3xl" />
  <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-[#e8c6ad]/20 blur-3xl" />

  <div className="relative mx-auto grid min-h-[76vh] max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
    {/* Hero Text */}
    <div className="order-2 text-center lg:order-1 lg:text-left">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#b98b67] sm:text-sm">
        Elegance in Every Detail
      </p>

      <h1 className="font-serif text-[44px] leading-[1.05] text-[#2a1f1d] sm:text-5xl md:text-6xl lg:text-7xl">
        Jewellery That
        <span className="mt-1 block bg-gradient-to-r from-[#b98b67] via-[#d5a47e] to-[#9b6d4d] bg-clip-text text-transparent">
          Feels Like You
        </span>
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-[#6e5b55] sm:text-base md:text-lg lg:mx-0">
        Discover timeless studs, elegant necklaces,
        beautiful bracelets, and carefully curated jewellery
        designed to add charm to every moment.
      </p>

      {/* CTA Buttons */}
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
        <Link
          href="/shop"
          className="group inline-flex items-center justify-center rounded-full bg-[#2a1f1d] px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_12px_28px_rgba(42,31,29,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98b67] hover:shadow-[0_16px_34px_rgba(185,139,103,0.28)]"
        >
          Shop Collection
        </Link>

        <Link
          href="#new-arrivals"
          className="inline-flex items-center justify-center rounded-full border border-[#b98b67] bg-white/70 px-8 py-4 text-sm font-semibold tracking-wide text-[#2a1f1d] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98b67] hover:text-white"
        >
          New Arrivals
        </Link>
      </div>

      {/* Trust Row */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b736b] lg:justify-start">
        <span>Secure Payments</span>
        <span className="text-[#c7a489]">•</span>
        <span>Curated Jewellery</span>
        <span className="text-[#c7a489]">•</span>
        <span>Fast Dispatch</span>
      </div>
    </div>

    {/* Hero Logo */}
    <div className="order-1 flex justify-center lg:order-2">
      <div className="relative flex aspect-square w-full max-w-[390px] items-center justify-center sm:max-w-[440px] lg:max-w-[520px]">
        {/* Outer Glow */}
        <div className="absolute inset-[6%] rounded-full bg-[#f5deda]/70 blur-2xl" />

        {/* Outer Ring */}
        <div className="absolute inset-[4%] rounded-full border border-[#d9b292]/60" />

        {/* Inner Ring */}
        <div className="absolute inset-[10%] rounded-full border border-white/80" />

        {/* Soft Background Circle */}
        <div className="absolute inset-[8%] rounded-full bg-gradient-to-br from-[#f9e8e2] via-[#f5ddd8] to-[#f7ebe7] shadow-[0_30px_70px_rgba(115,76,62,0.12)]" />

        <Image
          src="/images/logo/studlogo.png"
          alt="The Stud House Elite"
          width={430}
          height={430}
          priority
          className="relative z-10 h-[72%] w-[72%] rounded-full object-cover shadow-[0_24px_55px_rgba(78,49,41,0.20)] transition duration-700 hover:scale-[1.02]"
        />

        {/* Tiny Decorative Dots */}
        <span className="absolute right-[9%] top-[20%] h-2 w-2 rounded-full bg-[#b98b67]/70" />
        <span className="absolute bottom-[16%] left-[10%] h-1.5 w-1.5 rounded-full bg-[#d7b29b]/80" />
      </div>
    </div>
  </div>
</section>

      {/* Shop by Category */}
<section className="bg-white px-5 py-14 md:py-16">
  <div className="mx-auto max-w-7xl">
    {/* Section Heading */}
    <div className="mb-12 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#b98b67] sm:text-sm">
        Curated For You
      </p>

      <h2 className="font-serif text-4xl text-[#2a1f1d] md:text-5xl">
        Shop by Category
      </h2>

      <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-[#b98b67] to-transparent" />

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55] sm:text-base">
        Explore our beautifully curated jewellery collections
        designed for everyday elegance and special moments.
      </p>
    </div>

    {/* Category Cards */}
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {[
        {
          name: "Studs",
          image: "studs.jpg",
          text: "Everyday elegance",
        },
        {
          name: "Earrings",
          image: "earrings.jpg",
          text: "Statement styles",
        },
        {
          name: "Necklaces",
          image: "necklaces.jpg",
          text: "Timeless beauty",
        },
        {
          name: "Bracelets",
          image: "bracelets.jpg",
          text: "Delicate details",
        },
      ].map((category) => (
        <Link
          key={category.name}
          href={`/shop?category=${encodeURIComponent(
            category.name
          )}`}
          className="group relative block overflow-hidden rounded-[26px] border border-[#ead8cf]/70 bg-[#f8efeb] shadow-[0_10px_30px_rgba(70,45,38,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(70,45,38,0.14)]"
        >
          {/* Image */}
          <div className="relative h-[245px] overflow-hidden sm:h-[290px] md:h-[360px]">
            <Image
              src={`/images/categories/${category.image}`}
              alt={category.name}
              width={500}
              height={650}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />

            {/* Soft Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#241916]/80 via-[#241916]/15 to-transparent" />

            {/* Soft Top Glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#f3d6cb]/20 blur-2xl" />

            {/* Text Content */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e4c1aa] sm:text-xs">
                {category.text}
              </p>

              <h3 className="font-serif text-xl text-white sm:text-2xl">
                {category.name}
              </h3>

              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-white/85 transition group-hover:text-[#e8c4ac]">
                <span>Explore</span>

                <span className="transition duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>
      {/* New Arrivals */}
<section
  id="new-arrivals"
  className="scroll-mt-36 bg-[#fffaf8] px-5 py-14 md:py-16"
>
  <div className="mx-auto max-w-7xl">
    {/* Section Heading */}
    <div className="mb-12 flex flex-col gap-5 text-center md:flex-row md:items-end md:justify-between md:text-left">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#b98b67] sm:text-sm">
          Fresh Picks
        </p>

        <h2 className="font-serif text-4xl text-[#2a1f1d] md:text-5xl">
          New Arrivals
        </h2>

        <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-[#b98b67] to-transparent md:mx-0" />

        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55] sm:text-base">
          Discover our latest jewellery pieces, thoughtfully
          selected for modern elegance and everyday charm.
        </p>
      </div>

      <Link
        href="/shop"
        className="mx-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#b98b67] bg-white/70 px-6 py-3 text-sm font-semibold text-[#2a1f1d] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98b67] hover:text-white md:mx-0"
      >
        View All
        <span className="transition group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>

    {/* Product Grid */}
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {newArrivals.map((product) => {
        const discount =
          product.mrp > product.price
            ? Math.round(
                ((product.mrp - product.price) /
                  product.mrp) *
                  100
              )
            : 0;

        return (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group block"
          >
            <div className="overflow-hidden rounded-[24px] border border-[#ead8cf]/70 bg-white shadow-[0_10px_30px_rgba(70,45,38,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(70,45,38,0.13)]">

              {/* Product Image */}
              <div className="relative overflow-hidden bg-[#f8efeb]">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={500}
                  height={600}
                  className="h-[235px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[280px] md:h-[350px]"
                />

                {/* New Badge */}
                <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-[#2a1f1d]/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  New
                </span>

                {/* Discount Badge */}
                {discount > 0 && (
                  <span className="absolute right-3 top-3 rounded-full bg-[#fffaf8]/90 px-3 py-1 text-[10px] font-semibold text-[#8a6248] shadow-sm backdrop-blur-md">
                    {discount}% OFF
                  </span>
                )}

                {/* Bottom Image Overlay */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#2a1f1d]/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              </div>

              {/* Product Info */}
              <div className="p-4 sm:p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b98b67] sm:text-xs">
                  {product.category}
                </p>

                <h3 className="mt-2 line-clamp-2 min-h-[48px] font-serif text-[17px] leading-6 text-[#2a1f1d] sm:text-lg">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-base font-semibold text-[#2a1f1d]">
                    ₹
                    {Number(
                      product.price
                    ).toLocaleString("en-IN")}
                  </span>

                  {product.mrp > product.price && (
                    <span className="text-xs text-[#9f8c85] line-through sm:text-sm">
                      ₹
                      {Number(
                        product.mrp
                      ).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-4 flex items-center justify-between rounded-full bg-[#2a1f1d] px-4 py-3 text-sm font-semibold text-white transition duration-300 group-hover:bg-[#b98b67]">
                  <span>View Product</span>

                  <span className="transition duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  </div>
</section>
      {/* Best Sellers */}
<section className="bg-white px-5 py-14 md:py-16">
  <div className="mx-auto max-w-7xl">
    {/* Section Heading */}
    <div className="mb-12 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#b98b67] sm:text-sm">
        Loved by Everyone
      </p>

      <h2 className="font-serif text-4xl text-[#2a1f1d] md:text-5xl">
        Best Sellers
      </h2>

      <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-[#b98b67] to-transparent" />

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55] sm:text-base">
        Discover the pieces our customers love the most —
        timeless styles designed to add effortless elegance.
      </p>
    </div>

    {/* Product Grid */}
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {bestSellers.map((product) => {
        const discount =
          product.mrp > product.price
            ? Math.round(
                ((product.mrp - product.price) /
                  product.mrp) *
                  100
              )
            : 0;

        return (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group block"
          >
            <div className="overflow-hidden rounded-[24px] border border-[#ead8cf]/70 bg-[#fffaf8] shadow-[0_10px_30px_rgba(70,45,38,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(70,45,38,0.14)]">
              {/* Product Image */}
              <div className="relative overflow-hidden bg-[#f7ece7]">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={500}
                  height={600}
                  className="h-[235px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[280px] md:h-[350px]"
                />

                {/* Best Seller Badge */}
                {/* Best Seller Badge */}
<div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/30 bg-[#b98b67]/95 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-md sm:px-3 sm:text-[10px]">
  <span>★</span>
  <span>Best Seller</span>
</div>

{/* Discount Badge */}
{discount > 0 && (
  <span className="absolute left-3 top-11 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold text-[#8a6248] shadow-sm backdrop-blur-md sm:left-auto sm:right-3 sm:top-3 sm:px-3 sm:text-[10px]">
    {discount}% OFF
  </span>
)}

                {/* Gold Bottom Glow */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#b98b67]/12 to-transparent" />
              </div>

              {/* Product Info */}
              <div className="p-4 sm:p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b98b67] sm:text-xs">
                  {product.category}
                </p>

                <h3 className="mt-2 line-clamp-2 min-h-[48px] font-serif text-[17px] leading-6 text-[#2a1f1d] sm:text-lg">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-base font-semibold text-[#2a1f1d]">
                    ₹
                    {Number(
                      product.price
                    ).toLocaleString("en-IN")}
                  </span>

                  {product.mrp > product.price && (
                    <span className="text-xs text-[#9f8c85] line-through sm:text-sm">
                      ₹
                      {Number(
                        product.mrp
                      ).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-4 flex items-center justify-between rounded-full border border-[#b98b67] bg-white px-4 py-3 text-sm font-semibold text-[#2a1f1d] transition duration-300 group-hover:bg-[#b98b67] group-hover:text-white">
                  <span>View Product</span>

                  <span className="transition duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  </div>
</section>
      {/* Why Choose Us */}
<section className="relative overflow-hidden bg-[#fffaf8] px-5 py-14 md:py-16">
  {/* Background Glow */}
  <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#f3d6cb]/25 blur-3xl" />
  <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-[#e9c6ad]/20 blur-3xl" />

  <div className="relative mx-auto max-w-7xl">
    {/* Heading */}
    <div className="mb-12 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#b98b67] sm:text-sm">
        Why Choose Us
      </p>

      <h2 className="font-serif text-4xl text-[#2a1f1d] md:text-5xl">
        Designed for Confidence
      </h2>

      <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-[#b98b67] to-transparent" />

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55] sm:text-base">
        Thoughtful details, secure shopping, and jewellery
        selected to make every purchase feel special.
      </p>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {[
        {
          icon: Sparkles,
          title: "Premium Selection",
          text: "Carefully chosen jewellery designed for elegance, comfort, and style.",
        },
        {
          icon: ShieldCheck,
          title: "Secure Payments",
          text: "Smooth and secure checkout experience powered by trusted payment systems.",
        },
        {
          icon: Truck,
          title: "Reliable Delivery",
          text: "Orders handled with care and delivered safely to your doorstep.",
        },
        {
          icon: Headphones,
          title: "Friendly Support",
          text: "Easy customer support through WhatsApp and direct assistance.",
        },
      ].map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="group rounded-[26px] border border-[#ead8cf]/70 bg-white/80 p-5 text-center shadow-[0_10px_30px_rgba(70,45,38,0.05)] backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:border-[#d8b293] hover:shadow-[0_18px_45px_rgba(70,45,38,0.12)] sm:p-7"
          >
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#ead8cf] bg-gradient-to-br from-[#fffaf8] to-[#f5ded5] text-[#b98b67] shadow-sm transition duration-300 group-hover:scale-105 group-hover:bg-[#b98b67] group-hover:text-white">
              <Icon size={24} strokeWidth={1.8} />
            </div>

            <h3 className="font-serif text-lg leading-6 text-[#2a1f1d] sm:text-xl">
              {item.title}
            </h3>

            <p className="mt-3 text-xs leading-6 text-[#6e5b55] sm:text-sm">
              {item.text}
            </p>

            <div className="mx-auto mt-5 h-px w-8 bg-[#d9b292]/60 transition-all duration-300 group-hover:w-12" />
          </div>
        );
      })}
    </div>
  </div>
</section>
      {/* Promotional Banner */}
<section className="bg-white px-5 py-12 md:py-14">
  <div className="mx-auto max-w-7xl">
    <div className="relative overflow-hidden rounded-[34px] border border-[#b98b67]/30 bg-gradient-to-br from-[#241916] via-[#2d1f1b] to-[#1f1512] px-6 py-12 text-center text-white shadow-[0_24px_70px_rgba(42,31,29,0.20)] md:px-12 md:py-16">
      
      {/* Decorative Glows */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#b98b67]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-[#f0c9bd]/15 blur-3xl" />

      {/* Decorative Rings */}
      <div className="pointer-events-none absolute left-8 top-8 h-28 w-28 rounded-full border border-white/5" />
      <div className="pointer-events-none absolute bottom-8 right-10 h-36 w-36 rounded-full border border-[#b98b67]/10" />

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Small Pill */}
        <div className="mb-5 inline-flex items-center rounded-full border border-[#e8c4ac]/30 bg-white/5 px-4 py-2 backdrop-blur-md">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e8c4ac] sm:text-xs">
            Signature Collection
          </span>
        </div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-[#d9aa86] sm:text-sm">
          Timeless. Elegant. Yours.
        </p>

        <h2 className="font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
          Everyday Elegance,
          <span className="mt-1 block bg-gradient-to-r from-[#f0d0b9] via-[#d9aa86] to-[#f0d0b9] bg-clip-text text-transparent">
            Made Special
          </span>
        </h2>

        <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-[#d9aa86] to-transparent" />

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          Discover jewellery designed to complement every mood,
          every outfit, and every special moment.
        </p>

        <Link
          href="/shop"
          className="group mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-[#e8c4ac] px-8 py-4 text-sm font-semibold tracking-wide text-[#2a1f1d] shadow-[0_12px_28px_rgba(232,196,172,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_34px_rgba(255,255,255,0.14)]"
        >
          <span>Shop Now</span>

          <span className="transition duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  </div>
</section>
      {/* Customer Reviews */}
<section className="bg-[#fffaf8] px-5 py-14 md:py-16">
  <div className="mx-auto max-w-7xl">
    {/* Heading */}
    <div className="mb-12 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#b98b67] sm:text-sm">
        Customer Love
      </p>

      <h2 className="font-serif text-4xl text-[#2a1f1d] md:text-5xl">
        What Our Customers Say
      </h2>

      <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-[#b98b67] to-transparent" />

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55] sm:text-base">
        Real experiences from customers who love adding a little
        more elegance to their everyday style.
      </p>
    </div>

    {/* Reviews */}
    <div className="grid gap-6 md:grid-cols-3">
      {[
        {
          name: "Priya R.",
          city: "Hyderabad",
          text: "The jewellery looks even more beautiful in person. The finishing is elegant and the packaging felt very premium.",
        },
        {
          name: "Sneha K.",
          city: "Bengaluru",
          text: "Loved the design and quality. The earrings were lightweight, comfortable, and perfect for everyday wear.",
        },
        {
          name: "Aishwarya M.",
          city: "Chennai",
          text: "Beautiful collection and a smooth shopping experience. Definitely looking forward to ordering more pieces.",
        },
      ].map((review) => (
        <div
          key={review.name}
          className="group relative overflow-hidden rounded-[28px] border border-[#ead8cf]/70 bg-white/85 p-7 shadow-[0_10px_30px_rgba(70,45,38,0.06)] backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(70,45,38,0.12)] sm:p-8"
        >
          {/* Decorative Quote */}
          <div className="pointer-events-none absolute right-5 top-2 font-serif text-[74px] leading-none text-[#b98b67]/10">
            “
          </div>

          {/* Stars */}
          <div className="relative mb-5 text-sm tracking-[0.18em] text-[#b98b67]">
            ★★★★★
          </div>

          {/* Review */}
          <p className="relative text-sm leading-7 text-[#6e5b55] sm:text-base">
            “{review.text}”
          </p>

          {/* Customer */}
          <div className="mt-7 flex items-center gap-4 border-t border-[#ead8cf] pt-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f4ddd4] to-[#ead0c3] font-serif text-base font-semibold text-[#8a6248]">
              {review.name.charAt(0)}
            </div>

            <div>
              <h3 className="font-serif text-lg text-[#2a1f1d]">
                {review.name}
              </h3>

              <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-[#9b837a]">
                {review.city}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* Instagram Section */}
<section className="bg-white px-5 py-14 md:py-16">
    <div className="mx-auto max-w-7xl">
    {/* Heading */}
    <div className="mb-12 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#b98b67] sm:text-sm">
        Follow Our Style
      </p>

      <h2 className="font-serif text-4xl text-[#2a1f1d] md:text-5xl">
        Find Us on Instagram
      </h2>

      <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-[#b98b67] to-transparent" />

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55] sm:text-base">
        Discover new arrivals, styling inspiration, and our latest
        jewellery moments on Instagram.
      </p>
    </div>

    {/* Instagram Grid */}
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
      {[
        "insta1.jpg",
        "insta2.jpg",
        "insta3.jpg",
        "insta4.jpg",
      ].map((image, index) => (
        <a
          key={image}
          href="https://www.instagram.com/thestudhouseelite.co"
target="_blank"
rel="noopener noreferrer"
          aria-label={`View Instagram post ${index + 1}`}
          className="group relative block overflow-hidden rounded-[24px] border border-[#ead8cf]/60 bg-[#f8efeb] shadow-[0_10px_30px_rgba(70,45,38,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(70,45,38,0.13)]"
        >
          <Image
            src={`/images/instagram/${image}`}
            alt={`Instagram jewellery post ${index + 1}`}
            width={500}
            height={500}
            className="aspect-square w-full object-cover transition duration-700 group-hover:scale-110"
          />

          {/* Premium Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#241916]/65 via-[#241916]/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

          {/* Instagram Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 translate-y-4 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:translate-y-0 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-[#f58529] group-hover:via-[#dd2a7b] group-hover:to-[#8134af] group-hover:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  width="20"
                  height="20"
                  x="2"
                  y="2"
                  rx="5"
                  ry="5"
                />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line
                  x1="17.5"
                  x2="17.51"
                  y1="6.5"
                  y2="6.5"
                />
              </svg>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-white">
              View on Instagram
            </p>
          </div>
        </a>
      ))}
    </div>

    {/* CTA */}
    <div className="mt-10 text-center">
      <a
        href="https://www.instagram.com/thestudhouseelite.co"
target="_blank"
rel="noopener noreferrer"
        className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#2a1f1d] px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_10px_24px_rgba(42,31,29,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98b67] hover:shadow-[0_14px_30px_rgba(185,139,103,0.24)]"
      >
        <span>Follow on Instagram</span>
        <span className="transition duration-300 group-hover:translate-x-1">
          →
        </span>
      </a>
    </div>
  </div>
</section>

      {/* Footer */}
<footer className="relative overflow-hidden bg-gradient-to-br from-[#241916] via-[#2a1d19] to-[#1c1311] px-5 pt-16 text-white">
  {/* Decorative Glows */}
  <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#b98b67]/10 blur-3xl" />
  <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#e8c4ac]/10 blur-3xl" />

  <div className="relative mx-auto max-w-7xl">
    <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-4">

      {/* Brand */}
      <div>
        <Image
          src="/images/logo/studlogo.png"
          alt="The Stud House Elite"
          width={100}
          height={100}
          className="h-[92px] w-[92px] rounded-full border border-[#b98b67]/30 object-cover shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
        />

        <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
          Elegant jewellery thoughtfully curated for everyday
          beauty, celebrations, and unforgettable moments.
        </p>

        {/* Social Icons */}
<div className="mt-6 flex gap-3">

  {/* Instagram */}
  <a
  href="https://www.instagram.com/thestudhouseelite.co"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Instagram"
  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-[#f58529] hover:via-[#dd2a7b] hover:to-[#8134af] hover:text-white"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="5"
      ry="5"
    />
    <circle
      cx="12"
      cy="12"
      r="4"
    />
    <circle
      cx="17.5"
      cy="6.5"
      r="1"
      fill="currentColor"
      stroke="none"
    />
  </svg>
</a>

  {/* WhatsApp */}
  <a
    href="https://wa.me/917893542022"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="WhatsApp"
    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12.04 2C6.52 2 2.03 6.48 2.03 12c0 1.76.46 3.48 1.34 5L2 22l5.12-1.34A9.94 9.94 0 0 0 12.04 22C17.55 22 22 17.52 22 12S17.55 2 12.04 2Zm0 18.18a8.15 8.15 0 0 1-4.16-1.14l-.3-.18-3.04.8.81-2.96-.2-.31A8.12 8.12 0 1 1 12.04 20.18Zm4.47-6.09c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.52.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  </a>

</div>
      </div>

      {/* Shop */}
      <div>
        <h3 className="font-serif text-xl text-[#e8b58f]">
          Shop
        </h3>

        <div className="mt-2 h-px w-10 bg-[#b98b67]/60" />

        <div className="mt-5 flex flex-col gap-3 text-sm">
          {[
            {
              label: "New Arrivals",
              href: "#new-arrivals",
            },
            {
              label: "Studs",
              href: "/shop?category=Studs",
            },
            {
              label: "Earrings",
              href: "/shop?category=Earrings",
            },
            {
              label: "Necklaces",
              href: "/shop?category=Necklaces",
            },
            {
              label: "Bracelets",
              href: "/shop?category=Bracelets",
            },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex w-fit items-center gap-2 text-white/65 transition duration-300 hover:translate-x-1 hover:text-[#e8c4ac]"
            >
              <span className="h-1 w-1 rounded-full bg-[#b98b67]/60 transition group-hover:bg-[#e8c4ac]" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Customer Care */}
      <div>
        <h3 className="font-serif text-xl text-[#e8b58f]">
          Customer Care
        </h3>

        <div className="mt-2 h-px w-10 bg-[#b98b67]/60" />

        <div className="mt-5 flex flex-col gap-3 text-sm">
          <Link
            href="/contact"
            className="group flex w-fit items-center gap-2 text-white/65 transition duration-300 hover:translate-x-1 hover:text-[#e8c4ac]"
          >
            <span className="h-1 w-1 rounded-full bg-[#b98b67]/60" />
            Contact Us
          </Link>

          <Link
            href="/shipping-policy"
            className="group flex w-fit items-center gap-2 text-white/65 transition duration-300 hover:translate-x-1 hover:text-[#e8c4ac]"
          >
            <span className="h-1 w-1 rounded-full bg-[#b98b67]/60" />
            Shipping Policy
          </Link>

          <Link
            href="/refund-policy"
            className="group flex w-fit items-center gap-2 text-white/65 transition duration-300 hover:translate-x-1 hover:text-[#e8c4ac]"
          >
            <span className="h-1 w-1 rounded-full bg-[#b98b67]/60" />
            Refund & Returns
          </Link>
        </div>
      </div>

      {/* Contact */}
      <div>
        <h3 className="font-serif text-xl text-[#e8b58f]">
          Get in Touch
        </h3>

        <div className="mt-2 h-px w-10 bg-[#b98b67]/60" />

        <div className="mt-5 space-y-4 text-sm text-white/65">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#d7aa83]">
              <Phone size={15} />
            </div>

            <span className="pt-1">
              +91 78935 42022
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#d7aa83]">
              <Mail size={15} />
            </div>

            <span className="break-all pt-1">
              thestudhouseelite@gmail.com
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#d7aa83]">
              <MapPin size={15} />
            </div>

            <span className="pt-1">
              Hyderabad, Telangana
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Footer */}
    <div className="py-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        {/* Left */}
        <div className="text-center md:text-left">
          <p className="text-xs text-white/45">
            © 2026 The Stud House Elite. All rights reserved.
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs md:justify-start">
            <Link
              href="/contact"
              className="text-white/50 transition hover:text-[#D4AF37]"
            >
              Contact
            </Link>

            <Link
              href="/privacy-policy"
              className="text-white/50 transition hover:text-[#D4AF37]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="text-white/50 transition hover:text-[#D4AF37]"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/shipping-policy"
              className="text-white/50 transition hover:text-[#D4AF37]"
            >
              Shipping Policy
            </Link>

            <Link
              href="/refund-policy"
              className="text-white/50 transition hover:text-[#D4AF37]"
            >
              Refund & Return Policy
            </Link>
          </div>
        </div>

        {/* Kanna Web Studio Credit */}
        <a
          href="https://kannawebstudio.in"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs transition duration-300 hover:border-[#D4AF37]/40 hover:bg-white/[0.06] md:justify-end"
        >
          <span className="text-white/50">
            Designed & Developed by
          </span>

          <Image
            src="/images/kannawebstudio.png"
            alt="Kanna Web Studio"
            width={24}
            height={24}
            className="h-6 w-6 rounded-full object-cover transition duration-300 group-hover:scale-105"
          />

          <span className="font-semibold">
            <span className="text-white">
              Kanna
            </span>{" "}
            <span className="text-[#D4AF37]">
              Web Studio
            </span>
          </span>
        </a>
      </div>
    </div>
  </div>
</footer>
    </main>
  );
}