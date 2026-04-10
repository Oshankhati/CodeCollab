import { Users, GitBranch, Shield, Folder, Terminal, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  return (
    <section id="features" className="py-28 px-10">

      {/* Title */}
      <div className="text-center mb-20 mt-0.5">
        <p className="text-cyan-400 mb-3">FEATURES</p>

        <h2 className="text-5xl font-bold">
          Everything you need to
          <br />
          <span className="text-cyan-400"> code as a team</span>
        </h2>

        <p className="text-gray-400 mt-4">
          No more fighting with Git. Focus on what matters — building great software.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">

        {/* BIG CARD */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: [0.95, 1.05, 1], opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          whileHover={{
            scale: 1.03,
            borderColor: "#22d3ee",
            boxShadow: "0 0 25px rgba(34,211,238,0.35)"
          }}
          className="col-span-2 row-span-2 bg-[#07284e] border border-cyan-500/20 p-8 rounded-xl transition"
        >

          <Users className="text-cyan-400 mb-6" size={32} />

          <h3 className="text-xl font-semibold mb-4">
            Live Multiplayer Editing
          </h3>

          <p className="text-gray-400">
            See teammates' cursors, selections, and edits in real time.
            Every keystroke syncs instantly across all connected editors.
            It's like Google Docs, but for code.
          </p>

          <div className="flex gap-3 mt-6">
            <span className="px-3 py-1 bg-cyan-500/10 rounded-full text-sm text-cyan-300">Mahi</span>
            <span className="px-3 py-1 bg-blue-500/10 rounded-full text-sm text-blue-300">Shaan</span>
            <span className="px-3 py-1 bg-purple-500/10 rounded-full text-sm text-purple-300">Goon</span>
          </div>

        </motion.div>


        {/* RIGHT CARD 1 */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: [0.95, 1.05, 1], opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{
            scale: 1.05,
            borderColor: "#22d3ee",
            boxShadow: "0 0 20px rgba(34,211,238,0.35)"
          }}
          className="bg-[#07284e] border border-gray-800 p-6 rounded-xl transition"
        >

          <GitBranch className="text-cyan-400 mb-4" size={26} />

          <h3 className="font-semibold mb-2">
            Zero-Config Versioning
          </h3>

          <p className="text-gray-400 text-sm">
            Every change auto-saved with full history.
          </p>

        </motion.div>


        {/* RIGHT CARD 2 */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: [0.95, 1.05, 1], opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          whileHover={{
            scale: 1.05,
            borderColor: "#22d3ee",
            boxShadow: "0 0 20px rgba(34,211,238,0.35)"
          }}
          className="bg-[#07284e] border border-gray-800 p-6 rounded-xl transition"
        >

          <Shield className="text-cyan-400 mb-4" size={26} />

          <h3 className="font-semibold mb-2">
            Conflict-Free
          </h3>

          <p className="text-gray-400 text-sm">
            CRDT-powered engine merges edits automatically.
          </p>

        </motion.div>


        {/* BOTTOM 1 */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: [0.95, 1.05, 1], opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          whileHover={{
            scale: 1.05,
            borderColor: "#22d3ee",
            boxShadow: "0 0 20px rgba(34,211,238,0.35)"
          }}
          className="bg-[#07284e] border border-gray-800 p-6 rounded-xl transition"
        >

          <Folder className="text-cyan-400 mb-4" size={26} />

          <h3 className="font-semibold mb-2">
            Shared Workspaces
          </h3>

          <p className="text-gray-400 text-sm">
            File management and team organization built-in.
          </p>

        </motion.div>


        {/* BOTTOM 2 */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: [0.95, 1.05, 1], opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          whileHover={{
            scale: 1.05,
            borderColor: "#22d3ee",
            boxShadow: "0 0 20px rgba(34,211,238,0.35)"
          }}
          className="bg-[#07284e] border border-gray-800 p-6 rounded-xl transition"
        >

          <Terminal className="text-cyan-400 mb-4" size={26} />

          <h3 className="font-semibold mb-2">
            Powerful Editor
          </h3>

          <p className="text-gray-400 text-sm">
            Syntax highlighting, autocomplete, multi-language.
          </p>

        </motion.div>


        {/* BOTTOM 3 */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: [0.95, 1.05, 1], opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          viewport={{ once: true }}
          whileHover={{
            scale: 1.05,
            borderColor: "#22d3ee",
            boxShadow: "0 0 20px rgba(34,211,238,0.35)"
          }}
          className="bg-[#07284e] border border-gray-800 p-6 rounded-xl transition"
        >

          <Zap className="text-cyan-400 mb-4" size={26} />

          <h3 className="font-semibold mb-2">
            Instant Deploy
          </h3>

          <p className="text-gray-400 text-sm">
            Export or deploy with a single click.
          </p>

        </motion.div>

      </div>

    </section>
  );
}