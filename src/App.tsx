
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InputForm from './pages/Form'
import Navigation from './components/layout/Navigation';
import Home from './pages/Home';

function App() {
  return (
    
    <Router>
      <Navigation/>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<InputForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
