import { spawn } from "node:child_process";

function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
      env,
    });
    let output = "";
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      output += text;
      process.stdout.write(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      output += text;
      process.stderr.write(text);
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}\n${output}`));
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryablePrismaLockError(error) {
  const message = String(error?.message || "");
  return message.includes("P1002") || message.includes("advisory lock");
}

async function runPrismaMigrateWithRetry(env, maxAttempts = 5) {
  let attempt = 1;
  while (attempt <= maxAttempts) {
    try {
      await run("npx", ["prisma", "migrate", "deploy"], env);
      return;
    } catch (error) {
      if (!isRetryablePrismaLockError(error) || attempt === maxAttempts) {
        throw error;
      }
      const delayMs = 4000 * attempt;
      console.warn(
        `prisma migrate deploy hit advisory lock timeout (attempt ${attempt}/${maxAttempts}). Retrying in ${delayMs}ms...`,
      );
      await sleep(delayMs);
      attempt += 1;
    }
  }
}

async function main() {
  const env = { ...process.env };
  if (!env.DIRECT_URL && env.DATABASE_URL) {
    env.DIRECT_URL = env.DATABASE_URL;
  }

  await runPrismaMigrateWithRetry(env);
  await run("npx", ["next", "build"], env);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
