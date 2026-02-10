import { GoogleGenAI } from "@google/genai";
import { SalesData, Customer } from "../types";

// Always use the named parameter for apiKey and initialize strictly with process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCRMInsight = async (salesData: SalesData[], customers: Customer[]): Promise<string> => {
  const prompt = `
    You are an expert CRM analyst for a hybrid Coffee Shop and Mini Mart business called "NOUN".
    Analyze the following weekly sales data and customer snapshots.
    
    Sales Data (Last 7 Days):
    ${JSON.stringify(salesData)}
    
    Recent Top Customers:
    ${JSON.stringify(customers)}
    
    Provide a brief, strategic summary (max 3 bullet points) focusing on:
    1. Which segment (Coffee vs Mart) is performing better.
    2. A marketing suggestion based on the top customer's favorite item.
    3. An inventory warning or opportunity.
  `;

  try {
    // Calling generateContent directly with the model and prompt. 
    // gemini-3-flash-preview is suitable for basic text analysis tasks like summarization.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // Using the .text property to access the response string (not a method).
    return response.text || "No insights available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights at this time. Please check API configuration.";
  }
};