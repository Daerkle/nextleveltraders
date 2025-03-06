"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SupportedLanguage = "typescript" | "javascript" | "json" | "bash";

interface CodeBlockProps {
  code: string;
  language?: SupportedLanguage;
  showLineNumbers?: boolean;
  className?: string;
  fileName?: string;
}

function addSyntaxHighlighting(code: string, language: SupportedLanguage): string {
  // Einfache Syntax-Highlighting-Regeln
  const rules = {
    typescript: [
      { pattern: /(["'])(.*?)\1/g, className: "string" },            // Strings
      { pattern: /\b(const|let|var|function|class|interface|type|extends|implements)\b/g, className: "keyword" },
      { pattern: /\b(true|false|null|undefined)\b/g, className: "constant" },
      { pattern: /\b(number|string|boolean|any|void|never)\b/g, className: "type" },
      { pattern: /\/\/.*/g, className: "comment" },                  // Single-line comments
      { pattern: /\/\*[\s\S]*?\*\//g, className: "comment" },       // Multi-line comments
      { pattern: /\b\d+\b/g, className: "number" },                 // Numbers
    ],
    javascript: [
      { pattern: /(["'])(.*?)\1/g, className: "string" },
      { pattern: /\b(const|let|var|function|class)\b/g, className: "keyword" },
      { pattern: /\b(true|false|null|undefined)\b/g, className: "constant" },
      { pattern: /\/\/.*/g, className: "comment" },
      { pattern: /\/\*[\s\S]*?\*\//g, className: "comment" },
      { pattern: /\b\d+\b/g, className: "number" },
    ],
    json: [
      { pattern: /(["'])(.*?)\1/g, className: "string" },
      { pattern: /\b(true|false|null)\b/g, className: "constant" },
      { pattern: /\b\d+\b/g, className: "number" },
    ],
    bash: [
      { pattern: /#.*/g, className: "comment" },
      { pattern: /\$\w+/g, className: "variable" },
      { pattern: /(["'])(.*?)\1/g, className: "string" },
    ],
  };

  let highlightedCode = code.replace(/[<>&]/g, (char) => {
    switch (char) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      default: return char;
    }
  });

  rules[language].forEach(({ pattern, className }) => {
    highlightedCode = highlightedCode.replace(pattern, (match) => {
      return `<span class="token ${className}">${match}</span>`;
    });
  });

  return highlightedCode;
}

export function CodeBlock({
  code,
  language = "typescript",
  showLineNumbers = true,
  className,
  fileName,
}: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const highlightedCode = addSyntaxHighlighting(code, language);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const renderLines = () => {
    return highlightedCode.split("\n").map((line: string, i: number) => (
      <span key={i} className="table-row">
        <span className="table-cell pr-4 text-muted-foreground select-none">
          {i + 1}
        </span>
        <span
          className="table-cell"
          dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
        />
      </span>
    ));
  };

  return (
    <div className={cn("relative group rounded-lg", className)}>
      <style jsx global>{`
        .token.string { color: #a8ff60; }
        .token.keyword { color: #ff79c6; }
        .token.constant { color: #bd93f9; }
        .token.type { color: #8be9fd; }
        .token.comment { color: #6272a4; }
        .token.number { color: #bd93f9; }
        .token.variable { color: #50fa7b; }
      `}</style>
      {fileName && (
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted rounded-t-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-mono">
              {fileName}
            </span>
            <span className="text-xs text-muted-foreground/60">
              {language.toUpperCase()}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={copyToClipboard}
          >
            {hasCopied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            <span className="sr-only">Code kopieren</span>
          </Button>
        </div>
      )}
      <div className="relative">
        <pre className={cn(
          "p-4 overflow-x-auto text-sm font-mono",
          !fileName && "rounded-t-lg",
          "bg-muted"
        )}>
          {showLineNumbers ? (
            <code className={`language-${language} grid`}>
              {renderLines()}
            </code>
          ) : (
            <code
              className={`language-${language}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          )}
        </pre>
        {!fileName && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={copyToClipboard}
          >
            {hasCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Code kopieren</span>
          </Button>
        )}
      </div>
    </div>
  );
}

interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className
      )}
    >
      {children}
    </code>
  );
}