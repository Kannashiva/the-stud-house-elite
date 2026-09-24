"use client";

import AdminHeader from "../AdminHeader";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CirclePlus,
  Edit3,
  Eye,
  EyeOff,
  Package,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  reserved_stock?: number;
  image_url: string;
  is_active: boolean;
  is_new: boolean;
  is_best_seller: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } =
        await supabase
          .from("products")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (error) {
        console.error(
          "Failed to load products:",
          error
        );

        setLoading(false);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const handleToggleStatus =
    async (
      productId: number,
      currentStatus: boolean
    ) => {
      const response = await fetch(
        `/api/admin/products/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            is_active: !currentStatus,
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        console.error(
          "Failed to update product status:",
          result
        );

        return;
      }

      setProducts(
        (currentProducts) =>
          currentProducts.map(
            (product) =>
              product.id === productId
                ? {
                    ...product,
                    is_active:
                      result.product
                        .is_active,
                  }
                : product
          )
      );
    };

  const handleDeleteProduct =
    async (
      productId: number,
      productName: string
    ) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to permanently delete "${productName}"?`
        );

      if (!confirmed) return;

      const response = await fetch(
        `/api/admin/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        alert(
          result.error ||
            "Unable to delete this product."
        );

        return;
      }

      setProducts(
        (currentProducts) =>
          currentProducts.filter(
            (product) =>
              product.id !== productId
          )
      );
    };

  return (
    <>
      <AdminHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fffaf8] to-[#fff3ee] px-4 py-8 text-[#2a1f1d] sm:px-5 sm:py-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
                Admin Inventory
              </p>

              <h1 className="mt-2 font-serif text-4xl md:text-5xl">
                Products
              </h1>

              <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#b98b67] to-transparent" />

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55]">
                Manage products, pricing,
                stock availability and
                homepage visibility.
              </p>
            </div>

            <Link
              href="/admin/products/new"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2a1f1d] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(42,31,29,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98b67] md:w-auto"
            >
              <CirclePlus
                size={18}
              />
              Add Product
            </Link>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="rounded-[28px] border border-[#ead8cf]/70 bg-white/80 p-10 text-center shadow-sm">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ead8cf] border-t-[#b98b67]" />

              <p className="mt-4 text-sm text-[#6e5b55]">
                Loading products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[30px] border border-[#ead8cf]/70 bg-white/80 p-10 text-center shadow-[0_14px_40px_rgba(70,45,38,0.05)]">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                <Package size={27} />
              </div>

              <h2 className="mt-5 font-serif text-3xl">
                No Products Found
              </h2>

              <p className="mt-3 text-sm text-[#6e5b55]">
                Add your first jewellery
                product to get started.
              </p>

              <Link
                href="/admin/products/new"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#2a1f1d] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
              >
                <CirclePlus size={17} />
                Add Product
              </Link>
            </div>
          ) : (
            <>
              {/* MOBILE PRODUCT CARDS */}
              <div className="space-y-4 md:hidden">

                {products.map(
                  (product) => {
                    const stock =
                      Number(
                        product.stock || 0
                      );

                    const reserved =
                      Number(
                        product.reserved_stock ||
                          0
                      );

                    const availableStock =
                      Math.max(
                        stock -
                          reserved,
                        0
                      );

                    return (
                      <div
                        key={
                          product.id
                        }
                        className="rounded-[24px] border border-[#ead8cf]/70 bg-white/90 p-4 shadow-[0_12px_35px_rgba(70,45,38,0.05)]"
                      >
                        {/* Top */}
                        <div className="flex gap-4">

                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[18px] border border-[#ead8cf] bg-[#fffaf8]">
                            <Image
                              src={
                                product.image_url
                              }
                              alt={
                                product.name
                              }
                              width={90}
                              height={90}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 font-semibold leading-5">
                              {
                                product.name
                              }
                            </p>

                            <p className="mt-1 text-xs text-[#9b837a]">
                              ID #
                              {
                                product.id
                              }
                            </p>

                            <span className="mt-2 inline-block rounded-full bg-[#fff4ee] px-3 py-1 text-xs font-semibold text-[#8a6248]">
                              {
                                product.category
                              }
                            </span>
                          </div>
                        </div>

                        {/* Price + Stock */}
                        <div className="mt-5 grid grid-cols-2 gap-3">

                          <div className="rounded-[16px] bg-[#fffaf8] p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b837a]">
                              Price
                            </p>

                            <p className="mt-1 font-semibold">
                              ₹
                              {Number(
                                product.price
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                            {product.mrp >
                              product.price && (
                              <p className="mt-1 text-xs text-[#9f8c85] line-through">
                                ₹
                                {Number(
                                  product.mrp
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            )}
                          </div>

                          <div className="rounded-[16px] bg-[#fffaf8] p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b837a]">
                              Available Stock
                            </p>

                            <p
                              className={`mt-1 font-semibold ${
                                availableStock ===
                                0
                                  ? "text-red-600"
                                  : availableStock <=
                                    5
                                  ? "text-amber-600"
                                  : "text-[#2a1f1d]"
                              }`}
                            >
                              {
                                availableStock
                              }
                            </p>

                            {reserved >
                              0 && (
                              <p className="mt-1 text-[11px] text-[#9b837a]">
                                {
                                  reserved
                                }{" "}
                                reserved
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="mt-4 flex flex-wrap gap-2">

                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                              product.is_active
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                product.is_active
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />

                            {product.is_active
                              ? "Active"
                              : "Inactive"}
                          </span>

                          {product.is_new && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-700">
                              <Sparkles
                                size={12}
                              />
                              New
                            </span>
                          )}

                          {product.is_best_seller && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#f8efe7] px-3 py-1.5 text-[11px] font-semibold text-[#9a6b48]">
                              <Star
                                size={12}
                              />
                              Best Seller
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="mt-5 grid grid-cols-3 gap-2">

                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9b69f] bg-white px-3 py-2.5 text-xs font-semibold text-[#8a6248] transition hover:bg-[#b98b67] hover:text-white"
                          >
                            <Edit3
                              size={
                                14
                              }
                            />
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
                            className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2.5 text-xs font-semibold transition ${
                              product.is_active
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : "border-green-200 bg-green-50 text-green-700"
                            }`}
                          >
                            {product.is_active ? (
                              <EyeOff
                                size={
                                  14
                                }
                              />
                            ) : (
                              <Eye
                                size={
                                  14
                                }
                              />
                            )}

                            {product.is_active
                              ? "Hide"
                              : "Show"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteProduct(
                                product.id,
                                product.name
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
                          >
                            <Trash2
                              size={
                                14
                              }
                            />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden overflow-hidden rounded-[30px] border border-[#ead8cf]/70 bg-white/80 shadow-[0_16px_45px_rgba(70,45,38,0.06)] backdrop-blur-sm md:block">

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1120px] text-left text-sm">

                    <thead className="border-b border-[#ead8cf]/80 bg-[#fff7f2]">
                      <tr>
                        <th className="px-5 py-4">
                          Product
                        </th>

                        <th className="px-5 py-4">
                          Category
                        </th>

                        <th className="px-5 py-4">
                          Price
                        </th>

                        <th className="px-5 py-4">
                          Stock
                        </th>

                        <th className="px-5 py-4">
                          New
                        </th>

                        <th className="px-5 py-4">
                          Best Seller
                        </th>

                        <th className="px-5 py-4">
                          Status
                        </th>

                        <th className="px-5 py-4 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.map(
                        (product) => {
                          const stock =
                            Number(
                              product.stock ||
                                0
                            );

                          const reserved =
                            Number(
                              product.reserved_stock ||
                                0
                            );

                          const availableStock =
                            Math.max(
                              stock -
                                reserved,
                              0
                            );

                          return (
                            <tr
                              key={
                                product.id
                              }
                              className="border-b border-[#f0e4df] transition hover:bg-[#fffaf8] last:border-b-0"
                            >

                              <td className="px-5 py-4">
                                <div className="flex min-w-[240px] items-center gap-4">
                                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[16px] border border-[#ead8cf] bg-[#fffaf8]">
                                    <Image
                                      src={
                                        product.image_url
                                      }
                                      alt={
                                        product.name
                                      }
                                      width={
                                        70
                                      }
                                      height={
                                        70
                                      }
                                      className="h-full w-full object-cover"
                                    />
                                  </div>

                                  <div>
                                    <p className="font-semibold leading-5">
                                      {
                                        product.name
                                      }
                                    </p>

                                    <p className="mt-1 text-xs text-[#9b837a]">
                                      ID #
                                      {
                                        product.id
                                      }
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                <span className="rounded-full bg-[#fff4ee] px-3 py-1.5 text-xs font-semibold text-[#8a6248]">
                                  {
                                    product.category
                                  }
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <div>
                                  <span className="font-semibold">
                                    ₹
                                    {Number(
                                      product.price
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </span>

                                  {product.mrp >
                                    product.price && (
                                    <p className="mt-1 text-xs text-[#9f8c85] line-through">
                                      ₹
                                      {Number(
                                        product.mrp
                                      ).toLocaleString(
                                        "en-IN"
                                      )}
                                    </p>
                                  )}
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                <div>
                                  <p
                                    className={`font-semibold ${
                                      availableStock ===
                                      0
                                        ? "text-red-600"
                                        : availableStock <=
                                          5
                                        ? "text-amber-600"
                                        : "text-[#2a1f1d]"
                                    }`}
                                  >
                                    {
                                      availableStock
                                    }{" "}
                                    available
                                  </p>

                                  <p className="mt-1 text-xs text-[#9b837a]">
                                    Total:{" "}
                                    {stock}

                                    {reserved >
                                      0
                                      ? ` • Reserved: ${reserved}`
                                      : ""}
                                  </p>
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                    product.is_new
                                      ? "bg-blue-50 text-blue-700"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  {product.is_new && (
                                    <Sparkles
                                      size={
                                        13
                                      }
                                    />
                                  )}

                                  {product.is_new
                                    ? "Yes"
                                    : "No"}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                    product.is_best_seller
                                      ? "bg-[#f8efe7] text-[#9a6b48]"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  {product.is_best_seller && (
                                    <Star
                                      size={
                                        13
                                      }
                                    />
                                  )}

                                  {product.is_best_seller
                                    ? "Yes"
                                    : "No"}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                    product.is_active
                                      ? "bg-green-50 text-green-700"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  <span
                                    className={`h-2 w-2 rounded-full ${
                                      product.is_active
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }`}
                                  />

                                  {product.is_active
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex justify-end gap-2">

                                  <Link
                                    href={`/admin/products/${product.id}/edit`}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9b69f] bg-white text-[#8a6248] transition hover:bg-[#b98b67] hover:text-white"
                                    title="Edit"
                                  >
                                    <Edit3
                                      size={
                                        16
                                      }
                                    />
                                  </Link>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleToggleStatus(
                                        product.id,
                                        product.is_active
                                      )
                                    }
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                                      product.is_active
                                        ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white"
                                        : "border-green-200 bg-green-50 text-green-700 hover:bg-green-500 hover:text-white"
                                    }`}
                                    title={
                                      product.is_active
                                        ? "Deactivate"
                                        : "Activate"
                                    }
                                  >
                                    {product.is_active ? (
                                      <EyeOff
                                        size={
                                          16
                                        }
                                      />
                                    ) : (
                                      <Eye
                                        size={
                                          16
                                        }
                                      />
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteProduct(
                                        product.id,
                                        product.name
                                      )
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-500 hover:text-white"
                                    title="Delete"
                                  >
                                    <Trash2
                                      size={
                                        16
                                      }
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}