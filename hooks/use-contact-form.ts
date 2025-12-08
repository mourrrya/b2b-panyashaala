"use client";

import {
  ContactFormDataSchema,
  sendEmail,
  verifyTurnstile,
  type ContactFormData,
} from "@/lib/email";
import type { Product } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

/**
 * Custom hook for managing contact form with Turnstile verification
 */
export function useContactForm(products: Product[] = []) {
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
    setValue,
    setError,
    getValues,
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormDataSchema),
    mode: "onBlur",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Main form submission handler
   */
  const onSubmit = useCallback(
    async (data: ContactFormData) => {
      try {
        setSubmitError("");

        const token = getValues("turnstileToken") || "";
        data.turnstileToken = token;

        // Verify Turnstile token first
        const isTokenValid = await verifyTurnstile(token);
        if (!isTokenValid) {
          setError("turnstileToken", {
            type: "manual",
            message: "Security verification failed. Please try again.",
          });
          return;
        }

        // Send email with verified data
        const emailSent = await sendEmail(data, products);
        if (!emailSent) {
          setSubmitError(
            "Failed to send your message. Please try again or contact us directly."
          );
          return;
        }

        // Success
        setIsSubmitted(true);
        reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } catch (error) {
        console.error("Form submission error:", error);
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    },
    [reset, getValues, setError]
  );

  /**
   * Handle Turnstile successful verification
   */
  const handleTurnstileVerify = useCallback(
    (token: string) => {
      setValue("turnstileToken", token);
      clearErrors("turnstileToken");
    },
    [setValue, clearErrors]
  );

  /**
   * Handle Turnstile verification error
   */
  const handleTurnstileError = useCallback(() => {
    setValue("turnstileToken", "");
    setError("turnstileToken", {
      type: "manual",
      message: "Security verification failed. Please try again.",
    });
  }, [setValue, setError]);

  /**
   * Handle Turnstile token expiration
   */
  const handleTurnstileExpire = useCallback(() => {
    setValue("turnstileToken", "");
    setError("turnstileToken", {
      type: "manual",
      message: "Security verification expired. Please verify again.",
    });
  }, [setValue, setError]);

  /**
   * Handle field input - clears error for that field while typing
   */
  const handleFieldChange = useCallback(
    (fieldName: keyof ContactFormData) => {
      clearErrors(fieldName);
    },
    [clearErrors]
  );

  /**
   * Reset form and error states
   */
  const resetForm = useCallback(() => {
    reset();
    setValue("turnstileToken", "");
    setSubmitError("");
    setIsSubmitted(false);
  }, [reset, setValue]);

  return {
    // Form methods from react-hook-form
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    reset: resetForm,
    clearErrors,
    setError,

    // Form state
    isSubmitting,
    isSubmitted,
    submitError,

    // Handlers
    handleTurnstileVerify,
    handleTurnstileError,
    handleTurnstileExpire,
    handleFieldChange,
    resetForm,
  };
}
