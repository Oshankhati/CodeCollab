import { Monitor, Server, Database, Wifi } from "lucide-react";

export default function Architecture() {
  return (
    <section className="py-32 px-10" id="architecture">

      {/* Title */}
      <div className="text-center mb-20" >

        <p className="text-cyan-400 text-sm tracking-widest mb-3">
          SYSTEM ARCHITECTURE
        </p>

        <h2 className="text-5xl font-bold">
          How <span className="text-cyan-400">CodeCollab</span> is built
        </h2>

        <p className="text-gray-400 mt-4">
          The platform combines modern web technologies to enable
          real-time collaborative development.
        </p>

      </div>


      {/* Architecture Flow */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">

        {/* Browser */}
        <div className="bg-cyan-500/5
  border border-cyan-400/30
  rounded-2xl
  p-8
  transition-all
  duration-300
  hover:scale-105
  hover:border-cyan-400
  hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]">

          <div className="bg-cyan-500/10 w-14 h-14 flex items-center justify-center rounded-lg mx-auto mb-4">
            <Monitor className="text-cyan-400" size={26}/>
          </div>

          <h3 className="font-semibold mb-2">
            User Browser
          </h3>

          <p className="text-gray-400 text-sm">
            Developers access CodeCollab through a web browser interface.
          </p>

        </div>


        {/* Frontend */}
        <div className="bg-cyan-500/5
  border border-cyan-400/30
  rounded-2xl
  p-8
  transition-all
  duration-300
  hover:scale-105
  hover:border-cyan-400
  hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]">

          <div className="bg-cyan-500/10 w-14 h-14 flex items-center justify-center rounded-lg mx-auto mb-4">
            <Wifi className="text-cyan-400" size={26}/>
          </div>

          <h3 className="font-semibold mb-2">
            React Frontend
          </h3>

          <p className="text-gray-400 text-sm">
            Provides the collaborative editor, workspace UI and real-time updates.
          </p>

        </div>


        {/* Backend */}
        <div className="bg-cyan-500/5
          border border-cyan-400/30
              rounded-2xl
          p-8
          transition-all
          duration-300
          hover:scale-105
          hover:border-cyan-400
          hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]">

          <div className="bg-cyan-500/10 w-14 h-14 flex items-center justify-center rounded-lg mx-auto mb-4">
            <Server className="text-cyan-400" size={26}/>
          </div>

          <h3 className="font-semibold mb-2">
            Node.js Backend
          </h3>

          <p className="text-gray-400 text-sm">
            Handles authentication, workspaces, APIs and collaboration logic.
          </p>

        </div>


        {/* Database */}
        <div className="bg-cyan-500/5
  border border-cyan-400/30
  rounded-2xl
  p-8
  transition-all
  duration-300
  hover:scale-105
  hover:border-cyan-400
  hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]">

          <div className="bg-cyan-500/10 w-14 h-14 flex items-center justify-center rounded-lg mx-auto mb-4">
            <Database className="text-cyan-400" size={26}/>
          </div>

          <h3 className="font-semibold mb-2">
            MongoDB Database
          </h3>

          <p className="text-gray-400 text-sm">
            Stores users, workspaces, files, and version history.
          </p>

        </div>

      </div>


      {/* Real-time layer */}
      <div className="text-center mt-10 text-gray-400">

        <span className="text-cyan-400 font-semibold">
          Real-time collaboration powered by Socket.IO
        </span>

      </div>

    </section>
  );
}