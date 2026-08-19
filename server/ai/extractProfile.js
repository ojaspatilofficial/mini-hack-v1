import ai from "./gemini.js";

export async function extractProfile(userMessage) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",

    contents: `
You are an information extraction system for an NGO support platform called Sahayak.

Extract information from the user's message.

Required fields:
- age
- location
- education
- incomeLevel
- goal

Rules:
1. Never invent information.
2. If information is not provided, return null.
3. incomeLevel must be one of:
   - "low"
   - "medium"
   - "high"
   - null
4. Keep the goal short and meaningful.
5. Return only JSON.

User message:
${userMessage}
`,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",
        properties: {
          age: {
            type: ["integer", "null"]
          },

          location: {
            type: ["string", "null"]
          },

          education: {
            type: ["string", "null"]
          },

          incomeLevel: {
            type: ["string", "null"]
          },

          goal: {
            type: ["string", "null"]
          }
        },

        required: [
          "age",
          "location",
          "education",
          "incomeLevel",
          "goal"
        ]
      }
    }
  });
adsfdsa
  return JSON.parse(response.text);
}