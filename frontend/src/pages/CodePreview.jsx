import { useEffect, useState } from "react";

export default function CodePreview() {

  const lines = [
    '// CodeCollab — real-time collaboration',
    'import { workspace } from "@codecollab/sdk";',
    '',
    'const project = await workspace.create({',
    '  name: "my-awesome-app",',
    '  team: ["mahi","shaan","goon"],',
    '  lang: "typescript"',
    '});',
    '',
    '// Everyone is coding... no conflicts '
  ];

  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLine((prev) => (prev + 1) % lines.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-5 bg-[#07284e] border border-gray-800 rounded-xl p-6 font-mono text-sm text-gray-300">

      {/* Top bar */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>

        <span className="ml-auto text-xs text-gray-500">
          workspace / index.ts
        </span>
      </div>

      {/* Code lines */}
      <div className="space-y-1">

        {lines.map((line, index) => (
          <div
            key={index}
            className={`px-3 py-1 rounded-md transition-all duration-500
              ${activeLine === index
                ? "bg-cyan-500/10 border-l-2 border-cyan-400"
                : ""
              }`}
          >
            <span className="text-gray-500 mr-4">
              {index + 1}
            </span>

            {line}
          </div>
        ))}

      </div>

    </div>
  );
}