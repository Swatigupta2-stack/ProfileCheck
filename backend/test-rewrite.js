import { rewriteBullet } from "./services/rewriteService.js";

async function test() {
  try {
    const res = await rewriteBullet("I did some coding", ["React", "Node.js"]);
    console.log("Success:", res);
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

test();
