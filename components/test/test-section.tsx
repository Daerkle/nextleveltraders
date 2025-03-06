import { Card } from "@/components/ui/card";
import { TestExample as TestExampleType } from "@/types/test";

interface TestSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function TestSection({ title, description, children, className }: TestSectionProps) {
  return (
    <section className={className}>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </section>
  );
}

interface TestExampleProps extends Partial<TestExampleType> {
  children: React.ReactNode;
  className?: string;
}

export function TestExample({
  title,
  description,
  children,
  className,
}: TestExampleProps) {
  return (
    <Card className={className || "p-4 border-dashed"}>
      <div className="space-y-3">
        <div>
          <h3 className="font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          {children}
        </div>
      </div>
    </Card>
  );
}

interface TestGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function TestGroup({ children, className }: TestGroupProps) {
  return (
    <div className={className || "space-y-6"}>
      {children}
    </div>
  );
}

interface TestNoteProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'error';
}

export function TestNote({ children, type = 'info' }: TestNoteProps) {
  const colorClasses = {
    info: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    warning: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
    error: 'bg-red-500/10 text-red-700 dark:text-red-300',
  };

  return (
    <div className={`p-4 rounded-lg text-sm ${colorClasses[type]}`}>
      {children}
    </div>
  );
}

interface TestMetadataProps {
  items: Record<string, string | number | boolean>;
}

export function TestMetadata({ items }: TestMetadataProps) {
  return (
    <dl className="grid grid-cols-2 gap-2 text-sm">
      {Object.entries(items).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <dt className="text-muted-foreground">{key}:</dt>
          <dd className="font-mono">{String(value)}</dd>
        </div>
      ))}
    </dl>
  );
}