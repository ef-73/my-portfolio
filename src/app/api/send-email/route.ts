import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Configure your email service here
// Using Gmail or another SMTP service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email, message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "ethan.f07w@gmail.com",
      subject: "Portfolio Contact Form Submission",
      html: `
        <h2>New Message from Portfolio</h2>
        <p><strong>From:</strong> ${email || "(No email provided)"}</p>
        <hr />
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
      replyTo: email || undefined,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
}
