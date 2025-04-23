import type { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Nav: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="nav" style={{ display: 'flex', gap: '1rem', padding: '1rem', justifyContent: 'center' }}>
      <button
        onClick={() => navigate('/')}
        className={`nav-button ${pathname === '/' ? 'active' : ''}`}
      >
        Search Candidates
      </button>
      <button
        onClick={() => navigate('/saved')}
        className={`nav-button ${pathname === '/saved' ? 'active' : ''}`}
      >
        Saved Candidates
      </button>
    </nav>
  );
};

export default Nav;
