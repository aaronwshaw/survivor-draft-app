import { spawn } from "node:child_process";

function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      env,
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function main() {
  const env = { ...process.env };
  if (!env.DIRECT_URL && env.DATABASE_URL) {
    env.DIRECT_URL = env.DATABASE_URL;
  }

  await run("npx", ["prisma", "migrate", "deploy"], env);
  await run("npx", ["next", "build"], env);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
