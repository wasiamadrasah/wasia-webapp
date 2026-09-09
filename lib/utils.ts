import { clsx, type ClassValue } from "clsx"
import sanitizeHtml from "sanitize-html"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeHTML(html: string): string {
  if (!html) return ""

  return sanitizeHtml(html, {
    allowedTags: [
      "a",
      "b",
      "blockquote",
      "br",
      "code",
      "div",
      "em",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "hr",
      "i",
      "img",
      "li",
      "ol",
      "p",
      "pre",
      "span",
      "strong",
      "table",
      "tbody",
      "td",
      "th",
      "thead",
      "tr",
      "u",
      "ul",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      // Allow class AND style on all elements so TipTap formatting survives
      "*": ["class", "style"],
    },
    // Whitelist only safe presentation CSS properties — no layout/position/script
    allowedStyles: {
      "*": {
        "text-align": [/^(left|right|center|justify)$/],
        "text-decoration": [/^(underline|line-through|none)$/],
        "font-weight": [/^(bold|normal|\d{3})$/],
        "font-style": [/^(italic|normal)$/],
        "line-height": [/^\d+(\.\d+)?(px|em|rem|%)?$/],
        "letter-spacing": [/^-?\d+(\.\d+)?(px|em|rem)$/],
        color: [/^(#[0-9a-fA-F]{3,8}|rgb\(\d+,\s*\d+,\s*\d+\)|rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)|[a-z]+)$/],
        "background-color": [/^(#[0-9a-fA-F]{3,8}|rgb\(\d+,\s*\d+,\s*\d+\)|rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)|[a-z]+)$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    allowedSchemesAppliedToAttributes: ["href", "src"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
    },
  })
}
