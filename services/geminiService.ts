
import { GoogleGenAI } from "@google/genai";
import { SalesData, Customer } from "../types.ts";

// Always use the named parameter for apiKey and initialize strictly with process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fix: Exporting generateCRMInsight as expected by DashboardHome and AISalesIntelligence
/**
 * Generates CRM insights using Gemini AI.
 * @param salesData Daily sales performance across segments.
 * @param customers Customer profile and loyalty data.
 * @returns A string containing the AI-generated strategic insight.
 */
export async function generateCRMInsight(salesData: SalesData[], customers: Customer[]): Promise<string> {
  try {
    const prompt = `
      You are a strategic business analyst for NOUN CRM, a multi-tenant retail platform operating in SE Asia.
      Analyze the following data and provide a concise, high-impact executive summary (max 250 words).
      
      Sales Data (Weekly Performance):
      ${JSON.stringify(salesData)}
      
      Customer Profiles:
      ${JSON.stringify(customers)}
      
      Focus on:
      1. Growth opportunities in specific segments (Coffee vs Mart).
      2. Customer loyalty trends and behavior.
      3. Actionable recommendations for the next 7 days.
      
      Format your response with clear headings and bullet points. Use a professional, data-driven tone.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Fix: Access .text property directly from GenerateContentResponse
    return response.text || "Unable to generate insights at this time due to lack of response content.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "The AI business strategist is currently offline. Please check your system configuration and data connectivity.";
  }
}
