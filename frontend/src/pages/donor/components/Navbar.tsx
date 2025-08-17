import { useState } from "react";
import { MenuIcon, X as CloseIcon, UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-[#B02629]">
            LifeDrop
          </Link>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="#home"
            className="text-gray-800 hover:text-[#B02629] transition-colors"
          >
            Home
          </Link>
          <a
            href="#why-donate"
            className="text-gray-800 hover:text-[#B02629] transition-colors"
          >
            Why Donate
          </a>
          <a
            href="#get-involved"
            className="text-gray-800 hover:text-[#B02629] transition-colors"
          >
            Get Involved
          </a>
          <Link
            to="/#campaigns"
            className="text-gray-800 hover:text-[#B02629] transition-colors"
          >
            Campaigns
          </Link>
          <a
            href="#contact"
            className="text-gray-800 hover:text-[#B02629] transition-colors"
          >
            Contact
          </a>
          <button
            className="bg-[#B02629] text-white px-6 py-2 rounded-full hover:bg-[#9a1f22] transition-colors"
            onClick={() => navigate("/donor/bloodRequestsPage")}
          >
            Donate Now
          </button>
          <button
            className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
            onClick={() => navigate("/donor/profile")}
            aria-label="Profile"
          >
            <UserIcon size={20} className="text-gray-800" />
          </button>
        </nav>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white p-4 border-t">
          <nav className="flex flex-col space-y-4">
            <Link
              to="#home"
              className="text-gray-800 hover:text-[#B02629] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <a
              href="#why-donate"
              className="text-gray-800 hover:text-[#B02629] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Why Donate
            </a>
            <a
              href="#get-involved"
              className="text-gray-800 hover:text-[#B02629] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Involved
            </a>
            <Link
              to="/#campaigns"
              className="text-gray-800 hover:text-[#B02629] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Campaigns
            </Link>
            <a
              href="#contact"
              className="text-gray-800 hover:text-[#B02629] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <button
              className="bg-[#B02629] text-white px-6 py-2 rounded-full hover:bg-[#9a1f22] transition-colors w-full"
              onClick={() => {
                navigate("/blood-requests");
                setIsMenuOpen(false);
              }}
            >
              Donate Now
            </button>
            <button
              className="flex items-center justify-center space-x-2 bg-gray-100 py-2 rounded-full hover:bg-gray-200 transition-colors w-full"
              onClick={() => {
                navigate("/profile");
                setIsMenuOpen(false);
              }}
            >
              <UserIcon size={20} className="text-gray-800" />
              <span>Profile</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
