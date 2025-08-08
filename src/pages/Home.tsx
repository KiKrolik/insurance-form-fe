import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToForm = () => {
    navigate('/form');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Welcome to Insurance Calculator App, click below to proceed to the form</h2>
      <p>Hint: to simulate FE exception error set start date to past eg. 01.08.2025</p>
      <button
        onClick={handleGoToForm}
        className="bg-blue-600 text-white px-6 py-3 mt-8 rounded shadow hover:bg-blue-700 transition-colors"
      >

        Go to Form
      </button>
    </div>
  );
};

export default Home;