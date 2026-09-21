"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

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
};

export default function TestSupabasePage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState("Loading product...");

  useEffect(() => {
    const loadProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .single();

      if (error) {
        console.error("Supabase error:", error);
        setMessage(`Failed: ${error.message}`);
        return;
      }

      setProduct(data);
      setMessage("Product loaded successfully");
    };

    loadProduct();
  }, []);

  return (
    <main className="min-h-screen bg-[#fffaf8] px-5 py-16 text-center">
      <h1 className="font-serif text-3xl text-[#2a1f1d]">
        {message}
      </h1>

      {product && (
        <div className="mx-auto mt-8 max-w-md rounded-3xl bg-white p-6 shadow">
          <p className="text-sm uppercase tracking-[0.2em] text-[#b98b67]">
            {product.category}
          </p>

          <h2 className="mt-2 font-serif text-2xl">
            {product.name}
          </h2>

          <p className="mt-3 font-semibold">
            ₹{product.price}
          </p>

          <p className="mt-3 text-[#6e5b55]">
            {product.description}
          </p>

          <p className="mt-3 text-sm">
            Stock: {product.stock}
          </p>
        </div>
      )}
    </main>
  );
}