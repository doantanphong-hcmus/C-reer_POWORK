const tabs = [
  { label: 'Timeline', href: '#career-timeline' },
  { label: 'Evidence', href: '#evidence' },
  { label: 'Projects', href: '#evidence' },
  { label: 'Achievements', href: '#career-analytics' },
  { label: 'Activity', href: '#career-timeline' },
  { label: 'Statistics', href: '#career-analytics' },
  { label: 'Bookmarks', href: '#evidence' },
  { label: 'Saved Challenges', href: '#evidence' },
];

export function ProfileNavigationTabs() {
  return (
    <nav className="sticky top-0 z-20 -mx-6 border-y-hairline border-border-secondary bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-[1240px] gap-1 overflow-x-auto py-2">
        {tabs.map((tab) => (
          <a
            key={tab.label}
            href={tab.href}
            className="shrink-0 rounded-pill px-4 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground"
          >
            {tab.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
