import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white px-6 h-16 flex items-center justify-between shadow-sm">
      <h1 className="text-xl font-semibold">
        <Link to="/dashboard">APROVA.AE</Link>
      </h1>
      <div>
        <Button variant="outline">Perfil</Button>
      </div>
    </header>
  );
};

export default Header;
