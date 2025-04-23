import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'login', label: 'Username' },
  { value: 'location', label: 'Location' },
  { value: 'company', label: 'Company' },
];

const SavedCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filterText, setFilterText] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'login' | 'location' | 'company'>('name');

  useEffect(() => {
    const stored = localStorage.getItem('savedCandidates') || '[]';
    try {
      setCandidates(JSON.parse(stored));
    } catch {
      setCandidates([]);
    }
  }, []);

  const removeCandidate = (loginToRemove: string) => {
    const updated = candidates.filter(c => c.login !== loginToRemove);
    setCandidates(updated);
    localStorage.setItem('savedCandidates', JSON.stringify(updated));
  };

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(filterText.toLowerCase()) ||
    c.login.toLowerCase().includes(filterText.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) =>
    (a[sortKey] || '').toString().localeCompare((b[sortKey] || '').toString())
  );

  if (candidates.length === 0) {
    return <p>No candidates have been accepted.</p>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', color: '#fff' }}>
      <h1>Potential Candidates</h1>

      {/* Filter & Sort Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by name or username"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #444' }}
        />
        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value as any)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444' }}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              Sort by {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Candidate List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sorted.map(c => (
          <li
            key={c.login}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.5rem',
              padding: '1rem',
              border: '1px solid #444',
              borderRadius: '8px',
              background: '#111',
            }}
          >
            <img
              src={c.avatar_url}
              alt={`${c.login} avatar`}
              style={{ width: '80px', borderRadius: '50%', marginRight: '1rem' }}
            />
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 .5rem', color: '#fff' }}>
                {c.name} <small style={{ opacity: 0.7 }}>@{c.login}</small>
              </h2>
              <p style={{ margin: 0 }}><strong>Location:</strong> {c.location}</p>
              <p style={{ margin: 0 }}><strong>Email:</strong> {c.email}</p>
              <p style={{ margin: 0 }}><strong>Company:</strong> {c.company}</p>
              <a
                href={c.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '.5rem', color: '#646cff' }}
              >
                View GitHub Profile
              </a>
            </div>
            <button
              onClick={() => removeCandidate(c.login)}
              style={{
                marginLeft: '1rem',
                background: '#c00',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedCandidates;
