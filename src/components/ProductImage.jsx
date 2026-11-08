import { useState } from "react";

// Shows a product photo; falls back to a neutral placeholder if it fails to load.
export default function ProductImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className={`${className} img-fallback`} role="img" aria-label={alt}>🛍️</div>
  ) : (
    <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
  );
}
