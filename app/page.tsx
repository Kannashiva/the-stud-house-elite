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
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:py-20">
          {/* Hero Text */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Elegance in Every Detail
            </p>

            <h1 className="font-serif text-5xl leading-tight text-[#2a1f1d] md:text-6xl lg:text-7xl">
              Jewellery That
              <span className="block text-[#b98b67]">
                Feels Like You
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#6e5b55] md:text-lg lg:mx-0">
              Discover timeless studs, elegant necklaces,
              beautiful bracelets, and carefully curated jewellery
              designed to add charm to every moment.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="/shop"
                className="rounded-full bg-[#2a1f1d] px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-[#b98b67]"
              >
                Shop Collection
              </a>

              <a
                href="#new-arrivals"
                className="rounded-full border border-[#b98b67] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#2a1f1d] transition hover:bg-[#b98b67] hover:text-white"
              >
                New Arrivals
              </a>
            </div>
          </div>

          {/* Hero Logo */}
          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative flex aspect-square w-full max-w-[520px] items-center justify-center rounded-full bg-[#f8dfdc]">
              <div className="absolute inset-5 rounded-full border border-[#d9b292]" />

              <Image
                src="/images/logo/studlogo.png"
                alt="The Stud House Elite"
                width={430}
                height={430}
                className="relative z-10 h-[82%] w-[82%] rounded-full object-cover shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Curated For You
            </p>

            <h2 className="font-serif text-4xl text-[#2a1f1d] md:text-5xl">
              Shop by Category
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[#6e5b55]">
              Explore our beautifully curated jewellery collections
              designed for everyday elegance and special moments.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
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
              <a
                key={category.name}
                href={`/shop?category=${encodeURIComponent(
                  category.name
                )}`}
                className="group block"
              >
                <div className="overflow-hidden rounded-[28px] bg-[#f8efeb]">
                  <Image
                    src={`/images/categories/${category.image}`}
                    alt={category.name}
                    width={500}
                    height={600}
                    className="h-[260px] w-full object-cover transition duration-500 group-hover:scale-105 md:h-[360px]"
                  />
                </div>

                <div className="mt-4 text-center">
                  <h3 className="font-serif text-xl text-[#2a1f1d]">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-sm text-[#8b736b]">
                    {category.text}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section
        id="new-arrivals"
        className="scroll-mt-36 bg-[#fffaf8] px-5 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
                Fresh Picks
              </p>

              <h2 className="font-serif text-4xl text-[#2a1f1d] md:text-5xl">
                New Arrivals
              </h2>

              <p className="mt-4 max-w-2xl text-[#6e5b55]">
                Discover our latest jewellery pieces,
                thoughtfully selected for modern elegance and
                everyday charm.
              </p>
            </div>

            <a
              href="/shop"
              className="mx-auto rounded-full border border-[#b98b67] px-6 py-3 text-sm font-semibold text-[#2a1f1d] transition hover:bg-[#b98b67] hover:text-white md:mx-0"
            >
              View All
            </a>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
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
                <a
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-[24px] bg-white">
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-[#2a1f1d] px-3 py-1 text-xs font-medium text-white">
                      New
                    </span>

                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={500}
                      height={600}
                      className="h-[260px] w-full object-cover transition duration-500 group-hover:scale-105 md:h-[360px]"
                    />
                  </div>

                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#b98b67]">
                      {product.category}
                    </p>

                    <h3 className="mt-1 font-serif text-lg text-[#2a1f1d]">
                      {product.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#2a1f1d]">
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString("en-IN")}
                      </span>

                      {product.mrp > product.price && (
                        <>
                          <span className="text-sm text-[#9f8c85] line-through">
                            ₹
                            {Number(
                              product.mrp
                            ).toLocaleString("en-IN")}
                          </span>

                          <span className="text-xs font-semibold text-green-700">
                            {discount}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-4 w-full rounded-full bg-[#2a1f1d] py-3 text-center text-sm font-semibold text-white transition group-hover:bg-[#b98b67]">
                      View Product
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-[#fffaf8] px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Loved by Everyone
            </p>

            <h2 className="font-serif text-4xl text-[#2a1f1d] md:text-5xl">
              Best Sellers
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[#6e5b55]">
              Discover the pieces our customers love the most —
              timeless styles designed to add effortless elegance.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
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
                <a
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-[24px] bg-white">
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-[#b98b67] px-3 py-1 text-xs font-medium text-white">
                      Best Seller
                    </span>

                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={500}
                      height={600}
                      className="h-[260px] w-full object-cover transition duration-500 group-hover:scale-105 md:h-[360px]"
                    />
                  </div>

                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#b98b67]">
                      {product.category}
                    </p>

                    <h3 className="mt-1 font-serif text-lg text-[#2a1f1d]">
                      {product.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#2a1f1d]">
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString("en-IN")}
                      </span>

                      {product.mrp > product.price && (
                        <>
                          <span className="text-sm text-[#9f8c85] line-through">
                            ₹
                            {Number(
                              product.mrp
                            ).toLocaleString("en-IN")}
                          </span>

                          <span className="text-xs font-semibold text-green-700">
                            {discount}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-4 w-full rounded-full bg-[#2a1f1d] py-3 text-center text-sm font-semibold text-white transition group-hover:bg-[#b98b67]">
                      View Product
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Why Choose Us
            </p>

            <h2 className="font-serif text-4xl text-[#2a1f1d] md:text-5xl">
              Designed for Confidence
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[#6e5b55]">
              Thoughtful details, secure shopping, and jewellery
              selected to make every purchase feel special.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "✨",
                title: "Premium Selection",
                text: "Carefully chosen jewellery designed for elegance, comfort, and style.",
              },
              {
                icon: "🔒",
                title: "Secure Payments",
                text: "Smooth and secure checkout experience powered by trusted payment systems.",
              },
              {
                icon: "🚚",
                title: "Reliable Delivery",
                text: "Orders handled with care and delivered safely to your doorstep.",
              },
              {
                icon: "💬",
                title: "Friendly Support",
                text: "Easy customer support through WhatsApp and direct assistance.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-[#ead8cf] bg-[#fffaf8] p-7 text-center transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#f5dfd7] text-2xl">
                  {item.icon}
                </div>

                <h3 className="font-serif text-xl text-[#2a1f1d]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#6e5b55]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[32px] bg-[#2a1f1d] px-6 py-16 text-center text-white md:px-12 md:py-20">
            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#b98b67]/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[#f0c9bd]/20 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#e8c4ac]">
                Timeless. Elegant. Yours.
              </p>

              <h2 className="font-serif text-4xl leading-tight md:text-6xl">
                Everyday Elegance,
                <span className="block text-[#e8c4ac]">
                  Made Special
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
                Discover jewellery designed to complement every
                mood, every outfit, and every special moment.
              </p>

              <a
                href="/shop"
                className="mt-8 inline-block rounded-full bg-[#e8c4ac] px-8 py-3.5 text-sm font-semibold text-[#2a1f1d] transition hover:bg-white"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Customer Love
            </p>

            <h2 className="font-serif text-4xl text-[#2a1f1d] md:text-5xl">
              What Our Customers Say
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[#6e5b55]">
              Real experiences from customers who love adding a
              little more elegance to their everyday style.
            </p>
          </div>

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
                className="rounded-[28px] border border-[#ead8cf] bg-[#fffaf8] p-8"
              >
                <div className="mb-4 text-lg tracking-[0.15em] text-[#b98b67]">
                  ★★★★★
                </div>

                <p className="leading-7 text-[#6e5b55]">
                  “{review.text}”
                </p>

                <div className="mt-6 border-t border-[#ead8cf] pt-5">
                  <h3 className="font-serif text-lg text-[#2a1f1d]">
                    {review.name}
                  </h3>

                  <p className="mt-1 text-sm text-[#9b837a]">
                    {review.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="bg-[#fffaf8] px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Follow Our Style
            </p>

            <h2 className="font-serif text-4xl text-[#2a1f1d] md:text-5xl">
              Find Us on Instagram
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[#6e5b55]">
              Discover new arrivals, styling inspiration, and our
              latest jewellery moments on Instagram.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              "insta1.jpg",
              "insta2.jpg",
              "insta3.jpg",
              "insta4.jpg",
            ].map((image, index) => (
              <div
                key={image}
                className="group relative overflow-hidden rounded-[24px]"
              >
                <Image
                  src={`/images/instagram/${image}`}
                  alt={`Instagram jewellery post ${index + 1}`}
                  width={500}
                  height={500}
                  className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-[#2a1f1d]/0 transition duration-300 group-hover:bg-[#2a1f1d]/40">
                  <span className="translate-y-3 text-sm font-semibold text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    View on Instagram
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#"
              className="inline-flex rounded-full bg-[#2a1f1d] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#241916] px-5 pt-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Image
                src="/images/logo/studlogo.png"
                alt="The Stud House Elite"
                width={100}
                height={100}
                className="h-[90px] w-[90px] rounded-full object-cover"
              />

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
                Elegant jewellery thoughtfully curated for everyday
                beauty, celebrations, and unforgettable moments.
              </p>

              <div className="mt-6 flex gap-3">
                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:border-[#d7aa83] hover:bg-[#d7aa83] hover:text-[#241916]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
                </a>

                {/* WhatsApp */}
                <a
                  href="#"
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:border-[#d7aa83] hover:bg-[#d7aa83] hover:text-[#241916]"
                >
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h3 className="font-serif text-xl text-[#e2b792]">
                Shop
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-white/65">
                <a
                  href="#new-arrivals"
                  className="transition hover:text-white"
                >
                  New Arrivals
                </a>

                <a
                  href="/shop?category=Studs"
                  className="transition hover:text-white"
                >
                  Studs
                </a>

                <a
                  href="/shop?category=Earrings"
                  className="transition hover:text-white"
                >
                  Earrings
                </a>

                <a
                  href="/shop?category=Necklaces"
                  className="transition hover:text-white"
                >
                  Necklaces
                </a>

                <a
                  href="/shop?category=Bracelets"
                  className="transition hover:text-white"
                >
                  Bracelets
                </a>
              </div>
            </div>

            {/* Customer Care */}
            <div>
  <h3 className="font-serif text-2xl text-[#e8b58f]">
    Customer Care
  </h3>

  <div className="mt-6 flex flex-col gap-4">
    <Link
      href="/contact"
      className="text-white/70 transition hover:text-white"
    >
      Contact Us
    </Link>
  </div>
</div>

            {/* Contact */}
            <div>
              <h3 className="font-serif text-xl text-[#e2b792]">
                Get in Touch
              </h3>

              <div className="mt-5 space-y-4 text-sm text-white/65">
                <div className="flex items-start gap-3">
                  <Phone
                    size={17}
                    className="mt-1 shrink-0 text-[#d7aa83]"
                  />
                  <span>+91 78935 42022</span>
                </div>

                <div className="flex items-start gap-3">
                  <Mail
                    size={17}
                    className="mt-1 shrink-0 text-[#d7aa83]"
                  />
                  <span>
                    thestudhouseelite@gmail.com
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={17}
                    className="mt-1 shrink-0 text-[#d7aa83]"
                  />
                  <span>Hyderabad, Telangana</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
         <div className="border-t border-white/10 py-6">
           <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
             {/* Left Side */}
             <div className="text-center md:text-left">
               <p className="text-xs text-white/45">
                 © 2026 The Stud House Elite. All rights reserved.
               </p>

               <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs md:justify-start">
                 <Link
                   href="/contact"
                   className="text-white/55 transition hover:text-[#D4AF37]"
                 >
                   Contact
                 </Link>

                 <Link
                   href="/privacy-policy"
                   className="text-white/55 transition hover:text-[#D4AF37]"
                 >
                   Privacy Policy
                 </Link>

                 <Link
                   href="/terms-and-conditions"
                   className="text-white/55 transition hover:text-[#D4AF37]"
                 >
                   Terms & Conditions
                 </Link>

                 <Link
                   href="/shipping-policy"
                   className="text-white/55 transition hover:text-[#D4AF37]"
                 >
                   Shipping Policy
                 </Link>

                 <Link
                   href="/refund-policy"
                   className="text-white/55 transition hover:text-[#D4AF37]"
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
               className="flex items-center justify-center gap-2 text-xs transition hover:opacity-90 md:justify-end"
             >
               <span className="text-white/55">
                 Designed & Developed by
               </span>

               <Image
                 src="/images/kannawebstudio.png"
                 alt="Kanna Web Studio"
                 width={24}
                 height={24}
                 className="h-6 w-6 rounded-full object-cover"
               />

               <span className="font-semibold">
                 <span className="text-white">Kanna</span>{" "}
                 <span className="text-[#D4AF37]">Web Studio</span>
               </span>
             </a>
           </div>
         </div>

       </div>
      </footer>
    </main>
  );
}