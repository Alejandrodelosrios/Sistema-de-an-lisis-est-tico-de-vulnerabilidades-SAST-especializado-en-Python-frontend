"use client";

import { ClipboardList, MessagesSquare, Users } from "lucide-react";

export type AdminView = "usuarios" | "opiniones" | "encuesta";

interface AdminTabsProps {
  view: AdminView;
  onChange: (view: AdminView) => void;
}

const TABS: { id: AdminView; label: string; icon: typeof Users }[] = [
  { id: "usuarios", label: "Usuarios", icon: Users },
  { id: "opiniones", label: "Opiniones", icon: MessagesSquare },
  { id: "encuesta", label: "Encuesta", icon: ClipboardList },
];

export function AdminTabs({ view, onChange }: AdminTabsProps) {
  return (
    <div className="flex gap-1 rounded-xl border border-slate-800 bg-slate-900/40 p-1">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            view === id
              ? "bg-indigo-500/20 text-indigo-300 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}

export default AdminTabs;