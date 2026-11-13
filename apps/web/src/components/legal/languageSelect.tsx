import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface LanguageSelectProps {
  languages: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>(function SelectItem({ children, className, ...props }, forwardedRef) {
  return (
    <Select.Item
      className={cn(
        "relative flex h-[30px] cursor-pointer select-none items-center rounded-lg pl-[26px] pr-[30px] text-[13px] leading-none text-text data-[disabled]:pointer-events-none data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary data-[highlighted]:[outline-offset:-2px]",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CheckIcon className="h-3.5 w-3.5 text-primary" />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

export default function LanguageSelect({ languages, value, onChange, label }: LanguageSelectProps) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        className="inline-flex h-[35px] items-center justify-center gap-[5px] rounded-xl border border-border bg-card px-3.5 text-[13px] leading-none text-text shadow-xs outline-none transition-colors hover:border-border-strong focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        aria-label={label}
      >
        <Select.Value />
        <Select.Icon className="text-muted">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden rounded-xl border border-border bg-card p-1 shadow-lg">
          <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center text-muted">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center text-muted">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
