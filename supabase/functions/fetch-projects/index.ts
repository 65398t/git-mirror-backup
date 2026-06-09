import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ProjectResult {
  id: string;
  name: string;
  description: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { provider, orgUrl, pat } = await req.json();

    if (!provider || !orgUrl || !pat) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: provider, orgUrl, pat" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let projects: ProjectResult[] = [];

    if (provider === "azure_devops") {
      const base = orgUrl.replace(/\/+$/, "");
      const apiUrl = `${base}/_apis/projects?api-version=7.1`;
      const credentials = btoa(`:${pat}`);

      const response = await fetch(apiUrl, {
        headers: { Authorization: `Basic ${credentials}` },
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        return new Response(
          JSON.stringify({ error: `Azure DevOps API error: HTTP ${response.status} - ${text}` }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const data = await response.json();
      projects = (data.value || []).map((p: { id: string; name: string; description?: string }) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
      }));
    } else if (provider === "github") {
      const orgName = orgUrl.replace(/\/+$/, "").split("/").pop() || "";
      const apiUrl = `https://api.github.com/orgs/${orgName}/repos?per_page=100&sort=name`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${pat}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        return new Response(
          JSON.stringify({ error: `GitHub API error: HTTP ${response.status} - ${text}` }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const repos = await response.json();
      projects = (repos || []).map((r: { id: number; name: string; description?: string }) => ({
        id: String(r.id),
        name: r.name,
        description: r.description || "",
      }));
    } else {
      return new Response(
        JSON.stringify({ error: `Unknown provider: ${provider}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ projects }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});