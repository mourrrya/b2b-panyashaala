import {
  CONTACT_INFO,
  SCHEMA_CONFIG,
  SITE_CONFIG,
  SOCIAL_HANDLES as SOCIAL_HANDLES_CONST,
  SOCIAL_LINKS,
  VERIFICATION_TOKENS as VERIFICATION_TOKENS_CONST,
} from "@/lib/constants";
import { Metadata } from "next";
import React, { type ReactElement } from "react";

/**
 * Site Configuration Constants
 * Re-exported from centralized constants for backward compatibility
 */
export const SITE_URL = SITE_CONFIG.URL;
export const SITE_NAME = SITE_CONFIG.NAME;
export const SITE_DESCRIPTION = SITE_CONFIG.DESCRIPTION;
export const DEFAULT_OG_IMAGE = SITE_CONFIG.DEFAULT_OG_IMAGE;

// Social media and verification - re-exported for backward compatibility
export const SOCIAL_HANDLES = SOCIAL_HANDLES_CONST;
export const VERIFICATION_TOKENS = VERIFICATION_TOKENS_CONST;

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
    "@context": SCHEMA_CONFIG.CONTEXT,
    "@type": SCHEMA_CONFIG.TYPES.ORGANIZATION,
    name: SITE_NAME,
    url: SITE_URL,
    logo: getAbsoluteUrl(SITE_CONFIG.LOGO.TEXT),
    contactPoint: {
      "@type": SCHEMA_CONFIG.TYPES.CONTACT_POINT,
      contactType: SCHEMA_CONFIG.CONTACT_TYPE,
      email: CONTACT_INFO.EMAIL.SUPPORT,
      telephone: CONTACT_INFO.PHONE_DISPLAY,
    },
    sameAs: [
      SOCIAL_LINKS.twitter,
      SOCIAL_LINKS.linkedin,
      SOCIAL_LINKS.instagram,
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
    "@context": SCHEMA_CONFIG.CONTEXT,
    "@type": SCHEMA_CONFIG.TYPES.WEBSITE,
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": SCHEMA_CONFIG.TYPES.SEARCH_ACTION,
      target: {
        "@type": SCHEMA_CONFIG.TYPES.ENTRY_POINT,
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
    "@context": SCHEMA_CONFIG.CONTEXT,
    "@type": SCHEMA_CONFIG.TYPES.PRODUCT,
    name: product.name,
    description: `${product.description} INCI: ${product.inci}. Applications: ${product.applications}`,
    brand: {
      "@type": SCHEMA_CONFIG.TYPES.BRAND,
      name: SITE_NAME,
    },
    category: product.category,
    offers: {
      "@type": SCHEMA_CONFIG.TYPES.OFFER,
      availability: SCHEMA_CONFIG.AVAILABILITY,
      priceCurrency: SITE_CONFIG.CURRENCY,
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
  items: BreadcrumbItem[],
): BreadcrumbSchema {
  return {
    "@context": SCHEMA_CONFIG.CONTEXT,
    "@type": SCHEMA_CONFIG.TYPES.BREADCRUMB_LIST,
    itemListElement: items.map((item, index) => ({
      "@type": SCHEMA_CONFIG.TYPES.LIST_ITEM,
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
    "@context": SCHEMA_CONFIG.CONTEXT,
    "@type": SCHEMA_CONFIG.TYPES.ARTICLE,
    headline: article.headline,
    description: article.description,
    ...(article.image && { image: getAbsoluteUrl(article.image) }),
    ...(article.datePublished && { datePublished: article.datePublished }),
    ...(article.author && {
      author: {
        "@type": SCHEMA_CONFIG.TYPES.PERSON,
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
