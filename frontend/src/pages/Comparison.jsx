import { XCircle, CheckCircle, GitBranch, Code } from "lucide-react";

export default function Comparison() {
  return (
    <section className="py-32 px-10" id="why">

      {/* TITLE */}
      <div className="text-center mb-20">

        <p className="text-cyan-400 text-sm tracking-widest mb-3">
          WHY CODECOLLAB
        </p>

        <h2 className="text-5xl font-bold">
          Git workflow vs{" "}
          <span className="text-cyan-400">
            CodeCollab
          </span>
        </h2>

      </div>


      {/* GRID */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">

        {/* LEFT CARD */}
        <div className="
        bg-cyan-500/5
          border border-cyan-400/30
              rounded-2xl
          p-8
        ">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">

            <div className="bg-red-500/10 p-3 rounded-lg">
              <GitBranch className="text-red-400" size={20}/>
            </div>

            <h3 className="text-red-400 font-semibold text-lg">
              Traditional Git
            </h3>

          </div>


          {/* Points */}
          <div className="space-y-5 text-gray-400">

            <div className="flex gap-3">
              <XCircle className="text-red-400" size={18}/>
              Learn complex CLI commands
            </div>

            <div className="flex gap-3">
              <XCircle className="text-red-400" size={18}/>
              Resolve merge conflicts manually
            </div>

            <div className="flex gap-3">
              <XCircle className="text-red-400" size={18}/>
              Branch management overhead
            </div>

            <div className="flex gap-3">
              <XCircle className="text-red-400" size={18}/>
              Risk of overwriting teammates' code
            </div>

            <div className="flex gap-3">
              <XCircle className="text-red-400" size={18}/>
              Steep learning curve for beginners
            </div>

          </div>

        </div>



        {/* RIGHT CARD */}
        <div className="
          bg-[#07284e] border border-cyan-400
          rounded-2xl
          p-8
          shadow-[0_0_20px_rgba(34,211,238,0.35)]
        ">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">

            <div className="bg-cyan-500/10 p-3 rounded-lg">
              <Code className="text-cyan-400" size={20}/>
            </div>

            <h3 className="text-cyan-400 font-semibold text-lg">
              CodeCollab
            </h3>

          </div>


          {/* Points */}
          <div className="space-y-5 text-gray-300">

            <div className="flex gap-3">
              <CheckCircle className="text-cyan-400" size={18}/>
              Just open the link and code
            </div>

            <div className="flex gap-3">
              <CheckCircle className="text-cyan-400" size={18}/>
              Conflicts resolved automatically
            </div>

            <div className="flex gap-3">
              <CheckCircle className="text-cyan-400" size={18}/>
              No branches needed
            </div>

            <div className="flex gap-3">
              <CheckCircle className="text-cyan-400" size={18}/>
              Everyone sees changes live
            </div>

            <div className="flex gap-3">
              <CheckCircle className="text-cyan-400" size={18}/>
              Zero learning curve
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}