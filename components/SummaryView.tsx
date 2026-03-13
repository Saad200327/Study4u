import { SummaryData } from '@/lib/aiClient';

export default function SummaryView({ data }: { data: SummaryData }) {
  return (
    <div className="space-y-6 animate-slide-up">
      {data.sections.map((section, i) => (
        <div key={i} className="card">
          <h2 className="text-lg font-bold text-apple-dark mb-3">{section.heading}</h2>
          <ul className="space-y-2">
            {section.bullets.map((b, j) => (
              <li key={j} className="flex gap-2 text-apple-gray leading-relaxed">
                <span className="text-apple-blue mt-1">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
