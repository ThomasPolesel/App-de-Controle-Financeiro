
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  History, 
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const navItems = [
    {
      title: 'Dashboard',
      path: '/',
      icon: <Home className="w-5 h-5" />
    },
    {
      title: 'Gráficos',
      path: '/graficos',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      title: 'Histórico',
      path: '/historico',
      icon: <History className="w-5 h-5" />
    }
  ];

  return (
    <nav className="w-full md:w-auto">
      <ul className="flex flex-row md:flex-col gap-1 p-2">
        {navItems.map((item) => (
          <li key={item.path} className="w-full">
            <NavLink
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              <span className="hidden md:inline">{item.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
