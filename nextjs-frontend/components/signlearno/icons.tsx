import { signlearnoTheme as theme } from "@/components/signlearno/theme";

export type SignLearnoNavKind = "learn" | "textToSign" | "signToText";
export type SignLearnoPathKind =
  | "start"
  | "story"
  | "lesson"
  | "practice"
  | "check"
  | "review";

function LearnBadge() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
      <path
        d="M10 18.5 21.2 10a2 2 0 0 1 2.45 0L35 18.5"
        fill="none"
        stroke={theme.colors.red}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 19.5h16v14.3a4.2 4.2 0 0 1-4.2 4.2h-7.6A4.2 4.2 0 0 1 14 33.8V19.5Z"
        fill={theme.colors.yellow}
      />
      <circle cx="19" cy="27" r="3.2" fill="#8D5D3B" />
      <circle cx="25" cy="27" r="3.2" fill="#8D5D3B" />
      <path
        d="M19.2 32.2c1.6-1.2 4-1.2 5.6 0"
        fill="none"
        stroke="#8D5D3B"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TextToSignBadge() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
      <rect x="5" y="8" width="17" height="13" rx="5" fill={theme.colors.blueSoft} stroke={theme.colors.blueBorder} strokeWidth="2" />
      <path d="M10 14h7" stroke={theme.colors.blue} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M25 14h7" stroke={theme.colors.textSoft} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M29 10.8 34 14l-5 3.2" fill="none" stroke={theme.colors.textSoft} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 29c0-3.8 3.3-6.7 7.1-6.2 3 .4 4.7 2.9 6.9 4.7 2.5 2.1 6.5 2.8 9.5 1.4" fill="none" stroke={theme.colors.green} strokeWidth="5" strokeLinecap="round" />
      <circle cx="31" cy="31" r="4.2" fill={theme.colors.red} />
    </svg>
  );
}

function SignToTextBadge() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
      <path d="M12 29.5c0-4 2.5-8.4 6.4-8.4 4.1 0 4.6 5.3 7.8 7.8 3.1 2.4 6.5 1.2 7.8-.2" fill="none" stroke={theme.colors.green} strokeWidth="5" strokeLinecap="round" />
      <rect x="24" y="7" width="14" height="19" rx="5" fill="#FFFFFF" stroke={theme.colors.blueBorder} strokeWidth="2" />
      <path d="M27 13h8" stroke={theme.colors.blue} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M27 17h8" stroke={theme.colors.blue} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M27 21h5" stroke={theme.colors.blue} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18 13h-5" stroke={theme.colors.textSoft} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M16 9.8 11 13l5 3.2" fill="none" stroke={theme.colors.textSoft} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SidebarNavIcon({
  kind,
}: {
  kind: SignLearnoNavKind;
  active: boolean;
}) {
  if (kind === "learn") {
    return <LearnBadge />;
  }

  if (kind === "textToSign") {
    return <TextToSignBadge />;
  }

  return <SignToTextBadge />;
}

export function GuidebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="4.2" width="4" height="2.4" rx="1.2" fill="#FFFFFF" />
      <rect x="2.5" y="10.8" width="4" height="2.4" rx="1.2" fill="#FFFFFF" />
      <rect x="2.5" y="17.4" width="4" height="2.4" rx="1.2" fill="#FFFFFF" />
      <path d="M9.2 3.4h10a1.8 1.8 0 0 1 1.8 1.8v13.7a1.8 1.8 0 0 1-1.8 1.8h-10V3.4Z" fill="#FFFFFF" />
      <path d="M11.7 7.5h5.7" stroke={theme.colors.greenDark} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11.7 11.9h5.7" stroke={theme.colors.greenDark} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11.7 16.3h4" stroke={theme.colors.greenDark} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BookGlyph({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
      <path d="M7 10.5c3-.9 5.8-.7 8.6 1v11.3c-2.8-1.7-5.6-1.9-8.6-1V10.5Z" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M27 10.5c-3-.9-5.8-.7-8.6 1v11.3c2.8-1.7 5.6-1.9 8.6-1V10.5Z" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockGlyph({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="8" y="14" width="16" height="12" rx="3.5" fill={color} />
      <path d="M11.3 14V11a4.7 4.7 0 0 1 9.4 0v3" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="16" cy="20" r="2.2" fill={theme.colors.node} />
    </svg>
  );
}

function ChestGlyph({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
      <rect x="6" y="12" width="22" height="14" rx="4" fill={color} opacity="0.94" />
      <path d="M8 12h18a3 3 0 0 0-3-3H11a3 3 0 0 0-3 3Z" fill={color} />
      <rect x="15" y="10" width="4" height="16" rx="2" fill={theme.colors.node} opacity="0.45" />
      <rect x="11.2" y="15.2" width="11.6" height="2.8" rx="1.4" fill={theme.colors.node} opacity="0.28" />
      <circle cx="17" cy="20.5" r="2" fill={theme.colors.node} />
    </svg>
  );
}

function TrophyGlyph({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M11 9h10v5.7c0 3.3-2.2 6.1-5 6.7-2.8-.6-5-3.4-5-6.7V9Z" fill={color} />
      <path d="M9 10.5H6.8a1.8 1.8 0 0 0-1.8 1.8c0 2.9 2.1 5.3 5 5.9" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M23 10.5h2.2a1.8 1.8 0 0 1 1.8 1.8c0 2.9-2.1 5.3-5 5.9" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M16 21v5" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M11.5 27h9" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function PathNodeSymbol({
  kind,
  size = "md",
}: {
  kind: SignLearnoPathKind;
  size?: "md" | "lg" | "xl";
}) {
  const color = kind === "start" ? "#FFFFFF" : theme.colors.nodeIcon;
  const iconSize = size === "xl" ? 60 : size === "lg" ? 44 : 34;
  const compactSize = size === "xl" ? 54 : size === "lg" ? 42 : 32;

  if (kind === "start") {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 34 34" aria-hidden="true">
        <path
          d="m17 4.5 3.6 7.2 8 1.2-5.8 5.7 1.3 8-7.1-3.7-7.1 3.7 1.3-8-5.8-5.7 8-1.2L17 4.5Z"
          fill={color}
        />
      </svg>
    );
  }

  if (kind === "practice") {
    return <LockGlyph color={color} size={compactSize} />;
  }

  if (kind === "check") {
    return <ChestGlyph color={color} size={iconSize} />;
  }

  if (kind === "review") {
    return <TrophyGlyph color={color} size={compactSize} />;
  }

  return <BookGlyph color={color} size={iconSize} />;
}

export function XpChestIllustration() {
  return (
    <svg width="74" height="74" viewBox="0 0 74 74" aria-hidden="true">
      <rect x="8" y="16" width="58" height="44" rx="11" fill={theme.colors.yellow} />
      <rect x="11.5" y="21" width="51" height="34" rx="9" fill="#FFDB4D" />
      <path d="M16 21h42a6 6 0 0 0-6-6H22a6 6 0 0 0-6 6Z" fill="#F8B700" />
      <rect x="33.5" y="19" width="7" height="36" rx="3.5" fill="#E2A100" />
      <rect x="25.5" y="33" width="23" height="13" rx="6.5" fill="#D08A32" />
      <circle cx="37" cy="39.5" r="3.2" fill={theme.colors.yellow} />
      <circle cx="14.5" cy="28" r="2.4" fill="#E5AE00" />
      <circle cx="59.5" cy="28" r="2.4" fill="#E5AE00" />
      <circle cx="14.5" cy="50" r="2.4" fill="#E5AE00" />
      <circle cx="59.5" cy="50" r="2.4" fill="#E5AE00" />
    </svg>
  );
}
