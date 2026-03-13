'use client';

import { Mode } from '@/lib/aiClient';

interface Tab { id: Mode; label: string; emoji: string; }
interface Props { tabs: Tab[]; activeTab: Mode; onChange: (tab: Mode) => void; }

export default function Tabs({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105 ${
            activeTab === tab.id ? 'tab-active' : 'tab-inactive'
          }`}
        >
          {tab.emoji} {tab.label}
        </button>
      ))}
    </div>
  );
}
