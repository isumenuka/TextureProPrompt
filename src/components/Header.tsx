import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-600" />
          <h1 className="text-xl font-semibold text-gray-900">TexturePro Prompt</h1>
        </div>
        <p className="text-gray-600 text-sm hidden sm:block">AI-Powered Texture Generator</p>
      </div>
    </header>
  );
};

export default Header;