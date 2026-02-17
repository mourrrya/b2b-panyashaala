"use client";

import { submitUrlToIndexNow, submitUrlsToIndexNow } from "@/lib/indexnow";
import { useState } from "react";

export default function IndexNowTestPage() {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await submitUrlToIndexNow(url);
      setResult(response);
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMultiple = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const urlList = urls.split("\n").filter((u) => u.trim());
      const response = await submitUrlsToIndexNow(urlList);
      setResult(response);
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold">IndexNow Test Page</h1>

      {/* Key File Verification */}
      <div className="mb-8 rounded-lg border border-gray-300 bg-gray-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Step 1: Verify Key File</h2>
        <p className="mb-4 text-sm text-gray-600">First, verify your API key file is accessible:</p>
        <a
          href="/8e5b0ca2cb494414b4390325fbef2647.txt"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Check Key File
        </a>
        <p className="mt-2 text-xs text-gray-500">
          Should display: 8e5b0ca2cb494414b4390325fbef2647
        </p>
      </div>

      {/* Single URL Submission */}
      <div className="mb-8 rounded-lg border border-gray-300 p-6">
        <h2 className="mb-4 text-xl font-semibold">Step 2: Submit Single URL</h2>
        <form onSubmit={handleSubmitSingle} className="space-y-4">
          <div>
            <label htmlFor="url" className="mb-2 block text-sm font-medium">
              URL to Submit
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-domain.com/products/example"
              className="w-full rounded border border-gray-300 px-4 py-2"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Must be a URL from your domain</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit to IndexNow"}
          </button>
        </form>
      </div>

      {/* Multiple URLs Submission */}
      <div className="mb-8 rounded-lg border border-gray-300 p-6">
        <h2 className="mb-4 text-xl font-semibold">Step 3: Submit Multiple URLs</h2>
        <form onSubmit={handleSubmitMultiple} className="space-y-4">
          <div>
            <label htmlFor="urls" className="mb-2 block text-sm font-medium">
              URLs to Submit (one per line)
            </label>
            <textarea
              id="urls"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder={`https://your-domain.com/products/product-1\nhttps://your-domain.com/products/product-2\nhttps://your-domain.com/about`}
              className="w-full rounded border border-gray-300 px-4 py-2"
              rows={6}
              required
            />
            <p className="mt-1 text-xs text-gray-500">Enter one URL per line (max 10,000 URLs)</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit Multiple URLs"}
          </button>
        </form>
      </div>

      {/* Results Display */}
      {result && (
        <div className="mb-8 rounded-lg border border-gray-300 p-6">
          <h2 className="mb-4 text-xl font-semibold">Result</h2>
          <div
            className={`rounded p-4 ${
              result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Response Codes Reference */}
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Response Codes</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex">
            <span className="font-mono font-bold text-green-600 w-12">200</span>
            <span>URL submitted successfully</span>
          </li>
          <li className="flex">
            <span className="font-mono font-bold text-orange-600 w-12">400</span>
            <span>Bad request (invalid format)</span>
          </li>
          <li className="flex">
            <span className="font-mono font-bold text-red-600 w-12">403</span>
            <span>Forbidden (key not valid)</span>
          </li>
          <li className="flex">
            <span className="font-mono font-bold text-red-600 w-12">422</span>
            <span>Unprocessable (URLs don't belong to host)</span>
          </li>
          <li className="flex">
            <span className="font-mono font-bold text-red-600 w-12">429</span>
            <span>Too many requests (spam protection)</span>
          </li>
        </ul>
      </div>

      {/* Environment Info */}
      <div className="mt-8 rounded-lg border border-yellow-300 bg-yellow-50 p-6">
        <h3 className="mb-2 font-semibold text-yellow-800">⚠️ Important Notes</h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-yellow-700">
          <li>This page is for testing purposes only</li>
          <li>Remove or protect this page in production</li>
          <li>Set NEXT_PUBLIC_SITE_URL in your environment variables</li>
          <li>Verify in Bing Webmaster Tools after submission</li>
          <li>Allow 24-48 hours for search engines to process</li>
        </ul>
      </div>
    </div>
  );
}
