import React from 'react';
import Header from './components/Header';
import CustomPromptGenerator from './components/CustomPromptGenerator';
import PromptGenerator from './components/PromptGenerator';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="max-w-4xl mx-auto px-4">
          <CustomPromptGenerator />
          <PromptGenerator />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;