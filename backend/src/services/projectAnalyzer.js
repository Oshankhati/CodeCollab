

// backend/src/services/projectAnalyzer.js

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ─────────────────────────────────────────────
// 1. TECH STACK DETECTION
// ─────────────────────────────────────────────
function detectTechStack(names, contents) {
  const techStack = new Set();

  const packageJson = contents["package.json"];

  if (packageJson) {
    techStack.add("Node.js");

    const deps = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    };

    const depMap = {
      react: "React",
      "react-dom": "React",
      vue: "Vue.js",
      "@angular/core": "Angular",
      next: "Next.js",
      express: "Express.js",
      fastify: "Fastify",
      koa: "Koa.js",
      "socket.io": "Socket.IO",
      mongoose: "MongoDB",
      prisma: "Prisma ORM",
      sequelize: "SQL (Sequelize)",
      redis: "Redis",
      graphql: "GraphQL",
      typescript: "TypeScript",
      tailwindcss: "Tailwind CSS",
      vite: "Vite",
      webpack: "Webpack",
      jest: "Jest (Testing)",
    };

    for (const [dep, label] of Object.entries(depMap)) {
      if (deps[dep]) techStack.add(label);
    }
  }

  // File-based detection
  if (names.some(n => n.endsWith(".py"))) techStack.add("Python");
  if (names.some(n => n.endsWith(".java"))) techStack.add("Java");
  if (names.some(n => n.endsWith(".go"))) techStack.add("Go");

  if (names.includes("dockerfile")) techStack.add("Docker");
  if (names.includes(".env")) techStack.add("Environment Configuration");

  return Array.from(techStack);
}

// ─────────────────────────────────────────────
// 2. FEATURE DETECTION
// ─────────────────────────────────────────────
function detectFeatures(names, paths) {
  const features = new Set();
  const all = [...names, ...paths];

  const rules = [
    { keys: ["auth", "login", "jwt", "oauth"], label: "Authentication & Authorization" },
    { keys: ["socket", "ws", "realtime"], label: "Real-time Collaboration" },
    { keys: ["chat", "message"], label: "Messaging System" },
    { keys: ["file", "upload", "storage"], label: "File Management" },
    { keys: ["workspace", "team"], label: "Workspace Collaboration" },
    { keys: ["payment", "stripe"], label: "Payments Integration" },
    { keys: ["notification", "email"], label: "Notifications System" },
    { keys: ["ai", "ml", "model"], label: "AI/ML Capabilities" },
    { keys: ["analytics", "dashboard"], label: "Analytics Dashboard" },
  ];

  for (const rule of rules) {
    if (all.some(p => rule.keys.some(k => p.includes(k)))) {
      features.add(rule.label);
    }
  }

  return Array.from(features);
}

// ─────────────────────────────────────────────
// 3. ARCHITECTURE DETECTION
// ─────────────────────────────────────────────
function detectArchitecture(paths) {
  const has = (key) => paths.some(p => p.includes(key));

  if (has("controllers") && has("routes") && has("models")) {
    return "MVC (Model-View-Controller)";
  }

  if (has("services") && has("repositories")) {
    return "Service-Repository Pattern";
  }

  if (has("graphql")) {
    return "GraphQL API Architecture";
  }

  if (has("microservices")) {
    return "Microservices Architecture";
  }

  return "Modular / Feature-based Architecture";
}

// ─────────────────────────────────────────────
// 4. AI SUMMARY (GROQ + SAFE + DEBUG)
// ─────────────────────────────────────────────
async function generateAISummary(data) {
  console.log("🧠 Calling Groq AI...");

  const prompt = `
You are a senior software architect.

Explain this project clearly and like a human:
- What the project does
- Who will use it
- Why it is useful
- Key strengths

Keep it simple, professional, and engaging.

Project Details:
Architecture: ${data.architecture}
Tech Stack: ${(data.techStack || []).join(", ") || "Not detected"}
Features: ${(data.features || []).join(", ") || "Not detected"}
Files: ${data.fileCount}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    console.log("✅ AI response received");

    return response.choices[0]?.message?.content || "AI response empty.";
  } catch (error) {
    console.error("⚠️ Primary model failed:", error.message);

    try {
      const fallback = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
      });

      console.log("✅ Fallback AI response received");

      return fallback.choices[0]?.message?.content || "Fallback AI failed.";
    } catch (err) {
      console.error("❌ Fallback also failed:", err.message);

      return "AI explanation unavailable. Please try again later.";
    }
  }
}

// ─────────────────────────────────────────────
// MAIN FUNCTION
// ─────────────────────────────────────────────
export async function analyzeProject(files) {
  console.log("📂 Analyzing project...");

  const names = files.map(f => (f.name || "").toLowerCase());
  const paths = files.map(f => (f.path || "").toLowerCase());

  // Parse package.json safely
  const contents = {};
  const pkg = files.find(f => f.name === "package.json");

  if (pkg?.content) {
    try {
      contents["package.json"] = JSON.parse(pkg.content);
    } catch {
      console.warn("⚠️ Invalid package.json");
    }
  }

  const techStack = detectTechStack(names, contents);
  const features = detectFeatures(names, paths);
  const architecture = detectArchitecture(paths);

  const result = {
    techStack: techStack || [],
    features: features || [],
    architecture: architecture || "Unknown",
    fileCount: files.length || 0,
  };

  console.log("📊 Analysis Result:", result);

  // 🔥 AI Explanation
  const overview = await generateAISummary(result);

  return {
    overview: overview || "No overview generated.",
    ...result,
  };
}