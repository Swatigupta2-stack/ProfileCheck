import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { History, Save, RotateCcw, Trash2, Eye, Loader2, GitCompare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";
import { ResumePreview } from "./ResumePreview";

interface VersionRow {
  id: string;
  label: string;
  data: ResumeData;
  created_at: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentData: ResumeData;
  onRestore: (data: ResumeData) => void;
}

export const VersionHistoryDialog = ({ open, onOpenChange, currentData, onRestore }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [versions, setVersions] = useState<VersionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [view, setView] = useState<"list" | "compare">("list");

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("resume_versions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load versions", description: error.message, variant: "destructive" });
    } else {
      setVersions((data || []) as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      load();
      setCompareIds([]);
      setView("list");
    }
  }, [open, user]);

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to save versions.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("resume_versions").insert({
      user_id: user.id,
      label: label.trim() || `Snapshot ${new Date().toLocaleString()}`,
      data: currentData as any,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      setLabel("");
      toast({ title: "Version saved" });
      load();
    }
  };

  const handleRestore = (v: VersionRow) => {
    if (!confirm(`Restore "${v.label}"? Your current resume will be replaced (you can save a snapshot first).`)) return;
    onRestore(v.data);
    toast({ title: "Restored", description: v.label });
    onOpenChange(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this version permanently?")) return;
    const { error } = await supabase.from("resume_versions").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else load();
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const compareA = versions.find((v) => v.id === compareIds[0]);
  const compareB = versions.find((v) => v.id === compareIds[1]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" /> Version History
          </DialogTitle>
          <DialogDescription>
            Save snapshots of your resume. Compare two versions side-by-side or as a text diff, then restore any one.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 items-end pb-2 border-b border-border">
          <div className="flex-1">
            <Label htmlFor="ver-label">Snapshot label (optional)</Label>
            <Input id="ver-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g., Before AI rewrite" />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save current as version
          </Button>
        </div>

        <div className="flex gap-2 items-center pt-2">
          <Button
            size="sm"
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
          >
            List
          </Button>
          <Button
            size="sm"
            variant={view === "compare" ? "default" : "outline"}
            onClick={() => setView("compare")}
            disabled={compareIds.length !== 2}
          >
            <GitCompare className="w-4 h-4 mr-2" />
            Compare {compareIds.length}/2
          </Button>
          {compareIds.length > 0 && (
            <Button size="sm" variant="ghost" onClick={() => setCompareIds([])}>
              Clear selection
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          {view === "list" ? (
            <ScrollArea className="h-full pr-4">
              {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
              ) : versions.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No versions yet. Save your first snapshot above.</p>
              ) : (
                <div className="space-y-2 py-2">
                  {versions.map((v) => {
                    const selected = compareIds.includes(v.id);
                    return (
                      <div
                        key={v.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${selected ? "border-primary bg-primary/5" : "border-border"}`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleCompare(v.id)}
                            className="w-4 h-4 accent-primary cursor-pointer"
                            aria-label="Select for compare"
                          />
                          <div>
                            <p className="font-medium">{v.label}</p>
                            <p className="text-xs text-muted-foreground">{new Date(v.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleRestore(v)} title="Restore">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(v.id)} title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          ) : (
            compareA && compareB && (
              <Tabs defaultValue="visual" className="h-full flex flex-col">
                <TabsList className="self-start">
                  <TabsTrigger value="visual"><Eye className="w-4 h-4 mr-2" />Visual</TabsTrigger>
                  <TabsTrigger value="diff"><GitCompare className="w-4 h-4 mr-2" />Text diff</TabsTrigger>
                </TabsList>
                <TabsContent value="visual" className="flex-1 overflow-hidden mt-2">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {[compareA, compareB].map((v) => (
                      <div key={v.id} className="flex flex-col h-full overflow-hidden border border-border rounded-lg">
                        <div className="p-2 bg-muted/40 border-b border-border flex justify-between items-center">
                          <p className="text-sm font-medium truncate">{v.label}</p>
                          <Button size="sm" variant="outline" onClick={() => handleRestore(v)}>
                            <RotateCcw className="w-3 h-3 mr-1" /> Restore
                          </Button>
                        </div>
                        <ScrollArea className="flex-1">
                          <div className="scale-75 origin-top-left w-[133%]">
                            <ResumePreview data={v.data} />
                          </div>
                        </ScrollArea>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="diff" className="flex-1 overflow-hidden mt-2">
                  <ScrollArea className="h-full">
                    <DiffView a={compareA} b={compareB} />
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Lightweight field-level diff
const DiffView = ({ a, b }: { a: VersionRow; b: VersionRow }) => {
  const lines = (data: ResumeData): string[] => {
    const out: string[] = [];
    out.push(`# ${data.personalInfo.fullName}`);
    out.push(`Email: ${data.personalInfo.email}`);
    out.push(`Phone: ${data.personalInfo.phone}`);
    out.push(`Location: ${data.personalInfo.location}`);
    out.push("## Experience");
    data.experience.forEach((e) => {
      out.push(`- ${e.position} @ ${e.company} (${e.startDate} - ${e.current ? "Present" : e.endDate})`);
      e.description.split("\n").forEach((l) => out.push(`  ${l}`));
    });
    out.push("## Education");
    data.education.forEach((e) => out.push(`- ${e.degree}, ${e.field} @ ${e.institution} (${e.startDate} - ${e.endDate})`));
    out.push("## Skills");
    out.push(data.skills.join(", "));
    out.push("## Projects");
    data.projects.forEach((p) => {
      out.push(`- ${p.name} [${p.technologies}]`);
      out.push(`  ${p.description}`);
    });
    return out;
  };
  const la = lines(a.data);
  const lb = lines(b.data);
  const setA = new Set(la);
  const setB = new Set(lb);
  return (
    <div className="font-mono text-xs space-y-3 p-2">
      <div>
        <p className="text-sm font-sans font-medium mb-2">{a.label} (left)</p>
        {la.map((l, i) => (
          <div key={`a-${i}`} className={!setB.has(l) ? "bg-destructive/15 text-destructive-foreground px-2" : "px-2"}>
            {!setB.has(l) ? "- " : "  "}{l || "\u00A0"}
          </div>
        ))}
      </div>
      <div>
        <p className="text-sm font-sans font-medium mb-2">{b.label} (right)</p>
        {lb.map((l, i) => (
          <div key={`b-${i}`} className={!setA.has(l) ? "bg-primary/15 text-primary px-2" : "px-2"}>
            {!setA.has(l) ? "+ " : "  "}{l || "\u00A0"}
          </div>
        ))}
      </div>
    </div>
  );
};
