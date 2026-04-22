import nodemailer from 'nodemailer';

interface BookingEmailData {
  booking_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  tour_title: string;
  tour_destination: string;
  travel_date: string;
  num_travelers: number;
  total_amount: number;
  payment_id: string;
  order_id: string;
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function bookingConfirmationHtml(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed!</title>
</head>
<body style="margin:0;padding:0;background:#f4f1eb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#1B3A2D;padding:36px 40px;text-align:center;">
      <h1 style="margin:0;color:#C89033;font-size:26px;font-weight:600;letter-spacing:1px;">
        Touryaari Travels
      </h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Your journey begins here</p>
    </div>

    <!-- Green success bar -->
    <div style="background:#2D7D46;padding:16px 40px;text-align:center;">
      <p style="margin:0;color:#fff;font-weight:600;font-size:16px;">✅ Booking Confirmed!</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">
      <p style="color:#2d4a3e;font-size:16px;margin-bottom:28px;">
        Hi <strong>${data.customer_name}</strong>, your tour booking is confirmed. Here are your details:
      </p>

      <!-- Booking Summary -->
      <div style="background:#f9f7f4;border:1px solid #e8e2d9;border-radius:8px;padding:24px;margin-bottom:28px;">
        <h3 style="margin:0 0 16px;color:#1B3A2D;font-size:16px;">Booking Summary</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:14px;width:40%;">Tour</td>
            <td style="padding:8px 0;color:#1B3A2D;font-size:14px;font-weight:600;">${data.tour_title}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:14px;">Destination</td>
            <td style="padding:8px 0;color:#1B3A2D;font-size:14px;">${data.tour_destination}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:14px;">Travel Date</td>
            <td style="padding:8px 0;color:#1B3A2D;font-size:14px;">${data.travel_date}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:14px;">Travelers</td>
            <td style="padding:8px 0;color:#1B3A2D;font-size:14px;">${data.num_travelers} person(s)</td>
          </tr>
          <tr style="border-top:1px solid #e8e2d9;">
            <td style="padding:12px 0 4px;color:#1B3A2D;font-size:15px;font-weight:700;">Total Paid</td>
            <td style="padding:12px 0 4px;color:#C89033;font-size:18px;font-weight:700;">₹${Number(data.total_amount).toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </div>

      <!-- Payment Info -->
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:18px 24px;margin-bottom:28px;">
        <p style="margin:0;color:#166534;font-size:13px;"><strong>Payment ID:</strong> ${data.payment_id}</p>
        <p style="margin:6px 0 0;color:#166534;font-size:13px;"><strong>Order ID:</strong> ${data.order_id}</p>
        <p style="margin:6px 0 0;color:#166534;font-size:13px;"><strong>Booking Ref:</strong> #${data.booking_id.slice(0,8).toUpperCase()}</p>
      </div>

      <!-- Next Steps -->
      <h3 style="color:#1B3A2D;font-size:15px;margin-bottom:12px;">What happens next?</h3>
      <ul style="color:#4b5563;font-size:14px;line-height:2;padding-left:20px;">
        <li>Our team will contact you within 24 hours to confirm itinerary details.</li>
        <li>You'll receive a detailed travel document before your departure.</li>
        <li>For any queries, WhatsApp or call us anytime.</li>
      </ul>

      <!-- CTA -->
      <div style="margin-top:32px;text-align:center;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://touryaaritravels.com'}/account/bookings"
           style="background:#1B3A2D;color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:14px;font-weight:600;display:inline-block;">
          View My Bookings
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f9f7f4;border-top:1px solid #e8e2d9;padding:24px 40px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">
        © ${new Date().getFullYear()} Touryaari Travels · ${process.env.NEXT_PUBLIC_SITE_URL || 'touryaaritravels.com'}
      </p>
      <p style="margin:6px 0 0;color:#9ca3af;font-size:12px;">
        Questions? Reply to this email or WhatsApp us.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function adminNotificationHtml(data: BookingEmailData): string {
  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
  <h2 style="color:#1B3A2D;">🎉 New Booking Received</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f7f4;">Customer</td>
        <td style="padding:8px;border:1px solid #ddd;">${data.customer_name}</td></tr>
    <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f7f4;">Email</td>
        <td style="padding:8px;border:1px solid #ddd;">${data.customer_email || '—'}</td></tr>
    <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f7f4;">Phone</td>
        <td style="padding:8px;border:1px solid #ddd;">${data.customer_phone}</td></tr>
    <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f7f4;">Tour</td>
        <td style="padding:8px;border:1px solid #ddd;">${data.tour_title}</td></tr>
    <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f7f4;">Date</td>
        <td style="padding:8px;border:1px solid #ddd;">${data.travel_date}</td></tr>
    <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f7f4;">Travelers</td>
        <td style="padding:8px;border:1px solid #ddd;">${data.num_travelers}</td></tr>
    <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f7f4;">Amount</td>
        <td style="padding:8px;border:1px solid #ddd;color:#C89033;font-weight:bold;">₹${Number(data.total_amount).toLocaleString('en-IN')}</td></tr>
    <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f7f4;">Payment ID</td>
        <td style="padding:8px;border:1px solid #ddd;">${data.payment_id}</td></tr>
    <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f7f4;">Booking ID</td>
        <td style="padding:8px;border:1px solid #ddd;">${data.booking_id}</td></tr>
  </table>
  <p style="margin-top:20px;font-size:13px;color:#666;">
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://touryaaritravels.com'}/admin/bookings/${data.booking_id}">
      View in Admin Panel →
    </a>
  </p>
</div>`;
}

export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<void> {
  const transport = createTransport();
  if (!transport) {
    console.warn('Email not configured — skipping booking confirmation email. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local');
    return;
  }

  const from = `Touryaari Travels <${process.env.SMTP_USER}>`;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

  // Send to customer
  if (data.customer_email) {
    await transport.sendMail({
      from,
      to: data.customer_email,
      subject: `Booking Confirmed! Your trip to ${data.tour_destination} — #${data.booking_id.slice(0,8).toUpperCase()}`,
      html: bookingConfirmationHtml(data),
    });
  }

  // Send to admin
  if (adminEmail) {
    await transport.sendMail({
      from,
      to: adminEmail,
      subject: `[New Booking] ${data.customer_name} → ${data.tour_title} — ₹${Number(data.total_amount).toLocaleString('en-IN')}`,
      html: adminNotificationHtml(data),
    });
  }
}
