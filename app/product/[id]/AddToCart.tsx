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
  stock: number;
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

  const isOutOfStock = product.stock <= 0;

  const decrease = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increase = () => {
    setQuantity((current) =>
      Math.min(product.stock, current + 1)
    );
  };

  const handleAdd = () => {
    if (isOutOfStock) return;

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
    if (isOutOfStock) return;

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
            disabled={isOutOfStock || quantity <= 1}
            className="text-xl text-[#6e5b55] disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>

          <span className="mx-6 font-semibold">
            {isOutOfStock ? 0 : quantity}
          </span>

          <button
            type="button"
            onClick={increase}
            disabled={
              isOutOfStock ||
              quantity >= product.stock
            }
            className="text-xl text-[#6e5b55] disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>

        {!isOutOfStock && (
          <p className="mt-2 text-xs text-[#7c6a63]">
            {product.stock} item
            {product.stock > 1 ? "s" : ""} available
          </p>
        )}

        {isOutOfStock && (
          <p className="mt-2 text-sm font-semibold text-red-600">
            Sold Out
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={handleAdd}
          disabled={isOutOfStock}
          className="rounded-full bg-[#2a1f1d] px-10 py-4 text-sm font-semibold text-white transition hover:bg-[#b98b67] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
        >
          {isOutOfStock
            ? "Sold Out"
            : added
            ? "Added to Cart ✓"
            : inCart
            ? "Go to Cart"
            : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="rounded-full border border-[#b98b67] px-10 py-4 text-sm font-semibold transition hover:bg-[#b98b67] hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
        >
          {isOutOfStock ? "Unavailable" : "Buy Now"}
        </button>
      </div>
    </>
  );
}