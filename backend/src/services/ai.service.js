import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import config from "../config/config.js"
import { searchInternet } from "./internet.service.js"
import z from 'zod'

const model = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: config.MISTRAL_API_KEY,
    temperature: 0.7,
})

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet.")
        })
    }
)

const agent = createAgent({
    model: model,
    tools: [searchInternetTool],
})

export async function generateResponse(messages) {
    try {
        const response = await agent.invoke({
            messages: [
                new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
            `),
                ...(messages.map(msg => {
                    if (msg.role == "user") {
                        return new HumanMessage(msg.content)
                    } else if (msg.role == "ai") {
                        return new AIMessage(msg.content)
                    }
                }))]
        });

        return response.messages[ response.messages.length - 1 ].text;
    } catch (error) {
        console.error("AI Service Error:", error)
        throw new Error("Failed to generate AI response")
    }
}

export async function generateTitle(message) {
    const response = await model.invoke([
        new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
        `),
        new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
            `)
    ]);

    return response.content || response.text;
}