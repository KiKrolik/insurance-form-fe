import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav
      className="sticky top-0 z-50 p-4 shadow-md flex justify-between items-center bg-primary text-white"
      style={{ backgroundColor: 'var(--color-primary, #00008f)', width: '100%' }}
    >
      <div>
      <Link to="/" className="mr-6 hover:underline">Home</Link>
      <Link to="/form" className="hover:underline">Form</Link>
      </div>
    </nav>
  );
};

export default Navigation;
