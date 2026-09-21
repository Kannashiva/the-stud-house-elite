"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
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

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

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
      setMessage("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        mrp: Number(formData.mrp),
        image_url: formData.image_url,
        description: formData.description,
        stock: Number(formData.stock),
        is_new: formData.is_new,
        is_best_seller: formData.is_best_seller,
        is_active: formData.is_active,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      setMessage(result.error || "Unable to add product.");
      setSaving(false);
      return;
    }

    router.push("/admin/products");
  };

  return (
    <main className="min-h-screen bg-[#fffaf8] px-5 py-10 text-[#2a1f1d]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
            Admin
          </p>

          <h1 className="mt-2 font-serif text-4xl">
            Add Product
          </h1>

          <p className="mt-3 text-[#6e5b55]">
            Add a new jewellery product to the store.
          </p>
        </div>

        <div className="rounded-[28px] border border-[#ead8cf] bg-white p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
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
                    name: e.target.value,
                  })
                }
                placeholder="Example: Pearl Bloom Studs"
                className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none focus:border-[#b98b67]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Category
              </label>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none focus:border-[#b98b67]"
              >
                <option value="Studs">Studs</option>
                <option value="Earrings">Earrings</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Bracelets">Bracelets</option>
              </select>
            </div>

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
                    stock: e.target.value,
                  })
                }
                placeholder="10"
                className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none focus:border-[#b98b67]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Selling Price
              </label>

              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
                placeholder="799"
                className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none focus:border-[#b98b67]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                MRP
              </label>

              <input
                type="number"
                min="0"
                value={formData.mrp}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mrp: e.target.value,
                  })
                }
                placeholder="999"
                className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none focus:border-[#b98b67]"
              />
            </div>

            <div className="md:col-span-2">
  <label className="mb-2 block text-sm font-semibold">
    Product Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const file = e.target.files?.[0];

      if (!file) return;

      setUploadingImage(true);
      setMessage("");

      const uploadData = new FormData();
      uploadData.append("file", file);

      const response = await fetch(
        "/api/admin/upload-product-image",
        {
          method: "POST",
          body: uploadData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(
          result.error || "Unable to upload image."
        );
        setUploadingImage(false);
        return;
      }

      setFormData({
        ...formData,
        image_url: result.imageUrl,
      });

      setUploadingImage(false);
    }}
    className="w-full rounded-[16px] border border-[#dcc9bf] bg-white px-4 py-3 text-sm outline-none"
  />

  {uploadingImage && (
    <p className="mt-2 text-sm text-[#8b736b]">
      Uploading image...
    </p>
  )}

  {formData.image_url && (
    <div className="mt-4">
      <p className="mb-2 text-xs text-[#8b736b]">
        Image uploaded successfully
      </p>

      <img
        src={formData.image_url}
        alt="Product preview"
        className="h-40 w-40 rounded-2xl object-cover"
      />
    </div>
  )}
</div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">
                Description
              </label>

              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                rows={5}
                placeholder="Enter product description..."
                className="w-full resize-none rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none focus:border-[#b98b67]"
              />
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#ead8cf] p-4">
              <input
                type="checkbox"
                checked={formData.is_new}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_new: e.target.checked,
                  })
                }
              />

              <span className="text-sm font-medium">
                New Arrival
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#ead8cf] p-4">
              <input
                type="checkbox"
                checked={formData.is_best_seller}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_best_seller: e.target.checked,
                  })
                }
              />

              <span className="text-sm font-medium">
                Best Seller
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#ead8cf] p-4">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.checked,
                  })
                }
              />

              <span className="text-sm font-medium">
                Active
              </span>
            </label>
          </div>

          {message && (
            <p className="mt-5 text-center text-sm text-red-600">
              {message}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-full bg-[#2a1f1d] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b98b67] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Add Product"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="rounded-full border border-[#b98b67] px-7 py-3.5 text-sm font-semibold transition hover:bg-[#b98b67] hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}