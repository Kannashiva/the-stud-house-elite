import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmationEmail } from "../../../lib/sendOrderConfirmationEmail";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const formatPaymentMode = (
  method: string | null | undefined
) => {
  if (!method) return null;

  const normalized =
    method.toLowerCase();

  const labels: Record<string, string> = {
    upi: "UPI",
    card: "Card",
    netbanking: "Net Banking",
    wallet: "Wallet",
    emi: "EMI",
    cardless_emi: "Cardless EMI",
    paylater: "Pay Later",
    bank_transfer: "Bank Transfer",
  };

  return (
    labels[normalized] ||
    normalized
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
  );
};

export async function POST(request: Request) {
  try {
    const keyId =
      process.env.RAZORPAY_KEY_ID;

    const keySecret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay is not configured yet.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();

    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing payment details.",
        },
        { status: 400 }
      );
    }

    const generatedSignature = createHmac(
      "sha256",
      keySecret
    )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment verification failed.",
        },
        { status: 400 }
      );
    }

    let paymentMode: string | null = null;

    try {
      const basicAuth = Buffer.from(
        `${keyId}:${keySecret}`
      ).toString("base64");

      const paymentResponse = await fetch(
        `https://api.razorpay.com/v1/payments/${encodeURIComponent(
          razorpay_payment_id
        )}`,
        {
          method: "GET",
          headers: {
            Authorization:
              `Basic ${basicAuth}`,
          },
          cache: "no-store",
        }
      );

      if (paymentResponse.ok) {
        const paymentDetails =
          await paymentResponse.json();

        paymentMode =
          formatPaymentMode(
            paymentDetails?.method
          );
      } else {
        console.error(
          "Unable to fetch Razorpay payment method:",
          await paymentResponse.text()
        );
      }
    } catch (paymentDetailsError) {
      console.error(
        "Razorpay payment details error:",
        paymentDetailsError
      );
    }

    const {
      error: finalizeError,
    } = await supabaseAdmin.rpc(
      "finalize_paid_order",
      {
        p_order_id: Number(orderId),
        p_razorpay_order_id:
          razorpay_order_id,
        p_razorpay_payment_id:
          razorpay_payment_id,
      }
    );

    if (finalizeError) {
      console.error(
        "Order finalization failed:",
        finalizeError
      );

      return NextResponse.json(
        {
          success: false,
          error: finalizeError.message,
        },
        { status: 500 }
      );
    }

    if (paymentMode) {
      const {
        error: paymentModeError,
      } = await supabaseAdmin
        .from("orders")
        .update({
          payment_mode: paymentMode,
        })
        .eq("id", Number(orderId));

      if (paymentModeError) {
        console.error(
          "Unable to save payment mode:",
          paymentModeError
        );
      }
    }

    const emailResult =
      await sendOrderConfirmationEmail(
        Number(orderId)
      );

    if (!emailResult.success) {
      console.error(
        "Order finalized but confirmation email could not be sent."
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Payment verified successfully.",
      payment_mode: paymentMode,
    });
  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to verify payment.",
      },
      { status: 500 }
    );
  }
}
