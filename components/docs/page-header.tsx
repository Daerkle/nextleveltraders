import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DocPageHeader({
  heading,
  text,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4 pb-4 pt-6 md:pb-6 md:pt-10", className)} {...props}>
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {heading}
        </h1>
        {text && (
          <p className="text-lg text-muted-foreground">
            {text}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

interface PageHeaderContextProps {
  label?: string;
  text?: string;
  children?: React.ReactNode;
}

export function DocPageHeaderContext({
  label,
  text,
  children,
}: PageHeaderContextProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        {label && (
          <p className="text-sm text-muted-foreground">
            {label}
          </p>
        )}
        {text && (
          <p className="text-sm font-medium">
            {text}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

interface PageHeaderActionsProps {
  children: React.ReactNode;
}

export function DocPageHeaderActions({
  children,
}: PageHeaderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {children}
    </div>
  );
}

export function DocPageHeaderSeparator() {
  return (
    <hr className="my-4" />
  );
}