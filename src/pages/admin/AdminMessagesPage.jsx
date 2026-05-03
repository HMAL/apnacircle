import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { f } from "../../components/formHelpers";
import { fetchContactMessages } from "../../lib/db";
import AdminGate from "./AdminGate";

const PAGE_SIZE = 10;

const fmt = d => d ? new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) : "";

export default function AdminMessagesPage() {
  return (
    <AdminGate>
      {({ logout }) => <MessagesDashboard logout={logout} />}
    </AdminGate>
  );
}

function MessagesDashboard({ logout }) {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);

  const refresh = async () => {
    const data = await fetchContactMessages();
    setMessages(data);
    setPage(1);
  };

  useEffect(() => {
    refresh();
  }, []);

  const totalPages = Math.max(1, Math.ceil(messages.length / PAGE_SIZE));
  const visible = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return messages.slice(start, start + PAGE_SIZE);
  }, [messages, page]);

  return (
    <main style={s.page}>
      <div style={s.header}>
        <div>
          <Link to="/admin" style={s.back}>Back to admin</Link>
          <h1 style={s.title}>Messages</h1>
        </div>
        <div style={s.actions}>
          <button style={f.btnOutline} onClick={refresh}>Refresh</button>
          <button style={f.btnOutline} onClick={logout}>Logout</button>
        </div>
      </div>

      {messages.length === 0 ? (
        <p style={f.empty}>No contact messages yet.</p>
      ) : (
        <>
          {visible.map(message => <MessageCard key={message.id} message={message} />)}
          {messages.length > PAGE_SIZE && (
            <div style={s.pagination}>
              <button style={f.btnOutline} disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
              <span style={s.pageText}>Page {page} of {totalPages}</span>
              <button style={f.btnOutline} disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

function MessageCard({ message }) {
  return (
    <article style={s.card}>
      <div style={s.cardHeader}>
        <div>
          <h2 style={s.name}>{message.name}</h2>
          <p style={s.email}>{message.email}</p>
        </div>
        <span style={s.date}>{fmt(message.created_at)}</span>
      </div>
      <p style={s.message}>{message.message}</p>
    </article>
  );
}

const s = {
  page: { padding:"1.5rem 1.5rem 3rem", maxWidth:960, margin:"0 auto" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:"1.5rem", flexWrap:"wrap" },
  back: { color:"var(--orange)", fontSize:13, fontWeight:600 },
  title: { fontSize:28, fontWeight:800, color:"#111", marginTop:6 },
  actions: { display:"flex", gap:8, flexWrap:"wrap" },
  card: { background:"#fff", border:"0.5px solid var(--border)", borderRadius:10, padding:"1.25rem", marginBottom:12 },
  cardHeader: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap", marginBottom:8 },
  name: { fontSize:16, fontWeight:800, color:"#111", marginBottom:2 },
  email: { fontSize:13, color:"var(--muted)" },
  date: { fontSize:12, color:"var(--muted)", fontWeight:700 },
  message: { fontSize:14, color:"#333", lineHeight:1.6, whiteSpace:"pre-wrap" },
  pagination: { display:"flex", justifyContent:"center", alignItems:"center", gap:12, marginTop:"1.5rem" },
  pageText: { fontSize:13, fontWeight:700, color:"#555" },
};
