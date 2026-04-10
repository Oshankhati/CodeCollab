
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

export const runCode = (language, code, input = "") => {
  return new Promise((resolve, reject) => {
    const jobId = uuid();

    let fileName;
    let dockerImage;
    let runCommand;

    // 📌 Ensure temp folder exists
    if (!fs.existsSync("temp")) {
      fs.mkdirSync("temp");
    }

    // 📌 Escape input safely
    const safeInput = input.replace(/"/g, '\\"');

    // 📌 Language configs
    switch (language) {
      case "python":
        fileName = `${jobId}.py`;
        dockerImage = "python:3.10";
        runCommand = `sh -c "echo \\"${safeInput}\\" | python ${fileName}"`;
        break;

      case "javascript":
        fileName = `${jobId}.js`;
        dockerImage = "node:18";
        runCommand = `sh -c "echo \\"${safeInput}\\" | node ${fileName}"`;
        break;

      case "c":
        fileName = `${jobId}.c`;
        dockerImage = "gcc:latest";
        runCommand = `sh -c "gcc ${fileName} -o ${jobId} && echo \\"${safeInput}\\" | ./${jobId}"`;
        break;

      case "java":
        dockerImage = "eclipse-temurin:17";

        // Extract class name dynamically
        const match = code.match(/public\s+class\s+(\w+)/);

        if (!match) {
          return reject("Java code must contain 'public class ClassName'");
        }

        const className = match[1];
        fileName = `${className}.java`;

        runCommand = `sh -c "javac ${fileName} && echo \\"${safeInput}\\" | java ${className}"`;
        break;

      default:
        return reject("Unsupported language");
    }

    const filePath = path.join("temp", fileName);

    // 📌 Save code
    fs.writeFileSync(filePath, code);

    // 📌 Fix Windows path
    const tempDir = path.resolve("temp").replace(/\\/g, "/");

    // 🔒 Secure Docker command (Windows-safe)
    const command = `docker run --rm --memory="100m" --cpus="0.5" --network="none" -v "${tempDir}:/app" -w /app ${dockerImage} ${runCommand}`;

    console.log("Running Docker Command:\n", command);

    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      // 🧹 Cleanup
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupErr) {
        console.error("Cleanup error:", cleanupErr);
      }

      // ❌ Execution error
      if (error) {
        console.log("ERROR:", error.message);
        console.log("STDERR:", stderr);
        return reject(error.message + "\n" + stderr);
      }

      // ❌ Runtime error
      if (stderr) {
        console.log("STDERR ONLY:", stderr);
        return reject(stderr);
      }

      // ✅ Success
      console.log("OUTPUT:", stdout);
      resolve(stdout);
    });
  });
};