import { API_CONFIG, CONTACT_INFO, EMAIL_DEFAULTS, ERROR_MESSAGES } from "@/lib/constants";
import { ProductWithVariantsImagesReviews } from "@/types/product";
import emailjs from "@emailjs/browser";
import { z } from "zod";
import { generateINCI } from "../productUtils";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
  emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
}

/**
 * Form data type for contact form submissions
 */
export const ContactFormDataSchema = z.object({
  name: z.string().min(2, ERROR_MESSAGES.VALIDATION.NAME_MIN_LENGTH),
  email: z.string().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  company: z.string().optional(),
  message: z.string().optional(),
  turnstileToken: z.string().min(1, ERROR_MESSAGES.VALIDATION.SECURITY_VERIFICATION_REQUIRED),
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
    const response = await fetch(API_CONFIG.ENDPOINTS.VERIFY_TURNSTILE, {
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
  products: ProductWithVariantsImagesReviews[] = [],
): Promise<boolean> => {
  try {
    if (
      !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    ) {
      console.log("EmailJS environment variables are not set.");
      return false;
    }

    const enquiredProductsText =
      products.length > 0
        ? products
            .map(
              (product) =>
                `- ${product.name} (${product.category}) - INCI: ${generateINCI(product)}`,
            )
            .join("\n")
        : EMAIL_DEFAULTS.NO_PRODUCTS_ENQUIRED;

    const templateParams = {
      to_name: CONTACT_INFO.RECIPIENT_NAME,
      from_name: data.name,
      from_email: data.email || EMAIL_DEFAULTS.NO_EMAIL_PROVIDED,
      sent_at: new Date().toISOString(),
      page_url: window.location.href,
      company: data.company || EMAIL_DEFAULTS.NOT_PROVIDED,
      message: data.message || EMAIL_DEFAULTS.NO_MESSAGE_PROVIDED,
      enquired_products: enquiredProductsText,
      product_count: products.length.toString(),

      turnstile_token: data.turnstileToken,
      reply_to: data.email,
    };

    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      templateParams,
    );

    return response.status === 200;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};
