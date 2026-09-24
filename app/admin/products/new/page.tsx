"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeIndianRupee,
  CheckCircle2,
  ImagePlus,
  PackagePlus,
  Save,
  Sparkles,
  Star,
  UploadCloud,
} from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      category: "Studs",
      price: "",
      mrp: "",
      image_url: "",
      description: "",
      stock: "",
      is_new: false,
      is_best_seller: false,
      is_active: true,
    });

  const [message, setMessage] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const inputClass =
    "w-full rounded-[16px] border border-[#dcc9bf] bg-white/90 px-4 py-3.5 text-sm outline-none transition placeholder:text-[#aa9389] focus:border-[#b98b67] focus:ring-4 focus:ring-[#b98b67]/10";

  const handleSubmit = async () => {
    setMessage("");

    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.mrp ||
      !formData.image_url ||
      !formData.description ||
      !formData.stock
    ) {
      setMessage(
        "Please fill in all required fields."
      );

      return;
    }

    setSaving(true);

    const response = await fetch(
      "/api/admin/products",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          category:
            formData.category,
          price: Number(
            formData.price
          ),
          mrp: Number(
            formData.mrp
          ),
          image_url:
            formData.image_url,
          description:
            formData.description,
          stock: Number(
            formData.stock
          ),
          is_new: formData.is_new,
          is_best_seller:
            formData.is_best_seller,
          is_active:
            formData.is_active,
        }),
      }
    );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      setMessage(
        result.error ||
          "Unable to add product."
      );

      setSaving(false);
      return;
    }

    router.push(
      "/admin/products"
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fffaf8] to-[#fff3ee] px-5 py-10 text-[#2a1f1d]">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/products"
            )
          }
          className="group inline-flex items-center gap-2 text-sm font-semibold text-[#8a6248] transition hover:text-[#b98b67]"
        >
          <ArrowLeft
            size={17}
            className="transition group-hover:-translate-x-1"
          />
          Back to Products
        </button>

        <div className="mb-8 mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
            Admin Inventory
          </p>

          <h1 className="mt-2 font-serif text-4xl md:text-5xl">
            Add Product
          </h1>

          <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#b98b67] to-transparent" />

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55]">
            Add a new jewellery product,
            set pricing and stock, upload
            the product image, and control
            store visibility.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* Form */}
          <section className="rounded-[30px] border border-[#ead8cf]/70 bg-white/80 p-6 shadow-[0_14px_40px_rgba(70,45,38,0.06)] backdrop-blur-sm md:p-8">

            <div className="grid gap-5 md:grid-cols-2">

              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Product Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name:
                        e.target.value,
                    })
                  }
                  placeholder="Example: Pearl Bloom Studs"
                  className={
                    inputClass
                  }
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <select
                  value={
                    formData.category
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category:
                        e.target.value,
                    })
                  }
                  className={
                    inputClass
                  }
                >
                  <option value="Studs">
                    Studs
                  </option>

                  <option value="Earrings">
                    Earrings
                  </option>

                  <option value="Necklaces">
                    Necklaces
                  </option>

                  <option value="Bracelets">
                    Bracelets
                  </option>
                </select>
              </div>

              {/* Stock */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock:
                        e.target.value,
                    })
                  }
                  placeholder="10"
                  className={
                    inputClass
                  }
                />
              </div>

              {/* Selling Price */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Selling Price
                </label>

                <div className="relative">
                  <BadgeIndianRupee
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b98b67]"
                  />

                  <input
                    type="number"
                    min="0"
                    value={
                      formData.price
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price:
                          e.target.value,
                      })
                    }
                    placeholder="799"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* MRP */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  MRP
                </label>

                <div className="relative">
                  <BadgeIndianRupee
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b98b67]"
                  />

                  <input
                    type="number"
                    min="0"
                    value={
                      formData.mrp
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mrp:
                          e.target.value,
                      })
                    }
                    placeholder="999"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Product Image */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Product Image
                </label>

                <div className="rounded-[22px] border border-dashed border-[#d8bba8] bg-[#fffaf8] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f4e3da] text-[#b98b67]">
                      <UploadCloud
                        size={20}
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        Upload product image
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#8b736b]">
                        Choose a clear,
                        high-quality jewellery
                        image.
                      </p>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (
                          e
                        ) => {
                          const file =
                            e.target
                              .files?.[0];

                          if (!file)
                            return;

                          setUploadingImage(
                            true
                          );

                          setMessage("");

                          const uploadData =
                            new FormData();

                          uploadData.append(
                            "file",
                            file
                          );

                          const response =
                            await fetch(
                              "/api/admin/upload-product-image",
                              {
                                method:
                                  "POST",
                                body:
                                  uploadData,
                              }
                            );

                          const result =
                            await response.json();

                          if (
                            !response.ok ||
                            !result.success
                          ) {
                            setMessage(
                              result.error ||
                                "Unable to upload image."
                            );

                            setUploadingImage(
                              false
                            );

                            return;
                          }

                          setFormData({
                            ...formData,
                            image_url:
                              result.imageUrl,
                          });

                          setUploadingImage(
                            false
                          );
                        }}
                        className="mt-4 block w-full text-sm text-[#6e5b55] file:mr-4 file:rounded-full file:border-0 file:bg-[#2a1f1d] file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[#b98b67]"
                      />

                      {uploadingImage && (
                        <p className="mt-3 text-sm text-[#8b736b]">
                          Uploading image...
                        </p>
                      )}
                    </div>
                  </div>

                  {formData.image_url && (
                    <div className="mt-5 border-t border-[#ead8cf] pt-5">
                      <div className="flex items-start gap-4">
                        <img
                          src={
                            formData.image_url
                          }
                          alt="Product preview"
                          className="h-32 w-32 rounded-[18px] border border-[#ead8cf] object-cover"
                        />

                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                            <CheckCircle2
                              size={14}
                            />
                            Image uploaded
                          </div>

                          <p className="mt-3 text-xs leading-5 text-[#8b736b]">
                            This image will be
                            used across the
                            storefront and
                            product page.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Description
                </label>

                <textarea
                  value={
                    formData.description
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description:
                        e.target.value,
                    })
                  }
                  rows={5}
                  placeholder="Enter product description..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="mt-7 grid gap-4 sm:grid-cols-3">

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-[18px] border p-4 transition ${
                  formData.is_new
                    ? "border-blue-200 bg-blue-50/70"
                    : "border-[#ead8cf] bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    formData.is_new
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_new:
                        e.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-[#b98b67]"
                />

                <Sparkles
                  size={17}
                  className="text-[#b98b67]"
                />

                <span className="text-sm font-medium">
                  New Arrival
                </span>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-[18px] border p-4 transition ${
                  formData.is_best_seller
                    ? "border-[#e3c8b8] bg-[#fff4ee]"
                    : "border-[#ead8cf] bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    formData.is_best_seller
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_best_seller:
                        e.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-[#b98b67]"
                />

                <Star
                  size={17}
                  className="text-[#b98b67]"
                />

                <span className="text-sm font-medium">
                  Best Seller
                </span>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-[18px] border p-4 transition ${
                  formData.is_active
                    ? "border-green-200 bg-green-50/60"
                    : "border-red-200 bg-red-50/60"
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    formData.is_active
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_active:
                        e.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-[#b98b67]"
                />

                <CheckCircle2
                  size={17}
                  className={
                    formData.is_active
                      ? "text-green-600"
                      : "text-red-500"
                  }
                />

                <span className="text-sm font-medium">
                  Active
                </span>
              </label>
            </div>

            {message && (
              <div className="mt-6 rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 text-center">
                <p className="text-sm text-red-600">
                  {message}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={
                  handleSubmit
                }
                disabled={
                  saving ||
                  uploadingImage
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2a1f1d] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(42,31,29,0.14)] transition hover:-translate-y-0.5 hover:bg-[#b98b67] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {saving
                  ? "Saving..."
                  : "Add Product"}
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/admin/products"
                  )
                }
                className="rounded-full border border-[#b98b67] bg-white px-7 py-3.5 text-sm font-semibold transition hover:bg-[#b98b67] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </section>

          {/* Side Guide */}
          <aside className="h-fit rounded-[28px] bg-gradient-to-br from-[#241916] via-[#2b1d19] to-[#1f1512] p-6 text-white shadow-[0_20px_55px_rgba(42,31,29,0.16)] lg:sticky lg:top-28">

            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[#e8c4ac]">
              <PackagePlus
                size={22}
              />
            </div>

            <h2 className="mt-5 font-serif text-2xl">
              Product Setup
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/60">
              Add complete product
              information so the item is
              ready for customers as soon
              as it becomes active.
            </p>

            <div className="mt-6 space-y-4 border-t border-white/10 pt-5 text-sm">

              <div>
                <p className="font-semibold text-[#e8c4ac]">
                  Pricing
                </p>

                <p className="mt-1 text-xs leading-5 text-white/50">
                  Selling price should be
                  less than or equal to
                  MRP.
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#e8c4ac]">
                  Stock
                </p>

                <p className="mt-1 text-xs leading-5 text-white/50">
                  Enter the physical units
                  currently available.
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#e8c4ac]">
                  Visibility
                </p>

                <p className="mt-1 text-xs leading-5 text-white/50">
                  Keep Active enabled when
                  the product should be
                  visible to customers.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}