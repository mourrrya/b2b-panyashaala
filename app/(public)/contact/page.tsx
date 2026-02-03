"use client";

import { Turnstile } from "@/components/turnstile";
import { useContactForm } from "@/hooks/use-contact-form";
import { useStore } from "@/lib/store";
import { CheckCircle2, Package, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo } from "react";

export default function ContactPage() {
  const { basket, products, removeFromBasketOptimistic, clearBasket } =
    useStore();

  const basketProducts = useMemo(() => {
    return products.filter((product) => basket.includes(product.id));
  }, [products, basket]);

  const basketLength = basket.length;

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
  } = useContactForm(basketProducts);

  return (
    <>
      <main className="bg-texture min-h-screen">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
          {/* Two-column layout */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-emerald-600 mb-2 sm:mb-3">
              Get in Touch
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-4 sm:mb-6">
              Contact Our Sourcing Team
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Have questions about our products or need custom sourcing
              solutions? Reach out to our team and we'll connect you with the
              right specialist.
            </p>
          </div>
          <div className="flex gap-6 sm:gap-8 flex-col-reverse sm:flex-row">
            {/* Left Column - Contact Form */}
            <div className="flex-1">
              <div className="glass-effect rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 flex-1">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-emerald-600 to-teal-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                    Send us a message
                  </h2>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 sm:space-y-4"
                >
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1.5 sm:mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-sm sm:text-base bg-white/80 focus:border-emerald-600 focus:outline-none transition-colors ${
                        errors.name ? "border-red-500" : "border-slate-200"
                      }`}
                      {...register("name")}
                      onInput={() => handleFieldChange("name")}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1.5 sm:mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-sm sm:text-base bg-white/80 focus:border-emerald-600 focus:outline-none transition-colors ${
                        errors.email ? "border-red-500" : "border-slate-200"
                      }`}
                      {...register("email")}
                      onInput={() => handleFieldChange("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1.5 sm:mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Your company (Optional)"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-200 text-sm sm:text-base bg-white/80 focus:border-emerald-600 focus:outline-none transition-colors"
                      {...register("company")}
                      onInput={() => handleFieldChange("company")}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1.5 sm:mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      placeholder="Any specific requirements or questions? (Optional)"
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-200 text-sm sm:text-base bg-white/80 focus:border-emerald-600 focus:outline-none transition-colors resize-none"
                      {...register("message")}
                      onInput={() => handleFieldChange("message")}
                    />
                  </div>

                  <div>
                    <Turnstile
                      onVerify={handleTurnstileVerify}
                      onError={handleTurnstileError}
                      onExpire={handleTurnstileExpire}
                      size="compact"
                    />
                    {errors.turnstileToken && (
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600">
                        {errors.turnstileToken.message}
                      </p>
                    )}
                  </div>

                  {isSubmitted && (
                    <div className="p-3 sm:p-4 rounded-lg bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-700 text-xs sm:text-sm font-semibold">
                      ✓ Thank you! We'll be in touch soon.
                    </div>
                  )}
                  {submitError && (
                    <div className="p-3 sm:p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold">
                      ✕ {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-linear-to-r from-emerald-600 to-emerald-700 text-white text-sm sm:text-base font-semibold hover:from-emerald-700 hover:to-emerald-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Enquiry Summary */}
            <div className="sm:sticky sm:top-20 md:top-24 lg:top-28 h-fit">
              <div className="glass-effect rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-700 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-slate-900">
                        Enquiry Summary
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600">
                        {basketLength} product{basketLength !== 1 ? "s" : ""}{" "}
                        selected
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product List */}
                <div className="space-y-2 sm:space-y-3 max-h-72 sm:max-h-96 overflow-y-auto">
                  {basketProducts.length > 0 ? (
                    basketProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-linear-to-r hover:from-emerald-50 hover:to-transparent transition-all duration-200 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-800">
                              {product.category}
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 truncate">
                            INCI: {product.inci}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromBasketOptimistic(product.id)}
                          className="shrink-0 p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title="Remove from enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <Package className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-2 sm:mb-3" />
                      <p className="text-slate-500 text-xs sm:text-sm">
                        No products added yet
                      </p>
                      <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                        Browse our products to add items for enquiry
                      </p>
                    </div>
                  )}
                </div>

                {/* Clear All Button */}
                {basketProducts.length > 0 && (
                  <button
                    onClick={clearBasket}
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors text-xs sm:text-sm font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info - Moved to bottom */}
          <div className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-center">
            <div className="p-4 sm:p-0">
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-1.5 sm:mb-2">
                Email
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                <a
                  href="mailto:care@aukra.co.in"
                  className="hover:text-emerald-700 transition-colors"
                >
                  care@aukra.co.in
                </a>
              </p>
            </div>
            <div className="p-4 sm:p-0">
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-1.5 sm:mb-2">
                Phone
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                <a
                  href="tel:+918076450898"
                  className="hover:text-emerald-700 transition-colors"
                >
                  +91 80764 50898
                </a>
              </p>
            </div>
            <div className="p-4 sm:p-0">
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-1.5 sm:mb-2">
                Response Time
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                We typically respond to inquiries within 24 business hours.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
