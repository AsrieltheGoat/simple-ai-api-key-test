const fs = require("fs");
const axios = require("axios");

// Path to the file containing API keys, one per line
const filePath = "in.txt";

// Function to check each API key
const checkApiKey = async (apiKey) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: "gpt-4o-mini",
                prompt: "Say this is a test",
                max_tokens: 7,
                temperature: 0.7,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        console.log(`Success with API Key: ${apiKey}`);
        console.log("Response:", response.data);
        return true; // If successful, return true
    } catch (error) {
        console.error(`Error with API Key: ${apiKey}`);
        console.error("Error message:", error.message);
        return false; // If failed, return false
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
