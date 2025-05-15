import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 text-sm p-4 mt-auto">
      <div className="max-w-6xl mx-auto text-center">
        <p>TexturePro Prompt Generator © {new Date().getFullYear()}</p>
        <p className="mt-1">
          A powerful tool for generating detailed texture prompts for AI image generation
        </p>
      </div>
    </footer>
  );
};

export default Footer;