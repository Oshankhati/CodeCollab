import { useEffect, useState } from "react";
import { getHeatmap } from "../api/analytics.api";
import "../styles/Heatmap.css";

export default function Heatmap({ workspaceId }) {

  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getHeatmap(workspaceId, token);
        setData(res.data);
      } catch {
        console.error("Heatmap load failed");
      }
    };

    load();
  }, [workspaceId]);

  const total = data.reduce((sum, u) => sum + u.edits, 0);

  const colors = [
    "#00c6ff",
    "#22c55e",
    "#f97316",
    "#eab308",
    "#ef4444",
    "#a855f7",
    "#14b8a6"
  ];

  /* build gradient segments */

  let start = 0;
  const segments = data.map((u, i) => {
    const percent = (u.edits / total) * 100;
    const color = colors[i % colors.length];

    const seg = `${color} ${start}% ${start + percent}%`;
    start += percent;
    return seg;
  });

  const gradient = `conic-gradient(${segments.join(", ")})`;

  return (
    <div className="heatmap-card">

      <div className="heatmap-title">
        Team Contributions
      </div>

      {data.length === 0 && (
        <div className="heatmap-empty">
          No activity yet
        </div>
      )}

      {data.length > 0 && (
        <>
          <div className="team-ring" style={{ background: gradient }}>
            <div className="team-ring-inner">
              {total}
              <span>edits</span>
            </div>
          </div>

          <div className="team-legend">

            {data.map((u, i) => (
              <div key={u.name} className="legend-row">

                <span
                  className="legend-color"
                  style={{ background: colors[i % colors.length] }}
                />

                <span className="legend-name">{u.name}</span>

                <span className="legend-value">
                  {Math.round((u.edits / total) * 100)}%
                </span>

              </div>
            ))}

          </div>
        </>
      )}

    </div>
  );
}