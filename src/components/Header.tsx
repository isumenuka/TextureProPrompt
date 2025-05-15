import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-amber-700/90 to-amber-900/90 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-300" />
          <h1 className="text-2xl font-bold">TexturePro Prompt</h1>
        </div>
        <p className="text-amber-200 text-sm hidden sm:block">Generate beautiful texture prompts</p>
      </div>
    </header>
  );
};

export default Header;