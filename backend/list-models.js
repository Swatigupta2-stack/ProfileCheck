import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function list() {
  try {
    const result = await genAI.listModels();
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

list();
