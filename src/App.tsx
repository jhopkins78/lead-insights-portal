
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';
import './App.css';
import { ProductProvider } from './contexts/ProductContext';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductProvider>
        <Router>
          <Routes>
            <Route path="/" element={<DashboardLayout />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </ProductProvider>
    </QueryClientProvider>
  );
}

export default App;
