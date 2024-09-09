const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Path to the file containing API keys, one per line
const filePath = "in.txt";

// Function to check each API key with the Gemini API
const checkApiKey = async (apiKey) => {
  try {
    // Create a new instance using the API key
    const genAI = new GoogleGenerativeAI(apiKey);

    // Specify the model you want to use
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Set the prompt
    const prompt = `say "true" back to me`;

    // Generate content based on the prompt
    const result = await model.generateContent(prompt);

    // Get the response text
    const responseText = result.response.text();
    console.log(`Response from API (API Key: ${apiKey}):`, responseText);

    // Check if the response contains "true" and return based on that
    if (responseText.toLowerCase().includes("true")) {
      console.log("API returned 'true'. Proceeding with this API key.");
      return true; // Valid API key
    } else {
      console.log("API did not return 'true'. Skipping this API key.");
      return false; // Invalid response
    }
  } catch (error) {
    console.error(`Error with API Key: ${apiKey}`, error.message);
    return false; // Failed due to an error
  }
};

// Function to process the API keys sequentially and remove invalid ones
const processApiKeys = async () => {
  try {
    const data = fs.readFileSync(filePath, "utf8"); // Read file synchronously
    const apiKeys = data.split("\n").filter((key) => key.trim() !== ""); // Clean the keys

    const validKeys = [];

    for (const apiKey of apiKeys) {
      const success = await checkApiKey(apiKey.trim());
      if (success) {
        validKeys.push(apiKey.trim()); // Store valid API keys
        console.log(`Valid API Key retained: ${apiKey}`);
      } else {
        console.log(`Invalid API Key removed: ${apiKey}`);
      }
    }

    // Write only valid API keys back to the file
    fs.writeFileSync(filePath, validKeys.join("\n"), "utf8");
    console.log("Updated file with valid API keys.");
  } catch (err) {
    console.error("Error reading or writing the file:", err);
  }
};

// Start processing API keys
processApiKeys();
