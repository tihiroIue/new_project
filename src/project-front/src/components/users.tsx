// GetUsers.tsx (React + TypeScript; see plain JS version below)
import React, { useEffect, useMemo, useRef, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

type ApiResponse = {
  data: User[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

const INITIAL_URL = "http://localhost:8000/api/v1/customers"; // avoid 0.0.0.0 in browsers

export default function GetUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(INITIAL_URL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = async (url: string) => {
    abortRef.current?.abort(); // cancel any in-flight request
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json: ApiResponse = await res.json();

      setUsers((prev) => [...prev, ...json.data]);
      setNextUrl(json.links.next);
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // const fetchAllRemaining = async () => {
  //   // Sequentially follow `links.next` until done
  //   while (nextUrl) {
  //     await fetchPage(nextUrl);
  //     // let the browser breathe a tick so UI stays responsive
  //     await new Promise((r) => setTimeout(r, 0));
  //   }
  // };

  useEffect(() => {
    if (nextUrl === INITIAL_URL) {
      fetchPage(INITIAL_URL);
    }
    return () => abortRef.current?.abort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        String(u.id).includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div style={{ fontFamily: "system-ui", padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Users</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        {/* <input
          placeholder="Search by name, email, or ID…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: "1 1 420px",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            outline: "none",
          }}
          aria-label="Search users"
        /> */}
        <span style={{ opacity: 0.7 }}>
          Showing {filtered.length.toLocaleString()} of {users.length.toLocaleString()}
          {nextUrl ? " (more available)" : ""}
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <thead style={{ background: "#fafafa" }}>
            <tr>
              {["ID", "Name", "Email"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 14px", borderBottom: "1px solid #eee" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td style={cellStyle}>{u.id}</td>
                <td style={cellStyle}>{u.name}</td>
                <td style={cellStyle}>
                  <a href={`mailto:${u.email}`} style={{ textDecoration: "none" }}>
                    {u.email}
                  </a>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td style={{ padding: 16, opacity: 0.7 }} colSpan={5}>
                  No users match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={() => nextUrl && fetchPage(nextUrl)}
          disabled={!nextUrl || loading}
        >
          {loading ? "Loading…" : nextUrl ? "Load more" : "No more pages"}
        </button>
      </div>
    </div>
  );
}

const cellStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderBottom: "1px solid #f1f1f1",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
};


