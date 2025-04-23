import { useState, useEffect } from 'react';
import { getCandidate, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';


const CandidateSearch: React.FC = () => {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [noMoreCandidates, setNoMoreCandidates] = useState<boolean>(false);

  const [usernameSearch, setUsernameSearch] = useState<string>('');
  const [searchError, setSearchError] = useState<string>('');

  const fetchNextCandidate = async () => {
    setLoading(true);
    setSearchError('');
    try {
      const candidate = await getCandidate();
      if (candidate) {
        setCurrentCandidate(candidate);
        setNoMoreCandidates(false);
      } else {
        setCurrentCandidate(null);
        setNoMoreCandidates(true);
      }
    } catch {
      setCurrentCandidate(null);
      setNoMoreCandidates(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!usernameSearch.trim()) return;
    setLoading(true);
    setSearchError('');
    try {
      const data = await searchGithubUser(usernameSearch.trim());
      if (data && data.login) {
        setCurrentCandidate({
          name: data.name || 'N/A',
          login: data.login,
          location: data.location || 'N/A',
          avatar_url: data.avatar_url,
          email: data.email || 'N/A',
          html_url: data.html_url,
          company: data.company || 'N/A',
        });
        setNoMoreCandidates(false);
      } else {
        setCurrentCandidate(null);
        setNoMoreCandidates(true);
        setSearchError('User not found.');
      }
    } catch {
      setSearchError('Error fetching that user.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (!currentCandidate) return;
    const saved = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    saved.push(currentCandidate);
    localStorage.setItem('savedCandidates', JSON.stringify(saved));
    setUsernameSearch('');
    fetchNextCandidate();
  };
  const handleSkip = () => {
    setUsernameSearch('');
    fetchNextCandidate();
  };

  useEffect(() => {
    fetchNextCandidate();
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', color: '#fff' }}>
      {/* — Page Header — */}
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Candidate Search
      </h1>

      {/* — Search / Next Controls — */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Search by username"
          value={usernameSearch}
          onChange={e => setUsernameSearch(e.target.value)}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: 4,
            border: '1px solid #444',
          }}
        />
        <button onClick={handleSearch}>🔍</button>
        <button onClick={fetchNextCandidate}>Next</button>
      </div>
      {searchError && <p style={{ color: 'salmon' }}>{searchError}</p>}

      {/* — Candidate / Loading / Empty States — */}
      {loading && <p>Loading candidate…</p>}
      {!loading && noMoreCandidates && (
        <p>No more candidates available.</p>
      )}

      {!loading && currentCandidate && (
        <div
          style={{
            padding: '1rem',
            border: '1px solid #eee',
            borderRadius: 12,
            background: '#111',
            textAlign: 'center',
          }}
        >
          <img
            src={currentCandidate.avatar_url}
            alt="avatar"
            style={{ width: 100, borderRadius: '50%' }}
          />
          <h2>
            {currentCandidate.name} <br />
            <small>@{currentCandidate.login}</small>
          </h2>
          <p>
            <strong>Location:</strong> {currentCandidate.location}
          </p>
          <p>
            <strong>Email:</strong> {currentCandidate.email}
          </p>
          <p>
            <strong>Company:</strong> {currentCandidate.company}
          </p>
          <a
            href={currentCandidate.html_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              marginBottom: '1rem',
              color: '#646cff',
            }}
          >
            View GitHub Profile
          </a>

          {/* ➕➖ Buttons */}
          <div className="button-group">
            <button onClick={handleAccept}>➕</button>
            <button onClick={handleSkip}>➖</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;
