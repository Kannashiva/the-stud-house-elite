"use client";

import AdminHeader from "../AdminHeader";
import { useEffect, useState } from "react";
import {
  ExternalLink,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

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
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const loadPosts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("instagram_posts")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("Unable to load Instagram posts.");
      setLoading(false);
      return;
    }

    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const addPost = async () => {
    setMessage("");

    const { data, error } = await supabase
      .from("instagram_posts")
      .insert({
        title: "",
        image_url: "",
        instagram_url: "",
        display_order: posts.length + 1,
        is_active: true,
      })
      .select()
      .single();

    if (error || !data) {
      setMessage("Unable to add Instagram post.");
      return;
    }

    setPosts((current) => [...current, data]);
  };

  const updateLocalPost = (
    id: number,
    field: keyof InstagramPost,
    value: string | number | boolean
  ) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? {
              ...post,
              [field]: value,
            }
          : post
      )
    );
  };

  const savePost = async (post: InstagramPost) => {
    setSavingId(post.id);
    setMessage("");

    const { error } = await supabase
      .from("instagram_posts")
      .update({
        title: post.title,
        image_url: post.image_url,
        instagram_url: post.instagram_url,
        display_order: post.display_order,
        is_active: post.is_active,
      })
      .eq("id", post.id);

    if (error) {
      console.error(error);
      setMessage("Unable to save Instagram post.");
      setSavingId(null);
      return;
    }

    setMessage("Instagram post saved successfully.");
    setSavingId(null);
  };

  const deletePost = async (post: InstagramPost) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Instagram post?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("instagram_posts")
      .delete()
      .eq("id", post.id);

    if (error) {
      console.error(error);
      setMessage("Unable to delete Instagram post.");
      return;
    }

    setPosts((current) =>
      current.filter((item) => item.id !== post.id)
    );
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
                Manage the Instagram cards shown in the “Find Us on
                Instagram” section of the homepage.
              </p>
            </div>

            <button
              type="button"
              onClick={addPost}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2a1f1d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
            >
              <Plus size={16} />
              Add Instagram Post
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
          ) : posts.length === 0 ? (
            <div className="rounded-[28px] border border-[#ead8cf]/70 bg-white p-10 text-center shadow-sm">
              <h2 className="font-serif text-2xl">
                No Instagram Posts
              </h2>

              <p className="mt-2 text-sm text-[#6e5b55]">
                Add your first Instagram post to show it on the homepage.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="overflow-hidden rounded-[28px] border border-[#ead8cf]/70 bg-white shadow-[0_14px_40px_rgba(70,45,38,0.05)]"
                >
                  <div className="grid gap-0 sm:grid-cols-[180px_1fr]">
                    <div className="bg-[#f8efeb]">
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt={post.title || "Instagram post"}
                          className="aspect-square h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square h-full min-h-[180px] items-center justify-center px-5 text-center text-sm text-[#9b837a]">
                          Add an image URL
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8b736b]">
                            Title
                          </label>

                          <input
                            type="text"
                            value={post.title || ""}
                            onChange={(e) =>
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
                            Image URL
                          </label>

                          <input
                            type="text"
                            value={post.image_url}
                            onChange={(e) =>
                              updateLocalPost(
                                post.id,
                                "image_url",
                                e.target.value
                              )
                            }
                            placeholder="https://..."
                            className="w-full rounded-2xl border border-[#dcc9bf] px-4 py-3 text-sm outline-none transition focus:border-[#b98b67]"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8b736b]">
                            Instagram Post / Reel Link
                          </label>

                          <input
                            type="text"
                            value={post.instagram_url}
                            onChange={(e) =>
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
                              value={post.display_order}
                              onChange={(e) =>
                                updateLocalPost(
                                  post.id,
                                  "display_order",
                                  Number(e.target.value)
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
                                checked={post.is_active}
                                onChange={(e) =>
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
                          onClick={() => savePost(post)}
                          disabled={savingId === post.id}
                          className="inline-flex items-center gap-2 rounded-full bg-[#2a1f1d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b98b67] disabled:opacity-60"
                        >
                          <Save size={15} />

                          {savingId === post.id
                            ? "Saving..."
                            : "Save"}
                        </button>

                        {post.instagram_url && (
                          <a
                            href={post.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-[#ead8cf] px-5 py-2.5 text-sm font-semibold text-[#6e5b55] transition hover:border-[#b98b67] hover:text-[#b98b67]"
                          >
                            <ExternalLink size={15} />
                            Open
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => deletePost(post)}
                          className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}