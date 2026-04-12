


// import { Lock, Globe, Zap } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// export default function Hero() {
//   const navigate = useNavigate();
//   const [showDemo, setShowDemo] = useState(false);

//   // 🔥 Start Free Workspace logic
//   const handleStart = () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/login");
//     } else {
//       navigate("/dashboard");
//     }
//   };

//   return (
//     <section className="text-center py-32 px-10">

//       {/* Badge */}
//       <span className="inline-flex items-center gap-2 px-4 py-2 text-sm 
//       text-cyan-300 bg-cyan-500/10 border border-cyan-400/30 
//       rounded-full backdrop-blur-sm mb-6">
//         <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
//         Real-time collaborative coding — no Git needed
//       </span>

//       {/* Heading */}
//       <h1 className="text-8xl font-bold mb-10">
//         Code Together.
//         <br />
//         <span className="text-cyan-400">
//           Ship Faster.
//         </span>
//       </h1>

//       {/* Description */}
//       <p className="text-gray-400 max-w-2xl mx-auto mb-10">
//         The collaborative coding platform that replaces Git for teams. Write, edit, and ship code together in real time — no branches, no conflicts, no complexity.
//       </p>

//       {/* Buttons */}
//       <div className="flex justify-center gap-4">

//         {/* 🚀 Start Button */}
//         <button
//           onClick={handleStart}
//           className="bg-cyan-500 px-6 py-3 rounded-lg text-black hover:scale-105 transition"
//         >
//           Start Free Workspace →
//         </button>

//         {/* 🎬 Watch Demo */}
//         <button
//           onClick={() => setShowDemo(true)}
//           className="border border-cyan-400 px-6 py-3 rounded-lg hover:bg-cyan-500/10 transition"
//         >
//           Watch Demo
//         </button>

//       </div>

//       {/* Footer Info */}
//       <div className="flex justify-center items-center gap-4 text-gray-400 text-sm mt-11">

//         <div className="flex items-center gap-2">
//           <Lock size={16} className="text-cyan-400"/>
//           <span>End-to-end encrypted</span>
//         </div>

//         <span className="text-gray-600">|</span>

//         <div className="flex items-center gap-2">
//           <Globe size={16} className="text-cyan-400" />
//           <span>Works in any browser</span>
//         </div>

//         <span className="text-gray-600">|</span>

//         <div className="flex items-center gap-2">
//           <Zap size={16} className="text-cyan-400"/>
//           <span>Setup in 10 seconds</span>
//         </div>

//       </div>

//       {/* 🎥 DEMO MODAL */}
//       {showDemo && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">

//           <div className="bg-[#0f172a] p-6 rounded-2xl w-[90%] max-w-3xl shadow-xl">

//             <h2 className="text-xl mb-4 text-white">CodeCollab Demo</h2>

//             <video controls autoPlay className="w-full rounded-lg">
//               <source src="/demo.mp4" type="video/mp4" />
//               Your browser does not support video.
//             </video>

//             <button
//               onClick={() => setShowDemo(false)}
//               className="mt-4 px-4 py-2 bg-cyan-500 rounded-lg text-black"
//             >
//               Close
//             </button>

//           </div>
//         </div>
//       )}

//     </section>
//   );
// }




import { Lock, Globe, Zap, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Hero() {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

  // 🚀 Start Free Workspace logic
  const handleStart = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <section className="text-center py-32 px-10">

      {/* Badge */}
      <span className="inline-flex items-center gap-2 px-4 py-2 text-sm 
      text-cyan-300 bg-cyan-500/10 border border-cyan-400/30 
      rounded-full backdrop-blur-sm mb-6">
        <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
        Real-time collaborative coding — no Git needed
      </span>

      {/* Heading */}
      <h1 className="text-7xl md:text-8xl font-bold mb-10 leading-tight">
        Code Together.
        <br />
        <span className="text-cyan-400">
          Ship Faster.
        </span>
      </h1>

      {/* Description */}
      <p className="text-gray-400 max-w-2xl mx-auto mb-10">
        The collaborative coding platform that replaces Git for teams. Write, edit, and ship code together in real time — no branches, no conflicts, no complexity.
      </p>

      {/* Buttons */}
      <div className="flex justify-center gap-4">

        {/* 🚀 Start Button */}
        <button
          onClick={handleStart}
          className="bg-cyan-500 px-6 py-3 rounded-lg text-black font-semibold hover:scale-105 transition"
        >
          Start Free Workspace →
        </button>

        {/* 🎬 Watch Demo */}
        <button
          onClick={() => setShowDemo(true)}
          className="border border-cyan-400 px-6 py-3 rounded-lg hover:bg-cyan-500/10 transition"
        >
          Watch Demo
        </button>

      </div>

      {/* Footer Info */}
      <div className="flex justify-center items-center gap-4 text-gray-400 text-sm mt-11 flex-wrap">

        <div className="flex items-center gap-2">
          <Lock size={16} className="text-cyan-400"/>
          <span>End-to-end encrypted</span>
        </div>

        <span className="text-gray-600">|</span>

        <div className="flex items-center gap-2">
          <Globe size={16} className="text-cyan-400" />
          <span>Works in any browser</span>
        </div>

        <span className="text-gray-600">|</span>

        <div className="flex items-center gap-2">
          <Zap size={16} className="text-cyan-400"/>
          <span>Setup in 10 seconds</span>
        </div>

      </div>

      {/* 🎥 DEMO MODAL */}
      {showDemo && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setShowDemo(false)} // click outside closes
        >

          <div
            className="bg-[#0f172a] p-6 rounded-2xl w-[90%] max-w-3xl shadow-xl relative"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >

            {/* Close Icon */}
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl mb-4 text-white">CodeCollab Demo</h2>

            {/* 🎥 Video */}
            <video
              controls
              autoPlay
              className="w-full rounded-lg"
            >
              <source src="/demo.mp4" type="video/mp4" />
              Your browser does not support video.
            </video>

          </div>
        </div>
      )}

    </section>
  );
}