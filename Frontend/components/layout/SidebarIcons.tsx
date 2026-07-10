import type { ReactElement, SVGProps } from 'react';
import type { NavIconName } from '@/lib/constants/nav';

type IconProps = SVGProps<SVGSVGElement>;

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export function HomeIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M3.5 10.8 12 3.5l8.5 7.3" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  );
}

export function ChallengeIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.5v2" />
      <path d="M21.5 12h-2" />
      <path d="M12 21.5v-2" />
      <path d="M4.5 12h-2" />
    </svg>
  );
}

export function SubmissionIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M6.5 3.5h7l4 4V20a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3.5v4h4" />
      <path d="M8.5 14h7" />
      <path d="M8.5 17h4.5" />
      <path d="m9 10 1.7 1.7L14 8.4" />
    </svg>
  );
}

export function ProfileIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.7 3.2-5.5 7-5.5s6.2 1.8 7 5.5" />
    </svg>
  );
}

export function CreateIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    </svg>
  );
}

export function TalentIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M12 3.5 14.4 8l5 .7-3.6 3.5.8 5-4.6-2.4-4.6 2.4.8-5L4.6 8.7l5-.7L12 3.5Z" />
      <path d="M12 9.5v3" />
    </svg>
  );
}

export function BookmarkIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M7 4.5h10a1 1 0 0 1 1 1v15l-6-3.5-6 3.5v-15a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M18 10.5a6 6 0 0 0-12 0c0 4-1.5 5-2.5 6h17c-1-1-2.5-2-2.5-6Z" />
      <path d="M9.5 19a2.7 2.7 0 0 0 5 0" />
    </svg>
  );
}

export function HistoryIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M4 12a8 8 0 1 0 2.4-5.7" />
      <path d="M4 5.5v4h4" />
      <path d="M12 8v4l2.5 2" />
    </svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" />
      <path d="M19 13.4v-2.8l-2-.5a6 6 0 0 0-.7-1.7l1.1-1.8-2-2-1.8 1.1a6 6 0 0 0-1.6-.7L11.4 2H8.6L8 4a6 6 0 0 0-1.7.7L4.6 3.6l-2 2 1.1 1.8A6 6 0 0 0 3 9.1l-2 .5v2.8l2 .5a6 6 0 0 0 .7 1.7l-1.1 1.8 2 2 1.8-1.1a6 6 0 0 0 1.7.7l.5 2h2.8l.5-2a6 6 0 0 0 1.7-.7l1.8 1.1 2-2-1.1-1.8a6 6 0 0 0 .7-1.7l2-.5Z" />
    </svg>
  );
}

export function CompanyIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M4.5 20V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v14" />
      <path d="M14.5 10h4a1 1 0 0 1 1 1v9" />
      <path d="M7.5 8.5h3" />
      <path d="M7.5 12h3" />
      <path d="M7.5 15.5h3" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="m14.5 4.5 5 5" />
      <path d="M9.5 9.5 5 14l5 5 4.5-4.5" />
      <path d="m12 7 5 5-5.5 5.5-5-5L12 7Z" />
      <path d="M4 20l4.5-4.5" />
    </svg>
  );
}

export function DotsIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M6.5 12h.01" />
      <path d="M12 12h.01" />
      <path d="M17.5 12h.01" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M5 7h14" />
      <path d="M5 12h14" />
      <path d="M5 17h14" />
    </svg>
  );
}

export function BrandIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M12 3.5 19.5 8v8L12 20.5 4.5 16V8L12 3.5Z" />
      <path d="M8.5 10.5 12 8.4l3.5 2.1v4L12 16.6l-3.5-2.1v-4Z" />
    </svg>
  );
}

const icons: Record<NavIconName, (props: IconProps) => ReactElement> = {
  home: HomeIcon,
  challenge: ChallengeIcon,
  submission: SubmissionIcon,
  profile: ProfileIcon,
  create: CreateIcon,
  talent: TalentIcon,
  bookmark: BookmarkIcon,
  notification: BellIcon,
  settings: SettingsIcon,
};

export function SidebarNavIcon({ name, className }: { name: NavIconName; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} />;
}
