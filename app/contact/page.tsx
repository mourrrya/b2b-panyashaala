"use client";

import { Turnstile } from "@/components/turnstile";
import { useContactForm } from "@/hooks/use-contact-form";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isSubmitted,
    submitError,
    handleTurnstileVerify,
    handleTurnstileError,
    handleTurnstileExpire,
    handleFieldChange,
  } = useContactForm();

  console.log(
    "Turnstile Site Key:",
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  );

  return (
    <>
      <main className="bg-texture min-h-screen">
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-600 mb-3">
                Get in Touch
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 mb-6">
                Contact Our Sourcing Team
              </h1>
              <p className="text-slate-600 mb-6">
                Have questions about our products or need custom sourcing
                solutions? Reach out to our team and we'll connect you with the
                right specialist.
              </p>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
                  <p className="text-slate-600">
                    <a
                      href="mailto:sales@example.com"
                      className="hover:text-emerald-700 transition-colors"
                    >
                      sales@example.com
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Phone</h3>
                  <p className="text-slate-600">
                    <a
                      href="tel:+1234567890"
                      className="hover:text-emerald-700 transition-colors"
                    >
                      +91 80764 50898
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Response Time
                  </h3>
                  <p className="text-slate-600">
                    We typically respond to inquiries within 24 business hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-3xl p-8 space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className={`w-full px-4 py-2 rounded-lg border bg-white/80 focus:border-emerald-600 focus:outline-none transition-colors ${
                      errors.name ? "border-red-500" : "border-slate-200"
                    }`}
                    {...register("name")}
                    onInput={() => handleFieldChange("name")}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className={`w-full px-4 py-2 rounded-lg border bg-white/80 focus:border-emerald-600 focus:outline-none transition-colors ${
                      errors.email ? "border-red-500" : "border-slate-200"
                    }`}
                    {...register("email")}
                    onInput={() => handleFieldChange("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Your company"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white/80 focus:border-emerald-600 focus:outline-none transition-colors"
                    {...register("company")}
                    onInput={() => handleFieldChange("company")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us about your sourcing needs..."
                    rows={4}
                    className={`w-full px-4 py-2 rounded-lg border bg-white/80 focus:border-emerald-600 focus:outline-none transition-colors resize-none ${
                      errors.message ? "border-red-500" : "border-slate-200"
                    }`}
                    {...register("message")}
                    onInput={() => handleFieldChange("message")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div>
                  <Turnstile
                    onVerify={handleTurnstileVerify}
                    onError={handleTurnstileError}
                    onExpire={handleTurnstileExpire}
                    size="compact"
                  />
                  {errors.turnstileToken && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.turnstileToken.message}
                    </p>
                  )}
                </div>

                {isSubmitted && (
                  <div className=" p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
                    ✓ Thank you! We'll be in touch soon.
                  </div>
                )}
                {submitError && (
                  <div className=" p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
                    ✕ {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
