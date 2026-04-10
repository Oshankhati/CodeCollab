import { FolderPlus, Users, Zap } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-32 px-10" id="how">

      {/* Title */}
      <div className="text-center mb-20">

        <p className="text-cyan-400 text-sm tracking-widest mb-3">
          HOW IT WORKS
        </p>

        <h2 className="text-5xl font-bold">
          Start collaborating{" "}
          <span className="text-cyan-400">
          in seconds
          </span>
        </h2>

      </div>


      {/* Steps Container */}
      <div className="max-w-6xl mx-auto relative">

        {/* Connecting line */}
        <div className="
          absolute
          top-10
          left-0
          right-0
          h-[1px]
          bg-gradient-to-r
          from-transparent
          via-cyan-400/30
          to-transparent
        "></div>


        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-20 text-center relative">

          {/* STEP 1 */}
          <div>

            <div className="
              w-20 h-20
              mx-auto
              flex items-center justify-center
              bg-cyan-500/10
              border border-cyan-400/30
              rounded-xl
              shadow-[0_0_30px_rgba(0,255,255,0.08)]
              transition-all
  duration-300
  hover:scale-105
  hover:border-cyan-400
  hover:shadow-[0_0_40px_rgba(34,211,238,0.45)]
            ">
              <FolderPlus className="text-cyan-400 " size={30} />
            </div>

            <p className="text-xs text-gray-500 mt-6 tracking-widest">
              STEP 01
            </p>

            <h3 className="text-xl font-semibold mt-2">
              Create a Workspace
            </h3>

            <p className="text-gray-400 mt-3 text-sm">
              Name your project, set permissions,
              and get a shareable link in seconds.
            </p>

          </div>


          {/* STEP 2 */}
          <div>

            <div className="
              w-20 h-20
              mx-auto
              flex items-center justify-center
              bg-cyan-500/10
              border border-cyan-400/30
              rounded-xl
              shadow-[0_0_30px_rgba(0,255,255,0.08)]
              transition-all
  duration-300
  hover:scale-105
  hover:border-cyan-400
  hover:shadow-[0_0_40px_rgba(34,211,238,0.45)]
            ">
              <Users className="text-cyan-400" size={30}/>
            </div>

            <p className="text-xs text-gray-500 mt-6 tracking-widest">
              STEP 02
            </p>

            <h3 className="text-xl font-semibold mt-2">
              Invite & Code
            </h3>

            <p className="text-gray-400 mt-3 text-sm">
              Share the link. Everyone opens the editor
              and starts coding — changes appear instantly.
            </p>

          </div>


          {/* STEP 3 */}
          <div>

            <div className="
              w-20 h-20
              mx-auto
              flex items-center justify-center
              bg-cyan-500/10
              border border-cyan-400/30
              rounded-xl
              shadow-[0_0_30px_rgba(0,255,255,0.08)]
              transition-all
  duration-300
  hover:scale-105
  hover:border-cyan-400
  hover:shadow-[0_0_40px_rgba(34,211,238,0.45)]
            ">
              <Zap className="text-cyan-400" size={30}/>
            </div>

            <p className="text-xs text-gray-500 mt-6 tracking-widest">
              STEP 03
            </p>

            <h3 className="text-xl font-semibold mt-2">
              Ship It
            </h3>

            <p className="text-gray-400 mt-3 text-sm">
              Download your project, push to a repo,
              or deploy directly. Full version history included.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}