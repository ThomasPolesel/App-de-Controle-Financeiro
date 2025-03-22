
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background animate-fade-in">
      <header className="md:w-64 p-4 border-b md:border-r md:border-b-0 md:min-h-screen bg-card shadow-sm">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
            CF
          </div>
          <h1 className="text-xl font-semibold">Casa Financeira</h1>
        </div>
        <Navigation />
      </header>
      
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
