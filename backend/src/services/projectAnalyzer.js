export function analyzeProject(files) {
  const names = files.map(f => f.name.toLowerCase());
  const paths = files.map(f => (f.path || "").toLowerCase());

  const techStack = new Set();
  const features = new Set();
  let architecture = "Simple folder-based architecture";

  // --- TECH STACK DETECTION ---
  if (names.includes("package.json")) {
    techStack.add("Node.js");
    techStack.add("JavaScript");
  }

  if (names.some(n => n.includes("app") && n.endsWith(".jsx"))) {
    techStack.add("React");
  }

  if (names.includes("server.js")) {
    techStack.add("Express.js");
  }

  if (names.includes(".env")) {
    techStack.add("Environment Configuration");
  }

  // --- FEATURE DETECTION ---
  if (names.some(n => n.includes("auth"))) {
    features.add("Authentication & Authorization");
  }

  if (names.some(n => n.includes("socket"))) {
    features.add("Real-time collaboration");
  }

  if (names.some(n => n.includes("version"))) {
    features.add("Version history & rollback");
  }

  if (names.some(n => n.includes("file"))) {
    features.add("Cloud file system");
  }

  if (names.some(n => n.includes("workspace"))) {
    features.add("Workspace-based collaboration");
  }

  // --- ARCHITECTURE DETECTION ---
  if (
    paths.some(p => p.includes("controllers")) &&
    paths.some(p => p.includes("routes"))
  ) {
    architecture = "MVC (Model-View-Controller)";
  }

  return {
    overview:
      "This project is a collaborative software application designed to allow multiple users to work together on a shared codebase in real time.",
    techStack: Array.from(techStack),
    features: Array.from(features),
    architecture,
    fileCount: files.length
  };
}
