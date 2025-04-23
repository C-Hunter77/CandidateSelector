import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';

const App: React.FC = () => {
  return (
    <main>
      <Nav />
      <Outlet />
    </main>
  );
};

export default App;
