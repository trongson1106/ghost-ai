import { Cpu, Users, FileText } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col bg-bg-base border-r border-border-default">
      <div className="flex items-center gap-2.5 px-12 pt-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 120 120" className="shrink-0" aria-hidden="true">
          <rect width="120" height="120" rx="28" fill="#14213D"/>
          <g stroke="#F6F4EE" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M60 26 L32 60 L60 94 L88 60 Z"/>
            <path d="M60 26 V94"/>
            <path d="M32 60 H88"/>
          </g>
          <circle cx="32" cy="60" r="8" fill="#F6F4EE"/>
          <circle cx="88" cy="60" r="8" fill="#F6F4EE"/>
          <circle cx="60" cy="94" r="8" fill="#2EC4B6"/>
          <path d="M60 8 C62.5 19 67 24 79 26 C67 28 62.5 33 60 44 C57.5 33 53 28 41 26 C53 24 57.5 19 60 8 Z" fill="#FFB84D"/>
        </svg>
        <span className="text-text-primary font-semibold text-sm tracking-tight">
          Trellis
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center px-12 py-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-text-primary leading-tight mb-4">
            Design systems at the speed of thought.
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed mb-10">
            Describe your architecture in plain English. Trellis maps it to a
            shared canvas your whole team can refine in real time.
          </p>
          <ul className="space-y-7">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4">
                <div className="shrink-0 h-9 w-9 rounded-xl bg-bg-elevated flex items-center justify-center">
                  <Icon className="h-4 w-4 text-accent-primary" />
                </div>
                <div>
                  <p className="text-text-primary font-semibold text-sm">
                    {title}
                  </p>
                  <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-12 pb-10">
        <p className="text-text-faint text-xs">
          © 2026 Trellis. All rights reserved.
        </p>
      </div>
    </div>
  );
}
