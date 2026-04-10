import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-10 py-3 border-b border-cyan-400/20 sticky top-0 z-50 bg-inherit backdrop-blur-lg">

      <div className="login-logo">
            <h1>
              <span className="logo-brackets">{"</>"}</span>
              <span className="logo-text"> CodeCollab</span>
            </h1>
          </div>

      <div className="flex gap-8 text-gray-300">

        <a href="#features">Features</a>
        <a href="#why">Why Us</a>
        <a href="#how">How It Works</a>

      </div>

      <div className="flex gap-4">

        <Link to="/login">
          <button className="text-gray-300">
            Log In
          </button>
        </Link>

        <Link to="/register">
          <button className="bg-cyan-500 px-4 py-2 rounded-lg">
            Get Started
          </button>
        </Link>

      </div>

    </div>
  );
}