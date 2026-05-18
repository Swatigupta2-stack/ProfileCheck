import type { AutocompleteItem } from "@/components/Autocomplete";

export async function searchUniversities(q: string): Promise<AutocompleteItem[]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9000';
    console.log("Searching universities with API URL:", apiUrl, "query:", q);
    const res = await fetch(
      `${apiUrl}/api/ai/universities?q=${encodeURIComponent(q)}`
    );
    if (!res.ok) throw new Error("Failed to fetch colleges");
    const data = await res.json();
    
    // The AI returns { name, branch, location, country }
    return (data as any[]).map((u) => ({
      label: u.branch && u.branch !== "Main Campus" 
        ? `${u.name} - ${u.branch}` 
        : u.name,
      sublabel: `${u.location}, ${u.country}`,
      raw: u,
    }));
  } catch (error) {
    console.error("Search Universities AI Error:", error);
    throw error;
  }
}

export async function searchCompanies(q: string): Promise<AutocompleteItem[]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9000';
    const res = await fetch(
      `${apiUrl}/api/ai/companies?q=${encodeURIComponent(q)}`
    );
    if (!res.ok) throw new Error("Failed to fetch companies");
    const data = await res.json();
    return (data as any[]).slice(0, 10).map((c) => ({
      label: c.name,
      sublabel: c.domain,
      // Use the proxy to avoid CORS/Mixed Content issues
      icon: c.logo ? `${apiUrl}/api/ai/proxy-image?url=${encodeURIComponent(c.logo)}` : null,
      raw: c,
    }));
  } catch (error) {
    console.error("Search Companies Error:", error);
    throw error;
  }
}
