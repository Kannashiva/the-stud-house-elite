"use client";

import { usePathname } from "next/navigation";
import InstagramButton from "./InstagramButton";
import WhatsAppButton from "./WhatsAppButton";

export default function FloatingButtons() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      id="floating-social-buttons"
      className="fixed bottom-5 right-4 z-40 flex flex-col gap-4 sm:bottom-6 sm:right-6"
    >
      <InstagramButton />
      <WhatsAppButton />
    </div>
  );
}