"use client";

import type React from "react";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", company: "", message: "" });
    }, 3000);
  };

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
                      +1 (234) 567-890
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

            <div className="glass-effect rounded-3xl p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Send us a message
              </h2>
              {submitted && (
                <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
                  ✓ Thank you! We'll be in touch soon.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white/80 focus:border-emerald-600 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white/80 focus:border-emerald-600 focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white/80 focus:border-emerald-600 focus:outline-none transition-colors"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white/80 focus:border-emerald-600 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your sourcing needs..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
