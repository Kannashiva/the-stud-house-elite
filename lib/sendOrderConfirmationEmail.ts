import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function sendOrderConfirmationEmail(
  orderId: number
) {
  const { data: claimed, error: claimError } =
    await supabaseAdmin.rpc(
      "claim_order_confirmation_email",
      {
        p_order_id: orderId,
      }
    );

  if (claimError) {
    console.error(
      "Email claim error:",
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
      .select(
        `
        id,
        customer_name,
        email,
        mobile,
        address,
        city,
        state,
        pincode,
        landmark,
        total_amount,
        payment_status,
        order_status,
        created_at
        `
      )
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error(
        orderError?.message ||
          "Order not found."
      );
    }

    const {
      data: items,
      error: itemsError,
    } = await supabaseAdmin
      .from("order_items")
      .select(
        `
        product_name,
        price,
        quantity
        `
      )
      .eq("order_id", orderId);

    if (itemsError) {
      throw new Error(
        itemsError.message
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

    const itemRows = (items || [])
      .map((item) => {
        const total =
          Number(item.price) *
          Number(item.quantity);

        return `
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid #eee0da;">
              <div style="font-size:15px;font-weight:600;color:#2a1f1d;">
                ${escapeHtml(item.product_name)}
              </div>

              <div style="margin-top:5px;font-size:13px;color:#7c6a63;">
                Qty: ${item.quantity}
                &nbsp; • &nbsp;
                ₹${Number(item.price).toLocaleString(
                  "en-IN"
                )} each
              </div>
            </td>

            <td
              align="right"
              style="padding:14px 0;border-bottom:1px solid #eee0da;font-size:15px;font-weight:600;color:#2a1f1d;white-space:nowrap;"
            >
              ₹${total.toLocaleString(
                "en-IN"
              )}
            </td>
          </tr>
        `;
      })
      .join("");

    const fullAddress = [
      order.address,
      order.landmark,
      order.city,
      order.state,
      order.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          from: process.env.ORDER_FROM_EMAIL,

          to: [order.email],

          subject: `Your Order #${order.id} is Confirmed ✨`,

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
                  Your Order is Confirmed
                </h1>

                <p
                  style="
                    margin:10px 0 0;
                    color:#d8c9c3;
                    font-size:14px;
                    line-height:22px;
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
                  Thank you for shopping with
                  <strong style="color:#2a1f1d;">
                    The Stud House Elite
                  </strong>.
                  Your payment has been received and your
                  order has been confirmed successfully.
                </p>

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    margin-top:26px;
                    background:#fffaf8;
                    border:1px solid #ead8cf;
                    border-radius:16px;
                  "
                >
                  <tr>
                    <td style="padding:18px;">
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
                          margin-top:5px;
                          font-size:20px;
                          font-weight:700;
                        "
                      >
                        #${order.id}
                      </div>
                    </td>

                    <td
                      align="right"
                      style="padding:18px;"
                    >
                      <div
                        style="
                          font-size:12px;
                          color:#8b736b;
                          text-transform:uppercase;
                          letter-spacing:1px;
                        "
                      >
                        Payment
                      </div>

                      <div
                        style="
                          margin-top:5px;
                          font-size:14px;
                          font-weight:700;
                          color:#2f7a4d;
                          text-transform:capitalize;
                        "
                      >
                        ${escapeHtml(
                          order.payment_status
                        )}
                      </div>
                    </td>
                  </tr>
                </table>

                <h2
                  style="
                    margin:28px 0 8px;
                    font-family:Georgia,serif;
                    font-size:21px;
                    font-weight:500;
                  "
                >
                  Order Summary
                </h2>

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                >
                  ${itemRows}
                </table>

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="margin-top:18px;"
                >
                  <tr>
                    <td
                      style="
                        font-size:16px;
                        font-weight:700;
                      "
                    >
                      Total Paid
                    </td>

                    <td
                      align="right"
                      style="
                        color:#b98b67;
                        font-family:Georgia,serif;
                        font-size:22px;
                        font-weight:700;
                      "
                    >
                      ₹${Number(
                        order.total_amount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>
                  </tr>
                </table>

                <div
                  style="
                    margin-top:28px;
                    padding:18px;
                    background:#fffaf8;
                    border-radius:16px;
                  "
                >
                  <div
                    style="
                      font-size:13px;
                      font-weight:700;
                      color:#b98b67;
                      text-transform:uppercase;
                      letter-spacing:1px;
                    "
                  >
                    Delivery Address
                  </div>

                  <p
                    style="
                      margin:8px 0 0;
                      color:#6e5b55;
                      font-size:14px;
                      line-height:23px;
                    "
                  >
                    ${escapeHtml(
                      fullAddress
                    )}
                  </p>
                </div>

                <p
                  style="
                    margin:28px 0 0;
                    color:#6e5b55;
                    font-size:14px;
                    line-height:24px;
                  "
                >
                  We’ll keep you updated as your order is
                  prepared and shipped.
                </p>

                <p
                  style="
                    margin:20px 0 0;
                    font-size:14px;
                    line-height:23px;
                  "
                >
                  With love,<br />
                  <strong>The Stud House Elite</strong>
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
                  line-height:20px;
                "
              >
                This is an automated order confirmation
                email. Please keep it for your records.
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
        "Resend email error:",
        result
      );

      throw new Error(
        result?.message ||
          "Unable to send confirmation email."
      );
    }

    const {
      error: updateError,
    } = await supabaseAdmin
      .from("orders")
      .update({
        confirmation_email_status:
          "sent",
      })
      .eq("id", orderId);

    if (updateError) {
      console.error(
        "Email status update failed:",
        updateError
      );
    }

    console.log(
      `Order confirmation email sent for order ${orderId}`
    );

    return {
      success: true,
      skipped: false,
    };
  } catch (error) {
    console.error(
      "Order confirmation email failed:",
      error
    );

    await supabaseAdmin.rpc(
      "reset_order_confirmation_email",
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