// ATS Scoring — analyses resume text vs (optional) job description
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resumeText, jobDescription } = await req.json();
    if (!resumeText || !resumeText.trim()) {
      return new Response(JSON.stringify({ error: "Missing resumeText" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    const tools = [
      {
        type: "function",
        function: {
          name: "submit_ats_report",
          description: "Submit the ATS analysis report",
          parameters: {
            type: "object",
            properties: {
              score: { type: "integer", description: "Overall ATS score 0-100" },
              breakdown: {
                type: "object",
                properties: {
                  keywords: { type: "integer" },
                  formatting: { type: "integer" },
                  impact: { type: "integer" },
                  clarity: { type: "integer" },
                },
                required: ["keywords", "formatting", "impact", "clarity"],
              },
              strengths: { type: "array", items: { type: "string" } },
              improvements: { type: "array", items: { type: "string" } },
              missingKeywords: { type: "array", items: { type: "string" } },
              summary: { type: "string" },
            },
            required: ["score", "breakdown", "strengths", "improvements", "missingKeywords", "summary"],
            additionalProperties: false,
          },
        },
      },
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are an ATS (Applicant Tracking System) expert. Analyse the resume against the job description (if provided) or general best practices. Be precise, return JSON via tool call only.",
          },
          {
            role: "user",
            content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription || "(none — score against general best practices)"}\n\nReturn the ATS report.`,
          },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "submit_ats_report" } },
      }),
    });

    if (res.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit. Try again shortly." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (res.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!res.ok) {
      const t = await res.text();
      return new Response(JSON.stringify({ error: t }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    const args = call ? JSON.parse(call.function.arguments) : null;
    if (!args) {
      return new Response(JSON.stringify({ error: "No structured response" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
