import Link from "next/link";
import type { ReactNode } from "react";

export function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-zinc-50">{value}</p>
      <p className="mt-1 text-sm text-zinc-500">{detail}</p>
    </div>
  );
}

export function Section({
  title,
  eyebrow,
  children,
  action,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="py-10">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b93ff]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 text-xl font-semibold text-zinc-50">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="grid gap-1.5 text-xs font-medium text-zinc-400">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-md border border-white/10 bg-[#0d0e12] px-3 text-sm text-zinc-100 outline-none transition hover:border-white/20 focus:border-[#8b93ff] focus:ring-2 focus:ring-[#8b93ff]/15"
      >
        {options.map((option) => (
          <option key={option} value={option === "All" ? "" : option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-medium text-zinc-400">
      {label}
      <input
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-md border border-white/10 bg-[#0d0e12] px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-[#8b93ff] focus:ring-2 focus:ring-[#8b93ff]/15"
      />
    </label>
  );
}

export function Bar({
  label,
  value,
  max,
  detail,
}: {
  label: string;
  value: number;
  max: number;
  detail: string;
}) {
  const width = max > 0 ? Math.max((value / max) * 100, 4) : 0;

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-zinc-200">{label}</span>
        <span className="text-zinc-500">{detail}</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#8b93ff] via-[#44d7b6] to-[#e4f222]"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.045] px-2 py-1 text-xs font-medium text-zinc-300">
      {children}
    </span>
  );
}

export function CompanyLink({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/companies/${slug}`}
      className="font-semibold text-zinc-50 underline decoration-white/20 underline-offset-4 hover:text-[#e4f222]"
    >
      {children}
    </Link>
  );
}
