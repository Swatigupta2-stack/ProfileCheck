import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe, Copy, Check, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { PortfolioData } from "@/types/portfolio";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: PortfolioData;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

const randomId = () => Math.random().toString(36).slice(2, 8);

export const PublishPortfolioDialog = ({ open, onOpenChange, data }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [slug, setSlug] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [existing, setExisting] = useState<{ slug: string; is_public: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    supabase
      .from("published_portfolios")
      .select("slug, is_public")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setExisting(data);
          setSlug(data.slug);
          setIsPublic(data.is_public);
        } else {
          const base = slugify(data ? "" : "") || slugify((user.email || "").split("@")[0]);
          // Suggestion based on name in portfolio
          setExisting(null);
          setIsPublic(true);
        }
        setLoading(false);
      });
  }, [open, user]);

  // Suggest slug from name when none exists
  useEffect(() => {
    if (!open || existing || slug) return;
    const suggested = slugify(data.personalInfo.fullName) || slugify((user?.email || "").split("@")[0]) || `user-${randomId()}`;
    setSlug(suggested);
  }, [open, existing, data.personalInfo.fullName, user]);

  const publicUrl = slug ? `${window.location.origin}/p/${slug}` : "";

  const handlePublish = async () => {
    if (!user) {
      toast({ title: "Sign in required", variant: "destructive" });
      return;
    }
    let finalSlug = slugify(slug);
    if (!finalSlug) {
      toast({ title: "Invalid URL", description: "Slug must contain letters or numbers.", variant: "destructive" });
      return;
    }
    setSaving(true);

    // Check slug availability if changing
    if (finalSlug !== existing?.slug) {
      const { data: taken } = await supabase
        .from("published_portfolios")
        .select("user_id")
        .eq("slug", finalSlug)
        .maybeSingle();
      if (taken && taken.user_id !== user.id) {
        // Fallback: append short random id
        finalSlug = `${finalSlug}-${randomId()}`;
        toast({ title: "URL taken", description: `Used "${finalSlug}" instead.` });
      }
    }

    const payload = {
      user_id: user.id,
      slug: finalSlug,
      data: data as any,
      is_public: isPublic,
    };

    const { error } = await supabase
      .from("published_portfolios")
      .upsert(payload, { onConflict: "user_id" });

    setSaving(false);
    if (error) {
      toast({ title: "Publish failed", description: error.message, variant: "destructive" });
    } else {
      setSlug(finalSlug);
      setExisting({ slug: finalSlug, is_public: isPublic });
      toast({ title: existing ? "Portfolio updated" : "Portfolio published 🎉" });
    }
  };

  const handleUnpublish = async () => {
    if (!user || !existing) return;
    if (!confirm("Remove your public portfolio? The link will stop working.")) return;
    setSaving(true);
    const { error } = await supabase.from("published_portfolios").delete().eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      setExisting(null);
      setSlug("");
      toast({ title: "Unpublished" });
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" /> Share Portfolio
          </DialogTitle>
          <DialogDescription>
            Pick a unique URL for your public portfolio. Re-publish anytime to push your latest changes.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : (
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="slug">Your URL</Label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground whitespace-nowrap">{window.location.origin}/p/</span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="your-name"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Letters, numbers, and dashes. If taken, a short ID will be added automatically.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium text-sm">Make portfolio public</p>
                <p className="text-xs text-muted-foreground">Anyone with the link can view it.</p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            {existing && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                <p className="text-sm font-medium">Live at:</p>
                <div className="flex gap-2">
                  <Input readOnly value={publicUrl} className="text-sm" />
                  <Button size="icon" variant="outline" onClick={copyLink} title="Copy">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="outline" asChild title="Open">
                    <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {existing && (
            <Button variant="outline" onClick={handleUnpublish} disabled={saving} className="sm:mr-auto">
              Unpublish
            </Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={handlePublish} disabled={saving || !slug}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
            {existing ? "Update & republish" : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
