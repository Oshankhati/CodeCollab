// import { Sparkles, MessageSquare } from "lucide-react";
// import ContactModal from "./ContactModal";
// import { useState } from "react";
// export default function CTA() {
//   const [showModal, setShowModal] = useState(false);
//   return (
//     <section className="py-32 px-6" id="cta">

//       <div className="
//         max-w-7xl
//         mx-auto
//         mt-0.5
//         text-center
//         bg-[#07284e]
//         border border-cyan-400/20
//         rounded-3xl
//         p-16
//         shadow-[0_0_60px_rgba(0,255,255,0.08)]
//         relative
//       ">

//         {/* Badge */}
//         <div className="
//           inline-flex
//           items-center
//           gap-2
//           px-4
//           py-2
//           mb-6
//           rounded-full
//           bg-cyan-500/10
//           border border-cyan-400/20
//           text-cyan-400
//           text-sm
//         ">
//           <Sparkles size={16}/>
//           Free forever for small teams
//         </div>


//         {/* Title */}
//         <h2 className="text-5xl font-bold leading-tight">
//           Ready to code{" "}
//           <br />
//           <span className="text-cyan-400">
//             without the chaos?
//           </span>
//         </h2>


//         {/* Description */}
//         <p className="text-gray-400 mt-6 text-lg">
//           Create your first workspace in seconds.  
//           No credit card required.
//         </p>


//         {/* Buttons */}
//         <div className="flex justify-center gap-6 mt-10 flex-wrap">

//           <button className="
//             px-8
//             h-10
//             rounded-lg
//           bg-cyan-400
//           text-black
//             font-semibold
//             hover:scale-105
//             transition
//             flex
//             items-center
//             justify-center  
//           ">
//           Get Started Free →
//         </button>

//           {/* <button className="
//             px-8
//             h-10
//             rounded-lg
//             border
//             border-gray-700
//             text-gray-200
//             flex
//             items-center
//             gap-2
//             hover:border-cyan-400
//             transition
//           ">
//             <MessageSquare size={18}/>
//             Talk to Us
//           </button> */}

//           <button
//   onClick={() => setShowModal(true)}
//   className="
//     px-6 py-2
//     border border-gray-700
//     rounded-lg
//     hover:border-cyan-400
//     hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]
//     transition
//   "
// >
//   Talk to Us
// </button>
// {showModal && <ContactModal onClose={() => setShowModal(false)} />}

//         </div>

//       </div>

//     </section>
//   );
// }














import { Sparkles, MessageSquare } from "lucide-react";
import ContactModal from "./ContactModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS

export default function CTA() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // ✅ ADD THIS

  return (
    <section className="py-32 px-6" id="cta">

      <div className="
        max-w-7xl
        mx-auto
        mt-0.5
        text-center
        bg-[#07284e]
        border border-cyan-400/20
        rounded-3xl
        p-16
        shadow-[0_0_60px_rgba(0,255,255,0.08)]
        relative
      ">

        {/* Badge */}
        <div className="
          inline-flex
          items-center
          gap-2
          px-4
          py-2
          mb-6
          rounded-full
          bg-cyan-500/10
          border border-cyan-400/20
          text-cyan-400
          text-sm
        ">
          <Sparkles size={16}/>
          Free forever for small teams
        </div>

        {/* Title */}
        <h2 className="text-5xl font-bold leading-tight">
          Ready to code{" "}
          <br />
          <span className="text-cyan-400">
            without the chaos?
          </span>
        </h2>

        {/* Description */}
        <p className="text-gray-400 mt-6 text-lg">
          Create your first workspace in seconds.  
          No credit card required.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-6 mt-10 flex-wrap">

          {/* 🚀 UPDATED BUTTON */}
          <button
            onClick={() => navigate("/login")} // ✅ THIS LINE
            className="
              px-8
              h-10
              rounded-lg
              bg-cyan-400
              text-black
              font-semibold
              hover:scale-105
              transition
              flex
              items-center
              justify-center  
            "
          >
            Get Started Free →
          </button>

          {/* Talk to Us */}
          <button
            onClick={() => setShowModal(true)}
            className="
              px-6 py-2
              border border-gray-700
              rounded-lg
              hover:border-cyan-400
              hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]
              transition
            "
          >
            Talk to Us
          </button>

          {showModal && <ContactModal onClose={() => setShowModal(false)} />}

        </div>

      </div>

    </section>
  );
}