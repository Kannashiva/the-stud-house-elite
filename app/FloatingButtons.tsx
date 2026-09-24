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
    <>
      <InstagramButton />
      <WhatsAppButton />
    </>
  );
}