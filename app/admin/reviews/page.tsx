"use client";

import AdminHeader from "../AdminHeader";
import {
  useEffect,
  useState,
} from "react";
import {
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

type CustomerReview = {
  id: number;
  customer_name: string;
  city: string | null;
  review_text: string;
  rating: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export default function AdminReviewsPage() {
  const router =
    useRouter();

  const [
    reviews,
    setReviews,
  ] = useState<
    CustomerReview[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    adding,
    setAdding,
  ] = useState(false);

  const [
    savingId,
    setSavingId,
  ] =
    useState<number | null>(
      null
    );

  const [
    message,
    setMessage,
  ] = useState("");

  const loadReviews =
    async () => {
      try {
        setLoading(true);
        setMessage("");

        const response =
          await fetch(
            "/api/admin/reviews",
            {
              method:
                "GET",
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
              "Unable to load customer reviews."
          );
          return;
        }

        setReviews(
          result.reviews ||
            []
        );
      } catch (error) {
        console.error(
          "Reviews loading error:",
          error
        );

        setMessage(
          "Unable to connect to the reviews admin API."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadReviews();
  }, []);

  const addReview =
    async () => {
      try {
        setAdding(true);
        setMessage("");

        const nextOrder =
          reviews.length > 0
            ? Math.max(
                ...reviews.map(
                  (review) =>
                    Number(
                      review.display_order ||
                        0
                    )
                )
              ) + 1
            : 1;

        const response =
          await fetch(
            "/api/admin/reviews",
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
                  customer_name:
                    "New Customer",
                  city: "",
                  review_text:
                    "Add customer review here.",
                  rating: 5,
                  display_order:
                    nextOrder,
                  is_active:
                    false,
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
              "Unable to add review."
          );
          return;
        }

        setReviews(
          (current) => [
            ...current,
            result.review,
          ]
        );

        setMessage(
          "New review added. Update the details and click Save."
        );
      } catch (error) {
        console.error(
          "Add review error:",
          error
        );

        setMessage(
          "Unable to add review."
        );
      } finally {
        setAdding(false);
      }
    };

  const updateLocalReview = (
    id: number,
    field:
      keyof CustomerReview,
    value:
      | string
      | number
      | boolean
  ) => {
    setReviews(
      (current) =>
        current.map(
          (review) =>
            review.id === id
              ? {
                  ...review,
                  [field]:
                    value,
                }
              : review
        )
    );
  };

  const saveReview =
    async (
      review:
        CustomerReview
    ) => {
      if (
        !review.customer_name.trim()
      ) {
        setMessage(
          "Please enter the customer name."
        );
        return;
      }

      if (
        !review.review_text.trim()
      ) {
        setMessage(
          "Please enter the review text."
        );
        return;
      }

      try {
        setSavingId(
          review.id
        );
        setMessage("");

        const response =
          await fetch(
            "/api/admin/reviews",
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
                    review.id,
                  customer_name:
                    review.customer_name,
                  city:
                    review.city ||
                    "",
                  review_text:
                    review.review_text,
                  rating:
                    Number(
                      review.rating
                    ),
                  display_order:
                    Number(
                      review.display_order
                    ),
                  is_active:
                    review.is_active,
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
              "Unable to save review."
          );
          return;
        }

        setReviews(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                review.id
                  ? result.review
                  : item
            )
        );

        setMessage(
          "Customer review saved successfully."
        );
      } catch (error) {
        console.error(
          "Save review error:",
          error
        );

        setMessage(
          "Unable to save review."
        );
      } finally {
        setSavingId(
          null
        );
      }
    };

  const deleteReview =
    async (
      review:
        CustomerReview
    ) => {
      const confirmed =
        window.confirm(
          `Delete review from "${review.customer_name}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setMessage("");

        const response =
          await fetch(
            "/api/admin/reviews",
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
                    review.id,
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
              "Unable to delete review."
          );
          return;
        }

        setReviews(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                review.id
            )
        );

        setMessage(
          "Customer review deleted."
        );
      } catch (error) {
        console.error(
          "Delete review error:",
          error
        );

        setMessage(
          "Unable to delete review."
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
                Customer Love
              </p>

              <h1 className="mt-2 font-serif text-4xl md:text-5xl">
                Customer Reviews
              </h1>

              <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#b98b67] to-transparent" />

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55]">
                Manage the customer reviews shown in the “What Our Customers Say” section of the homepage.
              </p>
            </div>

            <button
              type="button"
              onClick={
                addReview
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
                : "Add Review"}
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
                Loading customer reviews...
              </p>
            </div>
          ) : reviews.length ===
            0 ? (
            <div className="rounded-[28px] border border-[#ead8cf]/70 bg-white p-10 text-center shadow-sm">
              <h2 className="font-serif text-2xl">
                No Customer Reviews
              </h2>

              <p className="mt-2 text-sm text-[#6e5b55]">
                Add your first review to show it on the homepage.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {reviews.map(
                (review) => (
                  <div
                    key={
                      review.id
                    }
                    className="rounded-[28px] border border-[#ead8cf]/70 bg-white p-5 shadow-[0_14px_40px_rgba(70,45,38,0.05)] sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b98b67]">
                          Review #{review.id}
                        </p>

                        <div className="mt-2 text-sm tracking-[0.16em] text-[#b98b67]">
                          {"★".repeat(
                            review.rating
                          )}
                          <span className="text-[#dcc9bf]">
                            {"★".repeat(
                              5 -
                                review.rating
                            )}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          review.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {review.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8b736b]">
                          Customer Name
                        </label>

                        <input
                          type="text"
                          value={
                            review.customer_name
                          }
                          onChange={(
                            e
                          ) =>
                            updateLocalReview(
                              review.id,
                              "customer_name",
                              e.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-[#dcc9bf] px-4 py-3 text-sm outline-none transition focus:border-[#b98b67]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8b736b]">
                          City
                        </label>

                        <input
                          type="text"
                          value={
                            review.city ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            updateLocalReview(
                              review.id,
                              "city",
                              e.target.value
                            )
                          }
                          placeholder="Hyderabad"
                          className="w-full rounded-2xl border border-[#dcc9bf] px-4 py-3 text-sm outline-none transition focus:border-[#b98b67]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8b736b]">
                          Review
                        </label>

                        <textarea
                          rows={5}
                          value={
                            review.review_text
                          }
                          onChange={(
                            e
                          ) =>
                            updateLocalReview(
                              review.id,
                              "review_text",
                              e.target.value
                            )
                          }
                          className="w-full resize-none rounded-2xl border border-[#dcc9bf] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#b98b67]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8b736b]">
                          Rating
                        </label>

                        <select
                          value={
                            review.rating
                          }
                          onChange={(
                            e
                          ) =>
                            updateLocalReview(
                              review.id,
                              "rating",
                              Number(
                                e.target.value
                              )
                            )
                          }
                          className="w-full rounded-2xl border border-[#dcc9bf] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b98b67]"
                        >
                          <option value={5}>
                            5 Stars
                          </option>
                          <option value={4}>
                            4 Stars
                          </option>
                          <option value={3}>
                            3 Stars
                          </option>
                          <option value={2}>
                            2 Stars
                          </option>
                          <option value={1}>
                            1 Star
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8b736b]">
                          Display Order
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={
                            review.display_order
                          }
                          onChange={(
                            e
                          ) =>
                            updateLocalReview(
                              review.id,
                              "display_order",
                              Number(
                                e.target.value
                              )
                            )
                          }
                          className="w-full rounded-2xl border border-[#dcc9bf] px-4 py-3 text-sm outline-none transition focus:border-[#b98b67]"
                        />
                      </div>
                    </div>

                    <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-[#dcc9bf] bg-[#fffaf8] px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          review.is_active
                        }
                        onChange={(
                          e
                        ) =>
                          updateLocalReview(
                            review.id,
                            "is_active",
                            e.target.checked
                          )
                        }
                      />

                      <span className="text-sm font-medium">
                        Show this review on the homepage
                      </span>
                    </label>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          saveReview(
                            review
                          )
                        }
                        disabled={
                          savingId ===
                          review.id
                        }
                        className="inline-flex items-center gap-2 rounded-full bg-[#2a1f1d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b98b67] disabled:opacity-60"
                      >
                        <Save
                          size={15}
                        />

                        {savingId ===
                        review.id
                          ? "Saving..."
                          : "Save"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteReview(
                            review
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
                      >
                        <Trash2
                          size={15}
                        />
                        Delete
                      </button>
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
