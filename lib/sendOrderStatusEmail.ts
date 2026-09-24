import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type EmailType = "shipped" | "delivered";

export async function sendOrderStatusEmail(
  orderId: number,
  type: EmailType
) {
  const claimFunction =
    type === "shipped"
      ? "claim_shipped_email"
      : "claim_delivered_email";

  const resetFunction =
    type === "shipped"
      ? "reset_shipped_email"
      : "reset_delivered_email";

  const emailStatusColumn =
    type === "shipped"
      ? "shipped_email_status"
      : "delivered_email_status";

  const { data: claimed, error: claimError } =
    await supabaseAdmin.rpc(
      claimFunction,
      {
        p_order_id: orderId,
      }
    );

  if (claimError) {
    console.error(
      `${type} email claim failed:`,
      claimError
    );

    return {
      success: false,
      skipped: false,
    };
  }

  if (!claimed) {
    return {
      success: true,
      skipped: true,
    };
  }

  try {
    const {
      data: order,
      error: orderError,
    } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        customer_name,
        email,
        total_amount,
        order_status,
        courier_name,
        tracking_number,
        tracking_url
      `)
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error(
        orderError?.message ||
          "Order not found."
      );
    }

    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY is missing."
      );
    }

    if (!process.env.ORDER_FROM_EMAIL) {
      throw new Error(
        "ORDER_FROM_EMAIL is missing."
      );
    }

    const isShipped =
      type === "shipped";

    const subject = isShipped
      ? `Your Order #${order.id} Has Been Shipped ✨`
      : `Your Order #${order.id} Has Been Delivered ✨`;

    const heading = isShipped
      ? "Your Order is on the Way"
      : "Your Order Has Been Delivered";

    const mainMessage = isShipped
      ? "Great news! Your order has been shipped and is now on its way to you."
      : "Your order has been marked as delivered. We hope you love your jewellery.";

    const trackingSection =
      isShipped &&
      (
        order.courier_name ||
        order.tracking_number ||
        order.tracking_url
      )
        ? `
          <div
            style="
              margin-top:24px;
              padding:18px;
              background:#fffaf8;
              border:1px solid #ead8cf;
              border-radius:16px;
            "
          >
            <div
              style="
                font-size:12px;
                font-weight:700;
                color:#b98b67;
                text-transform:uppercase;
                letter-spacing:1px;
              "
            >
              Tracking Details
            </div>

            ${
              order.courier_name
                ? `
                  <p style="margin:12px 0 0;font-size:14px;color:#6e5b55;">
                    <strong>Courier:</strong>
                    ${escapeHtml(
                      order.courier_name
                    )}
                  </p>
                `
                : ""
            }

            ${
              order.tracking_number
                ? `
                  <p style="margin:8px 0 0;font-size:14px;color:#6e5b55;">
                    <strong>Tracking Number:</strong>
                    ${escapeHtml(
                      order.tracking_number
                    )}
                  </p>
                `
                : ""
            }

            ${
              order.tracking_url
                ? `
                  <div style="margin-top:18px;">
                    <a
                      href="${escapeHtml(
                        order.tracking_url
                      )}"
                      style="
                        display:inline-block;
                        padding:12px 20px;
                        background:#2a1f1d;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:999px;
                        font-size:13px;
                        font-weight:700;
                      "
                    >
                      Track Your Order
                    </a>
                  </div>
                `
                : ""
            }
          </div>
        `
        : "";

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${process.env.RESEND_API_KEY}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          from:
            process.env.ORDER_FROM_EMAIL,

          to: [order.email],

          subject,

          html: `
<!DOCTYPE html>
<html>
<body
  style="
    margin:0;
    padding:0;
    background:#fff7f3;
    font-family:Arial,Helvetica,sans-serif;
    color:#2a1f1d;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="padding:32px 16px;background:#fff7f3;"
  >
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width:620px;
            background:#ffffff;
            border:1px solid #ead8cf;
            border-radius:24px;
            overflow:hidden;
          "
        >

          <tr>
            <td
              align="center"
              style="
                background:#2a1f1d;
                padding:32px 24px;
              "
            >
              <img
  src="https://thestudhouseelite.co.in/images/logo/studlogo.png"
  alt="The Stud House Elite"
  width="84"
  height="84"
  style="
    display:block;
    width:84px;
    height:84px;
    object-fit:cover;
    border-radius:50%;
    margin:0 auto 16px;
    border:2px solid #e8c4ac;
  "
/>
              <div
                style="
                  color:#e8c4ac;
                  font-size:12px;
                  font-weight:700;
                  letter-spacing:3px;
                  text-transform:uppercase;
                "
              >
                The Stud House Elite
              </div>

              <h1
                style="
                  margin:12px 0 0;
                  color:#ffffff;
                  font-family:Georgia,serif;
                  font-size:30px;
                  font-weight:500;
                "
              >
                ${heading}
              </h1>

              <p
                style="
                  margin:10px 0 0;
                  color:#d8c9c3;
                  font-size:14px;
                "
              >
                Elegance in Every Detail
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px 28px;">

              <p
                style="
                  margin:0;
                  font-size:16px;
                  line-height:26px;
                "
              >
                Hi
                <strong>
                  ${escapeHtml(
                    order.customer_name
                  )}
                </strong>,
              </p>

              <p
                style="
                  margin:14px 0 0;
                  color:#6e5b55;
                  font-size:15px;
                  line-height:25px;
                "
              >
                ${mainMessage}
              </p>

              <div
                style="
                  margin-top:24px;
                  padding:18px;
                  border:1px solid #ead8cf;
                  background:#fffaf8;
                  border-radius:16px;
                "
              >
                <div
                  style="
                    font-size:12px;
                    color:#8b736b;
                    text-transform:uppercase;
                    letter-spacing:1px;
                  "
                >
                  Order Number
                </div>

                <div
                  style="
                    margin-top:6px;
                    font-size:21px;
                    font-weight:700;
                  "
                >
                  #${order.id}
                </div>
              </div>

              ${trackingSection}

              ${
                !isShipped
                  ? `
                    <p
                      style="
                        margin:26px 0 0;
                        color:#6e5b55;
                        font-size:14px;
                        line-height:24px;
                      "
                    >
                      Thank you for choosing
                      <strong style="color:#2a1f1d;">
                        The Stud House Elite
                      </strong>.
                      We hope your new jewellery adds a little more elegance to your day.
                    </p>
                  `
                  : `
                    <p
                      style="
                        margin:26px 0 0;
                        color:#6e5b55;
                        font-size:14px;
                        line-height:24px;
                      "
                    >
                      We’ll update your order status once the delivery is completed.
                    </p>
                  `
              }

              <p
                style="
                  margin:22px 0 0;
                  font-size:14px;
                  line-height:23px;
                "
              >
                With love,<br />
                <strong>
                  The Stud House Elite
                </strong>
              </p>

            </td>
          </tr>

          <tr>
            <td
              align="center"
              style="
                padding:22px;
                background:#fffaf8;
                border-top:1px solid #ead8cf;
                color:#8b736b;
                font-size:12px;
              "
            >
              This is an automated order update email.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `,
        }),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      console.error(
        `${type} email error:`,
        result
      );

      throw new Error(
        result?.message ||
          "Unable to send order status email."
      );
    }

    const { error: updateError } =
      await supabaseAdmin
        .from("orders")
        .update({
          [emailStatusColumn]:
            "sent",
        })
        .eq("id", orderId);

    if (updateError) {
      console.error(
        `${type} email status update failed:`,
        updateError
      );
    }

    console.log(
      `${type} email sent for order ${orderId}`
    );

    return {
      success: true,
      skipped: false,
    };
  } catch (error) {
    console.error(
      `${type} order email failed:`,
      error
    );

    await supabaseAdmin.rpc(
      resetFunction,
      {
        p_order_id: orderId,
      }
    );

    return {
      success: false,
      skipped: false,
    };
  }
}

function escapeHtml(
  value: string | null | undefined
) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}