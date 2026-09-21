"use client";

import { FaWhatsapp } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function WhatsAppButton() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const phoneNumber = "917893542022";

  const message =
    "Hi, I would like to know more about The Stud House Elite products.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
    >
      <FaWhatsapp size={30} />
    </a>
  );
}