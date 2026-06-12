'use client';

import { Button, Badge, Input, RolePill, AnonChip, Avatar } from '@/components/ui';

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-background p-10 text-foreground">
      <h1 className="mb-8 text-4xl font-semibold">POWORK UI Showcase</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-lg text-foreground-secondary">Buttons</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default">Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="danger">Nguy hiểm</Button>
          <Button variant="accent" size="sm">
            Nhỏ
          </Button>
          <Button variant="accent" size="lg">
            Lớn
          </Button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg text-foreground-secondary">Badges</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="open">Đang mở</Badge>
          <Badge variant="blind">Đang chấm</Badge>
          <Badge variant="done">Đã unlock</Badge>
          <Badge variant="fail">Không đạt</Badge>
          <Badge variant="invited">Đã mời PV</Badge>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg text-foreground-secondary">Role Pills</h2>
        <div className="flex flex-wrap items-center gap-3">
          <RolePill role="employer" />
          <RolePill role="candidate" />
          <RolePill role="system">Hệ thống</RolePill>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg text-foreground-secondary">Anonymity</h2>
        <div className="flex flex-wrap items-center gap-3">
          <AnonChip code={47} />
          <AnonChip code={128} />
          <Avatar initials="TP" size="sm" />
          <Avatar initials="QN" size="md" />
          <Avatar initials="KH" size="lg" />
        </div>
      </section>

      <section className="mb-8 max-w-sm">
        <h2 className="mb-3 text-lg text-foreground-secondary">Input</h2>
        <div className="flex flex-col gap-3">
          <Input placeholder="Email của bạn" />
          <Input placeholder="Có lỗi" error />
        </div>
      </section>
    </div>
  );
}
