import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  console.log(`Testing model: gemini-1.5-flash with apiVersion: v1...`);
  try {
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      apiVersion: "v1",
    });
    const res = await model.invoke("Hello");
    console.log(`✅ Success: ${res.content}`);
  } catch (err) {
    console.log(`❌ Failed: ${err.message}`);
  }
}

test();
