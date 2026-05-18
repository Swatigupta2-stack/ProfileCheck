import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function test() {
  console.log(`Testing model: gemini-1.5-flash with direct SDK...`);
  try {
    const result = await model.generateContent("Hello");
    const response = await result.response;
    const text = response.text();
    console.log(`✅ Success: ${text}`);
  } catch (err) {
    console.log(`❌ Failed: ${err.message}`);
  }
}

test();
