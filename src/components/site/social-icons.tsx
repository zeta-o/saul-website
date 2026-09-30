import { SOCIAL } from "@/content/social";
import { cn } from "@/lib/utils";

type Props = {
  /** 18 en páginas internas, 20 en home y contacto. */
  size?: 18 | 20;
  className?: string;
};

export function SocialIcons({ size = 18, className }: Props) {
  const yt = size + 2;
  return (
    <div className={cn("flex items-center", size === 20 ? "gap-5" : "gap-[18px]", className)}>
      <a href={SOCIAL.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70">
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="#fff" stroke="none" />
        </svg>
      </a>
      <a href={SOCIAL.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70">
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M14 22v-8h2.7l.4-3.1H14V8.9c0-.9.3-1.5 1.6-1.5H17V4.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H8v3.1h2.6V22h3.4z" />
        </svg>
      </a>
      <a href={SOCIAL.youtube} aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70">
        <svg width={yt} height={size} viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C16.9 3.6 12 3.6 12 3.6h0s-4.9 0-7.8.3c-.5.1-1.5.1-2.3 1-.7.7-.9 2.3-.9 2.3S.7 9.1.7 11v1.9c0 1.9.3 3.8.3 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.3 7.6.3s4.9 0 7.8-.3c.5-.1 1.5-.1 2.3-1 .7-.7.9-2.3.9-2.3s.3-1.9.3-3.8V11c0-1.9-.3-3.8-.3-3.8zM9.7 15V8.5l6.2 3.3-6.2 3.2z" />
        </svg>
      </a>
    </div>
  );
}
