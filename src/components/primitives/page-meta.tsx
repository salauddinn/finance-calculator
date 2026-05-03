import { useEffect } from "react";

type PageMetaProps = {
  title: string;
  description: string;
  canonical?: string;
  jsonLd?: Record<string, unknown>;
};

function setOrCreate(selector: string, attr: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function PageMeta({ title, description, canonical, jsonLd }: PageMetaProps) {
  useEffect(() => {
    document.title = title;

    setOrCreate('meta[name="description"]', "content", description);
    setOrCreate('meta[property="og:title"]', "content", title);
    setOrCreate('meta[property="og:description"]', "content", description);
    setOrCreate('meta[name="twitter:title"]', "content", title);
    setOrCreate('meta[name="twitter:description"]', "content", description);

    const canonicalHref = canonical ?? window.location.href.split("?")[0];
    setOrCreate('meta[property="og:url"]', "content", canonicalHref);

    let linkEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.rel = "canonical";
      document.head.appendChild(linkEl);
    }
    linkEl.href = canonicalHref;

    // JSON-LD structured data
    let script = document.querySelector<HTMLScriptElement>('script[data-jsonld="page"]');
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.dataset.jsonld = "page";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }

    return () => {
      document.title = "India Money Toolkit";
      document.querySelector('script[data-jsonld="page"]')?.remove();
    };
  }, [title, description, canonical, jsonLd]);

  return null;
}
