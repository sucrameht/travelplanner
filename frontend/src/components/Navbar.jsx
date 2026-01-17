import { Compass } from 'lucide-react';

export default function Navbar({ onOpenModal }) {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
        <div className="p-2 text-white rounded-full bg-teal-600">
          <Compass size={24} />
        </div>
        WanderSmart
      </div>
      <button 
        onClick={onOpenModal}
        className="cursor-pointer px-6 py-2 text-white transition rounded-lg bg-teal-600 hover:bg-teal-700 font-medium shadow-md shadow-teal-100"
      >
        + New Trip
      </button>
    </nav>
  );
}