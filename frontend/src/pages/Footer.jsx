import { Code, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-24 px-10 border-t border-gray-800">

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">

        {/* Project Info */}
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-lg">

            <div className="login-logo">
              <h1>
                <span className="logo-brackets">{"</>"}</span>
                <span className="logo-text"> CodeCollab</span>
              </h1>
            </div>

          </div>

          <p className="text-gray-400 mt-4 text-sm leading-relaxed">
            A real-time collaborative coding platform developed as a 
            final-year project to enable teams to code together seamlessly.
          </p>
        </div>



        {/* Project */}
        <div>
          <h4 className="text-gray-300 font-semibold mb-5">
            PROJECT
          </h4>

          <ul className="space-y-3 text-gray-400 text-sm">

            <li>
              <a href="#features" className="hover:text-cyan-400 transition">
                About CodeCollab
              </a>
            </li>

            <li>
              <a href="#how" className="hover:text-cyan-400 transition">
                How It Works
              </a>
            </li>

            <li>
              <a href="#architecture" className="hover:text-cyan-400 transition">
                Architecture
              </a>
            </li>

            <li>
              <a href="#cta" className="hover:text-cyan-400 transition">
                Demo / Try Now
              </a>
            </li>

          </ul>
        </div>



        {/* Features */}
        <div>
          <h4 className="text-gray-300 font-semibold mb-5">
            FEATURES
          </h4>

          <ul className="space-y-3 text-gray-400 text-sm">

            <li className="hover:text-cyan-400 cursor-pointer transition">
              Real-time Collaboration
            </li>

            <li className="hover:text-cyan-400 cursor-pointer transition">
              Workspace Management
            </li>

            <li className="hover:text-cyan-400 cursor-pointer transition">
              Version History
            </li>

            <li className="hover:text-cyan-400 cursor-pointer transition">
              AI Project Explanation
            </li>

          </ul>
        </div>



        {/* Contact (Updated) */}
        <div>
          <h4 className="text-gray-300 font-semibold mb-5">
            CONTACT
          </h4>

          <ul className="space-y-3 text-gray-400 text-sm">

            <li>
              <span className="text-gray-500">Team:</span> CodeCollab Developers
            </li>

            <li className="flex items-center gap-2">
              <Mail size={16} className="text-cyan-400" />
              <span className="hover:text-cyan-400 transition cursor-pointer">
                codecollab18@gmail.com
              </span>
            </li>

            <li className="text-gray-500">
              Silicon Institute of Technology
            </li>

            <li className="text-gray-500">
              Computer Science Engineering
            </li>

          </ul>
        </div>

      </div>



      {/* Bottom Line */}

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">

        © 2026 CodeCollab — Final Year Project | Silicon Institute of Technology

      </div>

    </footer>
  );
}