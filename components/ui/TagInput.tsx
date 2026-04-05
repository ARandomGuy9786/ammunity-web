"use client";

import { useState, KeyboardEvent } from "react";

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  hint?: string;
  max?: number;
}

export function TagInput({ label, tags, onChange, placeholder, hint, max = 20 }: TagInputProps) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const value = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (!value || tags.includes(value) || tags.length >= max) return;
    onChange([...tags, value]);
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="soft-label">{label}</label>

      <div
        className={[
          "input-surface min-h-[52px] cursor-text px-3 py-2.5",
          "flex flex-wrap gap-1.5 focus-within:ring-cyan-300",
        ].join(" ")}
        onClick={() => document.getElementById(`tag-input-${label}`)?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className="transition-colors hover:text-white"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}

        {tags.length < max && (
          <input
            id={`tag-input-${label}`}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => addTag(input)}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="min-w-[120px] flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
          />
        )}
      </div>

      {hint && (
        <p className="soft-hint">
          {hint}
          {max && <span className="ml-1 text-zinc-600">({tags.length}/{max})</span>}
        </p>
      )}
    </div>
  );
}
