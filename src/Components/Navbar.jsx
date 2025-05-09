import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#f0fdf4] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center relative">
        {/* Logo / Title */}
        <h1 className="text-2xl font-bold text-[#10b981]">🍹 The Juice Farm</h1>

        {/* Hamburger Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#065f46] focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
        {/* <li>
              <Link to="/" className="block text-[#065f46] hover:text-[#059669] font-medium transition-colors duration-200">
                Quote of the Day
              </Link>
            </li> */}
          {/* <li>
            <Link to="/drink-vote" className="text-[#065f46] hover:text-[#059669] font-medium transition-colors duration-200">
              Drink of the Day
            </Link>
          </li> */}
          <li>
            <Link to="/jukebox" className="text-[#065f46] hover:text-[#059669] font-medium transition-colors duration-200">
              Music Jukebox
            </Link>
          </li>
          {/* <li>
            <Link to="/games" className="text-[#065f46] hover:text-[#059669] font-medium transition-colors duration-200">
              Mini Games
            </Link>
          </li> */}
          <li>
            <Link to="/feedback" className="text-[#065f46] hover:text-[#059669] font-medium transition-colors duration-200">
              Feedback
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="space-y-3">
          {/* <li>
              <Link to="/" className="block text-[#065f46] hover:text-[#059669] font-medium transition-colors duration-200">
                Quote of the Day
              </Link>
            </li> */}
            {/* <li>
              <Link to="/drink-vote" className="block text-[#065f46] hover:text-[#059669] font-medium transition-colors duration-200">
                Drink of the Day
              </Link>
            </li> */}
            <li>
              <Link to="/jukebox" className="block text-[#065f46] hover:text-[#059669] font-medium transition-colors duration-200">
                Music Jukebox
              </Link>
            </li>
            {/* <li>
              <Link to="/games" className="block text-[#065f46] hover:text-[#059669] font-medium transition-colors duration-200">
                Mini Games
              </Link>
            </li> */}
            <li>
              <Link to="/feedback" className="block text-[#065f46] hover:text-[#059669] font-medium transition-colors duration-200">
                Feedback
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
