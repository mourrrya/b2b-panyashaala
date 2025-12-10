import { Metadata } from "next";
import React, { type ReactElement } from "react";

/**
 * Site Configuration Constants
 */
export const SITE_URL = "https://aukra.co.in"; // Change to production domain
export const SITE_NAME = "Aukra Chem Essentials LLP";
export const SITE_DESCRIPTION =
  "Professional B2B supplier of natural cosmetic ingredients including essential oils, carrier oils, botanical extracts, and hydrosols for formulators and manufacturers.";
export const DEFAULT_OG_IMAGE = "/og-image-default.jpg";

// Social media and verification
export const SOCIAL_HANDLES = {
  twitter: "cosmeticsupply",
  linkedin: "aukra-chemical-essentials",
  instagram: "aukra.co.in",
};

export const VERIFICATION_TOKENS = {
  googleSiteVerification: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  bingMsvalidate: "YOUR_BING_VERIFICATION_TOKEN",
};

/**
 * Metadata builder function
 * Accepts custom parameters and returns a complete Metadata object
 */
export function createMetadata({
  title,
  description,
  canonical,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  keywords = [],
  noIndex = false,
}: {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  type?: "website" | "product" | "article";
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const absoluteUrl = getAbsoluteUrl(canonical);

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    alternates: {
      canonical: absoluteUrl,
    },
    openGraph: {
      type: type as "website" | "article",
      title,
      description,
      url: absoluteUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: getAbsoluteUrl(image),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: SOCIAL_HANDLES.twitter,
      creator: SOCIAL_HANDLES.twitter,
      title,
      description,
      images: [getAbsoluteUrl(image)],
    },
  };
}

/**
 * JSON-LD Schema builders
 */

interface Organization {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  contactPoint: {
    "@type": string;
    contactType: string;
    email: string;
    telephone?: string;
  };
  sameAs: string[];
}

export function createOrganizationSchema(): Organization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: getAbsoluteUrl("/logo-text.svg"),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "anil@aukra.co.in",
      telephone: "+91 80764 50898",
    },
    sameAs: [
      `https://twitter.com/${SOCIAL_HANDLES.twitter}`,
      `https://linkedin.com/company/${SOCIAL_HANDLES.linkedin}`,
      `https://instagram.com/${SOCIAL_HANDLES.instagram}`,
    ],
  };
}

interface Website {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  potentialAction: {
    "@type": string;
    target: {
      "@type": string;
      urlTemplate: string;
    };
    "query-input": string;
  };
}

export function createWebsiteSchema(): Website {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

interface Product {
  id: number | string;
  name: string;
  description: string;
  inci: string;
  category: string;
  applications: string;
}

interface ProductSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  brand: {
    "@type": string;
    name: string;
  };
  category: string;
  offers: {
    "@type": string;
    availability: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    "@type": string;
    ratingValue: number;
    reviewCount: number;
  };
}

export function createProductSchema(product: Product): ProductSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: `${product.description} INCI: ${product.inci}. Applications: ${product.applications}`,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
  };
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbSchema {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item: string;
  }>;
}

export function createBreadcrumbSchema(
  items: BreadcrumbItem[]
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  };
}

interface Article {
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  author?: string;
}

interface ArticleSchema {
  "@context": string;
  "@type": string;
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  author?: {
    "@type": string;
    name: string;
  };
}

export function createArticleSchema(article: Article): ArticleSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    ...(article.image && { image: getAbsoluteUrl(article.image) }),
    ...(article.datePublished && { datePublished: article.datePublished }),
    ...(article.author && {
      author: {
        "@type": "Person",
        name: article.author,
      },
    }),
  };
}

/**
 * Helper Functions
 */

/**
 * Generate URL-friendly slug from and ID
 */
export function generateProductSlug(id: number | string): string {
  return `${id}`;
}

/**
 * Combine SITE_URL with relative path
 */
export function getAbsoluteUrl(path: string): string {
  if (path.startsWith("http")) {
    return path;
  }
  return new URL(path, SITE_URL).toString();
}

/**
 * JSON-LD Component for rendering structured data
 */
export function JsonLd({
  schema,
}: {
  schema:
    | Organization
    | Website
    | ProductSchema
    | BreadcrumbSchema
    | ArticleSchema
    | Record<string, unknown>;
}): ReactElement {
  return React.createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(schema),
    },
  });
}
