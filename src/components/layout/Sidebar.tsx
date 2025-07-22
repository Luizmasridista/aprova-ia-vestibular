import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/study-plan', label: 'Grade de Estudos com IA' },
    { path: '/estudos', label: 'Cursos' },
    { path: '/simulados', label: 'Simulados' },
    { path: '/questoes', label: 'Questões' },
    { path: '/perfil', label: 'Perfil' },
  ];

  return (
    <aside className="bg-white shadow-md h-full w-64 fixed top-0 left-0 pt-16 z-30 hidden lg:block">
      <nav className="ml-4 mt-5">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>
                <Button
                  variant={location.pathname === item.path ? 'default' : 'ghost'}
                  className="w-full justify-start text-left rounded-md"
                >
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
