"use client";

import {
  ContactFormDataSchema,
  isProduction,
  sendEmail,
  verifyTurnstile,
  type ContactFormData,
} from "@/lib/email";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

/**
 * Custom hook for managing contact form with Turnstile verification
 */
export function useContactForm() {
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    clearErrors,
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

        // Add Turnstile token to form data (only in production)
        if (isProduction()) {
          data.turnstileToken = turnstileToken;

          // Verify Turnstile token first
          const isTokenValid = await verifyTurnstile(turnstileToken);
          if (!isTokenValid) {
            setSubmitError("Security verification failed. Please try again.");
            return;
          }
        }

        // Send email with verified data
        const emailSent = await sendEmail(data);
        if (!emailSent) {
          setSubmitError(
            "Failed to send your message. Please try again or contact us directly."
          );
          return;
        }

        // Success
        setIsSubmitted(true);
        reset();
        setTurnstileToken("");

        // Hide success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } catch (error) {
        console.error("Form submission error:", error);
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    },
    [turnstileToken, reset]
  );

  /**
   * Handle Turnstile successful verification
   */
  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
    setSubmitError("");
  }, []);

  /**
   * Handle Turnstile verification error
   */
  const handleTurnstileError = useCallback(() => {
    setTurnstileToken("");
    setSubmitError("Security verification failed. Please try again.");
  }, []);

  /**
   * Handle Turnstile token expiration
   */
  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken("");
    setSubmitError("Security verification expired. Please verify again.");
  }, []);

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
    setTurnstileToken("");
    setSubmitError("");
    setIsSubmitted(false);
  }, [reset]);

  return {
    // Form methods from react-hook-form
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    errors,
    reset: resetForm,
    clearErrors,

    // Form state
    isSubmitting,
    isSubmitted,
    submitError,
    turnstileToken,
    isProduction: isProduction(),

    // Handlers
    handleTurnstileVerify,
    handleTurnstileError,
    handleTurnstileExpire,
    handleFieldChange,
    resetForm,
  };
}
