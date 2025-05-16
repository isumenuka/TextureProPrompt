import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-8">
      <div className="max-w-4xl mx-auto px-4 text-center text-gray-600 text-sm">
        <p>TexturePro Prompt Generator © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;