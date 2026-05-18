import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export interface AutocompleteItem {
  label: string;
  sublabel?: string;
  icon?: string;
  raw?: any;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSelect: (item: AutocompleteItem) => void;
  fetcher: (q: string) => Promise<AutocompleteItem[]>;
  minChars?: number;
  placeholder?: string;
  id?: string;
  error?: string | null;
  onError?: (err: string | null) => void;
}

export const Autocomplete = ({
  value,
  onChange,
  onSelect,
  fetcher,
  minChars = 2,
  placeholder,
  id,
  error,
  onError,
}: Props) => {
  const [items, setItems] = useState<AutocompleteItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});
  const wrapRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!value || value.length < minChars) {
      setItems([]);
      return;
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      setLoading(true);
      onError?.(null);
      try {
        const res = await fetcher(value);
        setItems(res);
        setOpen(true);
      } catch (err: any) {
        setItems([]);
        onError?.(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [value, minChars, fetcher, onError]);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <Input
        id={id}
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v);
          if (v.length >= minChars) {
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
        onFocus={() => {
          if (value.length >= minChars && items.length > 0) setOpen(true);
        }}
        placeholder={placeholder}
        autoComplete="off"
        className={error ? "border-destructive focus-visible:ring-destructive" : ""}
      />
      {loading && (
        <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
      )}
      {error && (
        <p className="absolute left-0 -bottom-5 text-[10px] text-destructive font-medium">
          {error}
        </p>
      )}
      {open && items.length > 0 && (
        <div 
          className="absolute z-[100] mt-1 w-full max-h-64 overflow-auto rounded-md border border-border bg-popover shadow-xl glass animate-in fade-in zoom-in-95 duration-100"
          onMouseLeave={() => {/* optional: keep open */}}
        >
          {items.map((it, i) => (
            <div
              key={`${it.label}-${i}`}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(it);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-primary/10 transition-colors border-b last:border-0 cursor-pointer active:bg-primary/20 pointer-events-auto select-none"
            >
              {it.icon && !failedLogos[it.icon] ? (
                <img 
                  src={it.icon} 
                  alt="" 
                  className="w-5 h-5 rounded object-contain bg-white shrink-0 border"
                  onError={() => {
                    if (it.icon) {
                      setFailedLogos(prev => ({ ...prev, [it.icon!]: true }));
                    }
                  }}
                />
              ) : (
                <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <span className="text-[10px] font-bold text-primary">
                    {it.label.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="text-sm font-medium truncate">{it.label}</span>
                {it.sublabel && (
                  <span className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-semibold">
                    {it.sublabel}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
