import React from "react";

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

export function FormattedMarkdown({ content, className = "" }: FormattedMarkdownProps) {
  if (!content) return null;

  // Split content into blocks by double newlines or single newlines
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let currentList: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`${keyPrefix}-ul`} className="list-disc list-inside space-y-1 my-2 pl-2 text-purple-700 dark:text-purple-300">
          {currentList.map((item, idx) => (
            <li key={idx} className="text-foreground font-medium">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(`line-${lineIdx}`);
      return;
    }

    // Horizontal Rule
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      flushList(`line-${lineIdx}`);
      elements.push(<hr key={lineIdx} className="my-3 border-border opacity-60" />);
      return;
    }

    // Headings ###
    if (trimmed.startsWith("### ")) {
      flushList(`line-${lineIdx}`);
      elements.push(
        <h3 key={lineIdx} className="text-sm font-black text-purple-600 dark:text-purple-400 mt-3 mb-1.5 tracking-tight">
          {parseInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList(`line-${lineIdx}`);
      elements.push(
        <h2 key={lineIdx} className="text-base font-black text-purple-600 dark:text-purple-300 mt-4 mb-2 tracking-tight">
          {parseInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList(`line-${lineIdx}`);
      elements.push(
        <h1 key={lineIdx} className="text-lg font-black text-purple-700 dark:text-purple-300 mt-4 mb-2">
          {parseInlineMarkdown(trimmed.replace(/^#\s+/, ""))}
        </h1>
      );
      return;
    }

    // Bullet items
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || /^\d+\.\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^(\*|-|\d+\.)\s+/, "");
      currentList.push(itemText);
      return;
    }

    // Regular paragraph
    flushList(`line-${lineIdx}`);
    elements.push(
      <p key={lineIdx} className="my-1.5 leading-relaxed font-medium">
        {parseInlineMarkdown(line)}
      </p>
    );
  });

  flushList("final");

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}

/** Helper to parse **bold** and `code` inline */
function parseInlineMarkdown(text: string): React.ReactNode[] {
  // Regex matches **bold**, *italic*, `code`
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-extrabold text-purple-700 dark:text-purple-300 bg-purple-500/10 px-1 py-0.5 rounded">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border border-border">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={index} className="italic text-foreground">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}
