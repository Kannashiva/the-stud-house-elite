"use client";

export default function InstagramButton() {
    
  return (
    <a
      href="https://www.instagram.com/thestudhouseelite.co"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-[0_10px_28px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:scale-105"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          ry="5"
        />

        <circle
          cx="12"
          cy="12"
          r="4"
        />

        <circle
          cx="17.5"
          cy="6.5"
          r="1"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    </a>
  );
}