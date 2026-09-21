"use client";
import AdminHeader from "../AdminHeader";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  is_new: boolean;
  is_best_seller: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load products:", error);
        setLoading(false);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    };

    loadProducts();
  }, []);
const handleToggleStatus = async (
  productId: number,
  currentStatus: boolean
) => {
  const response = await fetch(
    `/api/admin/products/${productId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_active: !currentStatus,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    console.error("Failed to update product status:", result);
    return;
  }

  setProducts((currentProducts) =>
    currentProducts.map((product) =>
      product.id === productId
        ? {
            ...product,
            is_active: result.product.is_active,
          }
        : product
    )
  );
};

const handleDeleteProduct = async (
  productId: number,
  productName: string
) => {
  const confirmed = window.confirm(
    `Are you sure you want to permanently delete "${productName}"?`
  );

  if (!confirmed) return;

  const response = await fetch(
    `/api/admin/products/${productId}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    alert(
      result.error ||
        "Unable to delete this product."
    );
    return;
  }

  setProducts((currentProducts) =>
    currentProducts.filter(
      (product) => product.id !== productId
    )
  );
};

  return (
  <>
    <AdminHeader />

    <main className="min-h-screen bg-[#fffaf8] px-5 py-10 text-[#2a1f1d]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Admin
            </p>

            <h1 className="mt-2 font-serif text-4xl">
              Products
            </h1>

            <p className="mt-2 text-sm text-[#6e5b55]">
              Manage products, stock, pricing and homepage visibility.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="rounded-full bg-[#2a1f1d] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#b98b67]"
          >
            + Add Product
          </Link>
        </div>

        {/* Products */}
        {loading ? (
          <div className="rounded-[24px] border border-[#ead8cf] bg-white p-10 text-center text-[#6e5b55]">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[24px] border border-[#ead8cf] bg-white p-10 text-center">
            <h2 className="font-serif text-2xl">
              No Products Found
            </h2>

            <p className="mt-2 text-sm text-[#6e5b55]">
              Add your first product to get started.
            </p>

            <Link
              href="/admin/products/new"
              className="mt-6 inline-block rounded-full bg-[#2a1f1d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
            >
              Add Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[24px] border border-[#ead8cf] bg-white">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="border-b border-[#ead8cf] bg-[#fffaf8]">
                <tr>
                  <th className="px-5 py-4">Image</th>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">New</th>
                  <th className="px-5 py-4">Best Seller</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#f0e4df] transition hover:bg-[#fffaf8] last:border-b-0"
                  >
                    {/* Image */}
                    <td className="px-5 py-4">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                    </td>

                    {/* Product */}
                    <td className="px-5 py-4 font-semibold">
                      {product.name}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      {product.category}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-semibold">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>

                        {product.mrp > product.price && (
                          <span className="ml-2 text-xs text-[#9f8c85] line-through">
                            ₹{Number(product.mrp).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <span
                        className={
                          product.stock === 0
                            ? "font-semibold text-red-600"
                            : product.stock <= 5
                            ? "font-semibold text-orange-600"
                            : ""
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    {/* New */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.is_new
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {product.is_new ? "Yes" : "No"}
                      </span>
                    </td>

                    {/* Best Seller */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.is_best_seller
                            ? "bg-[#f8efe7] text-[#9a6b48]"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {product.is_best_seller ? "Yes" : "No"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
  <div className="flex flex-wrap items-center gap-2">
    <Link
      href={`/admin/products/${product.id}/edit`}
      className="inline-flex rounded-full border border-[#b98b67] px-4 py-2 text-xs font-semibold text-[#2a1f1d] transition hover:bg-[#b98b67] hover:text-white"
    >
      Edit
    </Link>

    <button
      type="button"
      onClick={() =>
        handleToggleStatus(
          product.id,
          product.is_active
        )
      }
      className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold transition ${
        product.is_active
          ? "border border-red-300 text-red-600 hover:bg-red-50"
          : "border border-green-300 text-green-700 hover:bg-green-50"
      }`}
    >
      {product.is_active
        ? "Deactivate"
        : "Activate"}
    </button>

    <button
      type="button"
      onClick={() =>
        handleDeleteProduct(
          product.id,
          product.name
        )
      }
      className="inline-flex rounded-full border border-red-600 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
    >
      Delete
    </button>
  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </main>
  </>
);
}