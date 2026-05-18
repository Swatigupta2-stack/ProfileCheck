import type { KeywordStat } from "@/utils/atsAnalyzer";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const getStatus = (d: number) => {
  if (d > 4) return { label: "Overused", color: "text-red-600 bg-red-50 border-red-200", dot: "bg-red-600" };
  if (d > 3) return { label: "Moderate", color: "text-yellow-600 bg-yellow-50 border-yellow-200", dot: "bg-yellow-600" };
  if (d >= 1) return { label: "Optimal", color: "text-green-600 bg-green-50 border-green-200", dot: "bg-green-600" };
  return { label: "Low", color: "text-blue-600 bg-blue-50 border-blue-200", dot: "bg-blue-600" };
};

interface KeywordDensityProps {
  keywords: KeywordStat[];
  missingKeywords?: string[];
}

export const KeywordDensity = ({ keywords, missingKeywords = [] }: KeywordDensityProps) => {
  if (!keywords.length) return null;

  return (
    <div className="space-y-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Missing Keywords Section */}
      {missingKeywords.length > 0 && (
        <div className="space-y-4 p-5 rounded-2xl bg-red-50/50 border border-red-100 shadow-sm">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-bold text-lg">Missing Critical Keywords</h3>
          </div>
          <p className="text-sm text-red-600/80 mb-2">
            These keywords were found in the job description but are missing from your resume.
          </p>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((word) => (
              <Badge 
                key={word} 
                variant="outline" 
                className="bg-white border-red-200 text-red-600 px-3 py-1 text-xs font-semibold shadow-sm hover:bg-red-50 transition-colors"
              >
                {word}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Keyword Density Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-foreground">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">Keyword Density Analysis</h3>
          </div>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-tighter">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-600" /> Optimal</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-600" /> Moderate</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-600" /> Overused</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">Keyword</TableHead>
                <TableHead className="text-center font-bold">Count</TableHead>
                <TableHead className="text-center font-bold">Density</TableHead>
                <TableHead className="text-right font-bold pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((k) => {
                const status = getStatus(k.density);
                return (
                  <TableRow key={k.word} className="hover:bg-muted/30 transition-colors group">
                    <TableCell className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {k.word}
                    </TableCell>
                    <TableCell className="text-center font-medium text-muted-foreground">
                      {k.count}
                    </TableCell>
                    <TableCell className="text-center font-medium text-muted-foreground">
                      {k.density}%
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Badge variant="outline" className={`${status.color} border-0 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} mr-1.5`} />
                        {status.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50/30 border border-blue-100/50 text-blue-700/70 text-[11px] italic">
          <Info className="h-3.5 w-3.5 shrink-0" />
          Density is calculated based on the frequency of valid keywords relative to the total word count (excluding stop words).
        </div>
      </div>
    </div>
  );
};

