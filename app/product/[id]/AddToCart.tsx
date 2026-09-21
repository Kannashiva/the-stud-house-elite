"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

export default function AddToCart({
  product,
}: {
  product: Product;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [inCart, setInCart] = useState(false);

  const { addToCart } = useCart();
  const router = useRouter();

  const decrease = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increase = () => {
    setQuantity((current) => current + 1);
  };

  const handleAdd = () => {
    if (inCart) {
      router.push("/cart");
      return;
    }

    addToCart(product, quantity);

    setAdded(true);
    setInCart(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  return (
    <>
      {/* Quantity */}
      <div className="mt-8">
        <p className="mb-3 text-sm font-semibold">
          Quantity
        </p>

        <div className="flex w-fit items-center rounded-full border border-[#dcc9bf] bg-white px-5 py-3">
          <button
            type="button"
            onClick={decrease}
            className="text-xl text-[#6e5b55]"
          >
            −
          </button>

          <span className="mx-6 font-semibold">
            {quantity}
          </span>

          <button
            type="button"
            onClick={increase}
            className="text-xl text-[#6e5b55]"
          >
            +
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-full bg-[#2a1f1d] px-10 py-4 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
        >
          {added
            ? "Added to Cart ✓"
            : inCart
            ? "Go to Cart"
            : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="rounded-full border border-[#b98b67] px-10 py-4 text-sm font-semibold transition hover:bg-[#b98b67] hover:text-white"
        >
          Buy Now
        </button>
      </div>
    </>
  );
}