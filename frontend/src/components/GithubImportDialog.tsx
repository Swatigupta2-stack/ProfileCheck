import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Loader2 } from "lucide-react";
import { importFromGithub, GithubImportResult } from "@/utils/githubImport";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (result: GithubImportResult) => void;
}

export const GithubImportDialog = ({ open, onOpenChange, onImport }: Props) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    setLoading(true);
    try {
      const result = await importFromGithub(username);
      onImport(result);
      toast({
        title: "Imported from GitHub",
        description: `Loaded ${result.projects.length} projects and ${result.skills.length} skills from @${result.profile.login}.`,
      });
      onOpenChange(false);
      setUsername("");
    } catch (e: any) {
      toast({ title: "Import failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" /> Import from GitHub
          </DialogTitle>
          <DialogDescription>
            We'll pull your top public repositories, languages, and topics to auto-populate projects and skills.
            This will append to your existing data.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="gh-username">GitHub username or profile URL</Label>
          <Input
            id="gh-username"
            placeholder="e.g., torvalds or https://github.com/torvalds"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && username && handleImport()}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!username.trim() || loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing…</> : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
