import emailjs from "@emailjs/browser";
import { z } from "zod";
import type { Product } from "./store";

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
) {
  emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
}

/**
 * Form data type for contact form submissions
 */
export const ContactFormDataSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().optional(),
  turnstileToken: z
    .string()
    .min(1, "Please complete the security verification"),
});

export type ContactFormData = z.infer<typeof ContactFormDataSchema>;

/**
 * Verify Turnstile token with the backend API
 * Skips verification entirely in local development
 * @param token - The token returned by Turnstile widget
 * @returns true if verification succeeds or if in local dev, false otherwise
 */
export async function verifyTurnstile(token: string): Promise<boolean> {
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

export const sendEmail = async (
  data: ContactFormData,
  products: Product[] = []
): Promise<boolean> => {
  try {
    if (
      !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    ) {
      throw new Error("EmailJS configuration is missing");
    }

    const enquiredProductsText =
      products.length > 0
        ? products
            .map(
              (product) =>
                `- ${product.name} (${product.category}) - INCI: ${product.inci}`
            )
            .join("\n")
        : "No products enquired";

    const templateParams = {
      to_name: "Sai Enterprise",
      from_name: data.name,
      from_email: data.email || "No email provided",
      sent_at: new Date().toISOString(),
      page_url: window.location.href,
      company: data.company || "Not provided",
      message: data.message || "No message provided",
      enquired_products: enquiredProductsText,
      product_count: products.length.toString(),

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
