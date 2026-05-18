import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { extractResumeText } from "@/utils/resumeParser";
import { supabase } from "@/integrations/supabase/client";
import { Upload as UploadIcon, FileText, Trash2, Loader2, BarChart3 } from "lucide-react";
import { PremiumLockScreen } from "@/components/PremiumLockScreen";

const Upload = () => {
  const { user, isPro, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const refresh = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("uploaded_resumes")
      .select("id, file_name, file_path, ats_score, created_at")
      .order("created_at", { ascending: false });
    setItems(data ?? []);
  };

  useEffect(() => { refresh(); }, [user]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setBusy(true);
    try {
      const text = await extractResumeText(file);
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("resumes").upload(path, file);
      if (upErr) throw upErr;
      const { error: insErr } = await supabase.from("uploaded_resumes").insert({
        user_id: user.id, file_name: file.name, file_path: path, extracted_text: text,
      });
      if (insErr) throw insErr;
      toast.success("Uploaded & parsed");
      refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setBusy(false);
      (e.target as HTMLInputElement).value = "";
    }
  };

  const remove = async (id: string, path?: string) => {
    if (path) await supabase.storage.from("resumes").remove([path]);
    await supabase.from("uploaded_resumes").delete().eq("id", id);
    refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isPro) {
    return (
      <PremiumLockScreen
        title="ATS Score Analysis"
        description="Scan your resume uploads against advanced AI parsers and recruiter constraints to identify formatting, keyword alignment, and styling feedback."
        features={[
          "📊 Instant comprehensive ATS compatibility check",
          "🔍 Automated missing skills & keyword extraction",
          "✍️ Action verb density and structure suggestions",
          "🚀 Direct comparison metrics with job descriptions"
        ]}
        reason="To unlock multi-resume ATS uploads and analysis"
      />
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-1">Upload <span className="text-gradient-gold">Resume</span></h1>
        <p className="text-muted-foreground mb-6">Securely store and analyse your resumes.</p>

        <Card className="p-6 glass mb-6">
          <Label>Choose a PDF, DOCX, or TXT</Label>
          <div className="flex items-center gap-3 mt-2">
            <Input type="file" accept=".pdf,.docx,.txt" onChange={handleFile} disabled={busy} />
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            <UploadIcon className="h-5 w-5 text-primary" />
          </div>
        </Card>

        <h2 className="text-lg font-semibold mb-3">Your uploads</h2>
        {items.length === 0 && <p className="text-muted-foreground text-sm">No uploads yet.</p>}
        <div className="space-y-2">
          {items.map((it) => (
            <Card key={it.id} className="p-4 glass flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{it.file_name}</div>
                  <div className="text-xs text-muted-foreground">{new Date(it.created_at).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {it.ats_score != null && (
                  <span className="text-sm font-semibold text-primary">ATS {it.ats_score}</span>
                )}
                <Button size="sm" variant="outline" onClick={() => navigate("/ats")}>
                  <BarChart3 className="h-4 w-4" /> Score
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(it.id, it.file_path)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Upload;
