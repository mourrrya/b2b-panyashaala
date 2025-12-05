import emailjs from "@emailjs/browser";
import { z } from "zod";

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
) {
  emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
}

/**
 * Determine if we're in production mode based on environment
 */
export const isProduction = () => {
  return process.env.NODE_ENV === "production";
};

/**
 * Form data type for contact form submissions
 */
export const ContactFormDataSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  turnstileToken: isProduction()
    ? z.string().min(1, "Please complete the security verification")
    : z.string().optional(),
});

export type ContactFormData = z.infer<typeof ContactFormDataSchema>;

/**
 * Verify Turnstile token with the backend API
 * Skips verification entirely in local development
 * @param token - The token returned by Turnstile widget
 * @returns true if verification succeeds or if in local dev, false otherwise
 */
export async function verifyTurnstile(token: string): Promise<boolean> {
  // Skip Turnstile completely in local development
  if (!isProduction()) {
    return true;
  }

  try {
    const response = await fetch("/api/verify-turnstile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      console.error("Turnstile verification failed:", response.statusText);
      return false;
    }

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Error verifying Turnstile token:", error);
    return false;
  }
}

export const sendEmail = async (data: ContactFormData): Promise<boolean> => {
  try {
    if (
      !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    ) {
      throw new Error("EmailJS configuration is missing");
    }

    const templateParams = {
      to_name: "Sai Enterprise",
      from_name: data.name,
      from_email: data.email || "No email provided",
      sent_at: new Date().toISOString(),
      page_url: window.location.href,
      company: data.company || "Not provided",
      message: data.message || "No message provided",

      turnstile_token: data.turnstileToken,
      reply_to: data.email,
    };

    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return response.status === 200;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};
