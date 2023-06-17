import {ChatOpenAI} from 'langchain/chat_models';
import {Calculator} from 'langchain/tools/calculator';
import { SerpAPI} from 'langchain/tools';
import {initializeAgentExecutorWithOptions} from 'langchain/agents';

//node version need > 18.0.0
let llm = new ChatOpenAI({
    temperature: 0.0
    ,openAIApiKey:process.env.VITE_OPENAI_TOKEN
});

const loadAgent = async () => {
    // more tools list
    // https://js.langchain.com/docs/modules/agents/tools/integrations/
    let tools = [
        new Calculator(), 	// Equivalent of llm-math
        new SerpAPI(process.env.VITE_SERPAPI_TOKEN)	// In place of Wikipedia, Note: this requires an API KEY
    ];

    // To use the serpapi you need to get an API key from here https://serpapi.com/manage-api-key
    // export this to your env under the name VITE_SERPAPI_TOKEN
    let agent = await initializeAgentExecutorWithOptions(
        tools,
        llm,
        {
            agentType: 'chat-zero-shot-react-description',	// An agent that uses chat models, react gets the best results
            verbose: true
        }
    );

    return agent
}

export const calcMath = async () => {
    let agent = await loadAgent()
    let mathResult = await agent.call({ input: 'What is the 25% of 300?' });
    console.log(mathResult);
}

export const searchWiki = async () => {
    let agent = await loadAgent()
    let question = 'Tom M. Mitchell is an American computer scientist ' +
        'and the Founders University Professor at Carnegie Mellon University (CMU) ' +
        'what book did he write?';

    let searchResult = await agent.call({ input: question });
    console.log(searchResult);
}

