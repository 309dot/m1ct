import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Details } from './pages/Details';
import { Home } from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bean/:slug" element={<Details />} />
          <Route path="/coffee/:slug" element={<Details />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
