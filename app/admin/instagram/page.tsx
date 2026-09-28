"use client";

import AdminHeader from "../AdminHeader";
import {
  useEffect,
  useState,
} from "react";
import {
  ExternalLink,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

type InstagramPost = {
  id: number;
  title: string | null;
  image_url: string;
  instagram_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export default function AdminInstagramPage() {
  const router =
    useRouter();

  const [posts, setPosts] =
    useState<InstagramPost[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    savingId,
    setSavingId,
  ] =
    useState<number | null>(
      null
    );

  const [
    adding,
    setAdding,
  ] = useState(false);

  const [
    uploadingImageId,
    setUploadingImageId,
  ] = useState<number | null>(
    null
  );

  const [
    message,
    setMessage,
  ] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response =
        await fetch(
          "/api/admin/instagram",
          {
            method: "GET",
            credentials:
              "include",
            cache:
              "no-store",
          }
        );

      const result =
        await response.json();

      if (
        response.status ===
        401
      ) {
        router.replace(
          "/admin/login"
        );
        return;
      }

      if (
        !response.ok ||
        !result.success
      ) {
        setMessage(
          result.error ||
            "Unable to load Instagram posts."
        );
        return;
      }

      setPosts(
        result.posts || []
      );
    } catch (error) {
      console.error(
        "Instagram loading error:",
        error
      );

      setMessage(
        "Unable to connect to the Instagram admin API."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const addPost =
    async () => {
      try {
        setAdding(true);
        setMessage("");

        const nextOrder =
          posts.length > 0
            ? Math.max(
                ...posts.map(
                  (post) =>
                    Number(
                      post.display_order ||
                        0
                    )
                )
              ) + 1
            : 1;

        const response =
          await fetch(
            "/api/admin/instagram",
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  title: "",
                  image_url:
                    "",
                  instagram_url:
                    "",
                  display_order:
                    nextOrder,
                  is_active:
                    true,
                }
              ),
            }
          );

        const result =
          await response.json();

        if (
          response.status ===
          401
        ) {
          router.replace(
            "/admin/login"
          );
          return;
        }

        if (
          !response.ok ||
          !result.success
        ) {
          setMessage(
            result.error ||
              "Unable to add Instagram post."
          );
          return;
        }

        setPosts(
          (current) => [
            ...current,
            result.post,
          ]
        );

        setMessage(
          "New Instagram card added. Add the image and Instagram link, then click Save."
        );
      } catch (error) {
        console.error(
          "Instagram add error:",
          error
        );

        setMessage(
          "Unable to add Instagram post."
        );
      } finally {
        setAdding(false);
      }
    };

  const updateLocalPost = (
    id: number,
    field:
      keyof InstagramPost,
    value:
      | string
      | number
      | boolean
  ) => {
    setPosts(
      (current) =>
        current.map(
          (post) =>
            post.id === id
              ? {
                  ...post,
                  [field]:
                    value,
                }
              : post
        )
    );
  };

  const handleImageUpload =
    async (
      postId: number,
      file: File
    ) => {
      try {
        setUploadingImageId(
          postId
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
              credentials:
                "include",
              body:
                uploadData,
            }
          );

        const result =
          await response.json();

        if (
          response.status ===
          401
        ) {
          router.replace(
            "/admin/login"
          );
          return;
        }

        if (
          !response.ok ||
          !result.success
        ) {
          setMessage(
            result.error ||
              "Unable to upload image."
          );
          return;
        }

        updateLocalPost(
          postId,
          "image_url",
          result.imageUrl
        );

        setMessage(
          "Image uploaded successfully. Add the Instagram link and click Save."
        );
      } catch (error) {
        console.error(
          "Instagram image upload error:",
          error
        );

        setMessage(
          "Unable to upload image."
        );
      } finally {
        setUploadingImageId(
          null
        );
      }
    };

  const savePost =
    async (
      post: InstagramPost
    ) => {
      if (
        !post.image_url.trim()
      ) {
        setMessage(
          "Please enter an image URL before saving."
        );
        return;
      }

      if (
        !post.instagram_url.trim()
      ) {
        setMessage(
          "Please enter the Instagram post or reel link before saving."
        );
        return;
      }

      try {
        setSavingId(
          post.id
        );
        setMessage("");

        const response =
          await fetch(
            "/api/admin/instagram",
            {
              method:
                "PUT",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  id:
                    post.id,
                  title:
                    post.title ||
                    "",
                  image_url:
                    post.image_url,
                  instagram_url:
                    post.instagram_url,
                  display_order:
                    Number(
                      post.display_order
                    ),
                  is_active:
                    post.is_active,
                }
              ),
            }
          );

        const result =
          await response.json();

        if (
          response.status ===
          401
        ) {
          router.replace(
            "/admin/login"
          );
          return;
        }

        if (
          !response.ok ||
          !result.success
        ) {
          setMessage(
            result.error ||
              "Unable to save Instagram post."
          );
          return;
        }

        setPosts(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                post.id
                  ? result.post
                  : item
            )
        );

        setMessage(
          "Instagram post saved successfully."
        );
      } catch (error) {
        console.error(
          "Instagram save error:",
          error
        );

        setMessage(
          "Unable to save Instagram post."
        );
      } finally {
        setSavingId(
          null
        );
      }
    };

  const deletePost =
    async (
      post: InstagramPost
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this Instagram post?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setMessage("");

        const response =
          await fetch(
            "/api/admin/instagram",
            {
              method:
                "DELETE",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  id:
                    post.id,
                }
              ),
            }
          );

        const result =
          await response.json();

        if (
          response.status ===
          401
        ) {
          router.replace(
            "/admin/login"
          );
          return;
        }

        if (
          !response.ok ||
          !result.success
        ) {
          setMessage(
            result.error ||
              "Unable to delete Instagram post."
          );
          return;
        }

        setPosts(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                post.id
            )
        );

        setMessage(
          "Instagram post deleted."
        );
      } catch (error) {
        console.error(
          "Instagram delete error:",
          error
        );

        setMessage(
          "Unable to delete Instagram post."
        );
      }
    };

  return (
    <>
      <AdminHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fffaf8] to-[#fff3ee] px-4 py-8 text-[#2a1f1d] sm:px-5 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 sm:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
                Social Gallery
              </p>

              <h1 className="mt-2 font-serif text-4xl md:text-5xl">
                Instagram Posts
              </h1>

              <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#b98b67] to-transparent" />

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55]">
                Manage the Instagram cards shown in the “Find Us on Instagram” section of the homepage.
              </p>
            </div>

            <button
              type="button"
              onClick={
                addPost
              }
              disabled={
                adding
              }
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2a1f1d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b98b67] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus
                size={16}
              />

              {adding
                ? "Adding..."
                : "Add Instagram Post"}
            </button>
          </div>

          {message && (
            <div className="mb-6 rounded-2xl border border-[#ead8cf] bg-white px-5 py-4 text-sm text-[#6e5b55] shadow-sm">
              {message}
            </div>
          )}

          {loading ? (
            <div className="rounded-[28px] border border-[#ead8cf]/70 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ead8cf] border-t-[#b98b67]" />

              <p className="mt-4 text-sm text-[#6e5b55]">
                Loading Instagram posts...
              </p>
            </div>
          ) : posts.length ===
            0 ? (
            <div className="rounded-[28px] border border-[#ead8cf]/70 bg-white p-10 text-center shadow-sm">
              <h2 className="font-serif text-2xl">
                No Instagram Posts
              </h2>

              <p className="mt-2 text-sm text-[#6e5b55]">
                Add your first Instagram post to show it on the homepage.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 2xl:grid-cols-2">
              {posts.map(
                (post) => (
                  <div
                    key={
                      post.id
                    }
                    className="overflow-hidden rounded-[28px] border border-[#ead8cf]/70 bg-white shadow-[0_14px_40px_rgba(70,45,38,0.05)]"
                  >
                    <div className="grid gap-0 lg:grid-cols-[230px_minmax(0,1fr)]">
                      <div className="flex items-start justify-center bg-[#f8efeb] p-5">
                        <div className="w-full max-w-[230px]">
                          {post.image_url ? (
                            <img
                              src={
                                post.image_url
                              }
                              alt={
                                post.title ||
                                "Instagram post"
                              }
                              className="aspect-square w-full rounded-[22px] object-cover shadow-sm"
                            />
                          ) : (
                            <div className="flex aspect-square w-full flex-col items-center justify-center rounded-[22px] border border-dashed border-[#d9b8a7] bg-[#fffaf8] px-5 text-center">
                              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#b98b67] shadow-sm">
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
                                    width="18"
                                    height="18"
                                    x="3"
                                    y="3"
                                    rx="2"
                                  />
                                  <circle
                                    cx="9"
                                    cy="9"
                                    r="2"
                                  />
                                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                </svg>
                              </div>

                              <p className="text-sm font-semibold text-[#8b736b]">
                                Image Preview
                              </p>

                              <p className="mt-1 text-xs leading-5 text-[#aa9187]">
                                Choose an image from the form
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 p-5 sm:p-6">
                        <div className="space-y-4">
                          <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8b736b]">
                              Title
                            </label>

                            <input
                              type="text"
                              value={
                                post.title ||
                                ""
                              }
                              onChange={(
                                e
                              ) =>
                                updateLocalPost(
                                  post.id,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="Example: New Jewellery Drop"
                              className="w-full rounded-2xl border border-[#dcc9bf] px-4 py-3 text-sm outline-none transition focus:border-[#b98b67]"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8b736b]">
                              Instagram Image
                            </label>

                            <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#d9b8a7] bg-[#fffaf8] px-4 py-4 text-center transition hover:border-[#b98b67] hover:bg-[#fff4ef]">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={
                                  uploadingImageId ===
                                  post.id
                                }
                                onChange={async (
                                  e
                                ) => {
                                  const file =
                                    e.target
                                      .files?.[0];

                                  if (!file) {
                                    return;
                                  }

                                  await handleImageUpload(
                                    post.id,
                                    file
                                  );

                                  e.target.value =
                                    "";
                                }}
                              />

                              <span className="text-sm font-semibold text-[#6e5b55]">
                                {uploadingImageId ===
                                post.id
                                  ? "Uploading image..."
                                  : post.image_url
                                  ? "Change Image"
                                  : "Choose Image"}
                              </span>
                            </label>

                            {post.image_url && (
                              <p className="mt-2 text-xs text-green-700">
                                Image uploaded successfully
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8b736b]">
                              Instagram Post / Reel Link
                            </label>

                            <input
                              type="text"
                              value={
                                post.instagram_url
                              }
                              onChange={(
                                e
                              ) =>
                                updateLocalPost(
                                  post.id,
                                  "instagram_url",
                                  e.target.value
                                )
                              }
                              placeholder="https://www.instagram.com/p/..."
                              className="w-full rounded-2xl border border-[#dcc9bf] px-4 py-3 text-sm outline-none transition focus:border-[#b98b67]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8b736b]">
                                Display Order
                              </label>

                              <input
                                type="number"
                                min="0"
                                value={
                                  post.display_order
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateLocalPost(
                                    post.id,
                                    "display_order",
                                    Number(
                                      e.target.value
                                    )
                                  )
                                }
                                className="w-full rounded-2xl border border-[#dcc9bf] px-4 py-3 text-sm outline-none transition focus:border-[#b98b67]"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8b736b]">
                                Status
                              </label>

                              <label className="flex h-[46px] cursor-pointer items-center gap-3 rounded-2xl border border-[#dcc9bf] px-4">
                                <input
                                  type="checkbox"
                                  checked={
                                    post.is_active
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    updateLocalPost(
                                      post.id,
                                      "is_active",
                                      e.target.checked
                                    )
                                  }
                                />

                                <span className="text-sm font-medium">
                                  Active
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              savePost(
                                post
                              )
                            }
                            disabled={
                              savingId ===
                                post.id ||
                              uploadingImageId ===
                                post.id
                            }
                            className="inline-flex items-center gap-2 rounded-full bg-[#2a1f1d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b98b67] disabled:opacity-60"
                          >
                            <Save
                              size={
                                15
                              }
                            />

                            {savingId ===
                            post.id
                              ? "Saving..."
                              : "Save"}
                          </button>

                          {post.instagram_url && (
                            <a
                              href={
                                post.instagram_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-[#ead8cf] px-5 py-2.5 text-sm font-semibold text-[#6e5b55] transition hover:border-[#b98b67] hover:text-[#b98b67]"
                            >
                              <ExternalLink
                                size={
                                  15
                                }
                              />
                              Open
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              deletePost(
                                post
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
                          >
                            <Trash2
                              size={
                                15
                              }
                            />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
