import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not set");
      return NextResponse.json({ success: true });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SnapCut AI <onboarding@resend.dev>",
        to: ["faisalagentai@gmail.com"],
        reply_to: email,
        subject: `[SnapCut Contact] ${subject}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2 style="color:#0e0d0c;margin-bottom:24px;">New Contact Message — SnapCut AI</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <tr><td style="padding:8px 0;color:#6b6966;font-size:14px;width:100px;">From</td><td style="padding:8px 0;color:#0e0d0c;font-size:14px;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#6b6966;font-size:14px;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${email}" style="color:#1a6b4a;">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#6b6966;font-size:14px;">Subject</td><td style="padding:8px 0;color:#0e0d0c;font-size:14px;">${subject}</td></tr>
            </table>
            <div style="background:#f2f0ec;border-radius:12px;padding:20px;margin-bottom:24px;">
              <p style="color:#6b6966;font-size:12px;margin:0 0 8px;text-transform:uppercase;">Message</p>
              <p style="color:#0e0d0c;font-size:15px;line-height:1.65;margin:0;white-space:pre-wrap;">${message}</p>
            </div>
            <p style="color:#9b9895;font-size:12px;">Reply to this email to respond to ${name} at ${email}</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error:", res.status, errText);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ success: true });
  }
}
