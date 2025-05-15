import React from 'react';
import Header from './components/Header';
import PromptGenerator from './components/PromptGenerator';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow py-6">
        <PromptGenerator />
      </main>
      <Footer />
    </div>
  );
}

export default App;