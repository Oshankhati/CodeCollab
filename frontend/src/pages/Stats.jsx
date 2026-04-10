export default function Stats() {
  return (
    <div className="grid grid-cols-4 text-center py-20">

      <div>
        <h2 className="text-5xl text-cyan-400 font-bold
">50ms</h2>
        <p className="text-gray-400">Sync latency</p>
      </div>

      <div>
        <h2 className="text-5xl text-cyan-400 font-bold ">100%</h2>
        <p className="text-gray-400">Conflict-free</p>
      </div>

      <div>
        <h2 className="text-5xl text-cyan-400 font-bold  ">0</h2>
        <p className="text-gray-400">Setup required</p>
      </div>

      <div>
        <h2 className="text-5xl text-cyan-400 font-bold ">∞</h2>
        <p className="text-gray-400">Collaborators</p>
      </div>

    </div>
  );
}