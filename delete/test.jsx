// next-app/src/pages/index.tsx
import { useEffect, useState } from 'react';
import HlsPlayer from '../components/HlsPlayer';

type Stream = { key: string; title: string; createdAt: number; live: boolean };

export default function Home() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState<Stream | null>(null);

  async function fetchList() {
    const res = await fetch('/api/streams');
    const j = await res.json();
    setStreams(j);
  }

  useEffect(() => { fetchList(); }, []);

  async function createStream(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    const res = await fetch('/api/streams', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) });
    const j = await res.json();
    setStreams((s) => [j, ...s]);
    setTitle('');
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>HLS Live Demo (Next.js + nginx-rtmp)</h1>

      <section style={{ marginBottom: 20 }}>
        <form onSubmit={createStream}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Stream title (demo)" />
          <button type="submit">Create Stream (returns streamKey)</button>
        </form>
        <p>After creation, push RTMP to: <code>rtmp://localhost:1935/live/&lt;streamKey&gt;</code></p>
      </section>

      <section style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h2>Live Streams</h2>
          <ul>
            {streams.map(s => (
              <li key={s.key}>
                <strong>{s.title}</strong> — key: <code>{s.key}</code>
                <button onClick={() => setSelected(s)} style={{ marginLeft: 8 }}>Play</button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 2 }}>
          {selected ? (
            <>
              <h2>Playing: {selected.title}</h2>
              <HlsPlayer url={`http://localhost:8080/hls/${selected.key}/master.m3u8`} />
            </>
          ) : <p>Select a stream to play.</p>}
        </div>
      </section>
    </main>
  );
}
