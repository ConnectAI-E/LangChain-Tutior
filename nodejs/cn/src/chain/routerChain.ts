import {OpenAI} from 'langchain/llms/openai';
import {LLMChain, MultiPromptChain} from 'langchain/chains';
import {ChatPromptTemplate} from 'langchain/prompts';
import {PromptTemplate} from 'langchain';
import exp from 'constants';

const model = new OpenAI({ temperature: 0, openAIApiKey: process.env.VITE_OPENAI_TOKEN,verbose:true });


const promptMap = {
    'physics': 'You are a very smart physics professor. \\\n' +
        'You are great at answering questions about physics in a concise\\\n' +
        'and easy to understand manner. \\\n' +
        'When you don\'t know the answer to a question you admit\\\n' +
        'that you don\'t know.\n' +
        '\n' +
        'Here is a question:\n' +
        '{input}',
    'math': 'You are a very good mathematician. \\\n' +
        'You are great at answering math questions. \\\n' +
        'You are so good because you are able to break down \\\n' +
        'hard problems into their component parts, \n' +
        'answer the component parts, and then put them together\\\n' +
        'to answer the broader question.\n' +
        '\n' +
        'Here is a question:\n' +
        '{input}',
    'history': 'You are a very good historian. \\\n' +
        'You have an excellent knowledge of and understanding of people,\\\n' +
        'events and contexts from a range of historical periods. \\\n' +
        'You have the ability to think, reflect, debate, discuss and \\\n' +
        'evaluate the past. You have a respect for historical evidence\\\n' +
        'and the ability to make use of it to support your explanations \\\n' +
        'and judgements.\n' +
        '\n' +
        'Here is a question:\n' +
        '{input}',
    'computer': ` You are a successful computer scientist.\
        You have a passion for creativity, collaboration,\
        forward-thinking, confidence, strong problem-solving capabilities,\
        understanding of theories and algorithms, and excellent communication \
        skills. You are great at answering coding questions. \
        You are so good because you know how to solve a problem by \
        describing the solution in imperative steps \
        that a machine can easily interpret and you know how to \
        choose a solution that has a good balance between \
        time complexity and space complexity.\
        Here is a question:\
        {input}`,
} as any;

const promptNames = ["physics", "math", "history","computer"];
const promptDescriptions = [
    "Good for answering questions about physics",
    "Good for answering math questions",
    "Good for answering questions about history",
    "Good for answering coding questions",
];
const promptTemplates = promptNames.map((name, i) => {
    return promptMap[name];
})


const defaultPrompt = '{input}'
const defaultPromptTemplate = new PromptTemplate({
    template: defaultPrompt,
    inputVariables: ['input'],
})
const defaultChain = new LLMChain({ llm: model, prompt: defaultPromptTemplate });


const multiPromptChain = MultiPromptChain.fromLLMAndPrompts(model, {
    promptNames,
    promptDescriptions,
    promptTemplates,
    defaultChain,
    llmChainOpts: { verbose: true }
},);

export const physics_try = async () => {
    const resA = await multiPromptChain.call({ input: 'What is black body radiation?' });
    console.log(resA);
}

export const math_try = async () => {
    const resA = await multiPromptChain.call({ input: 'what is 2 + 2' });
    console.log(resA);
}


export const history_try = async () => {
    const resA = await multiPromptChain.call({ input: 'What is the history of the United States?' });
    console.log(resA);
}

export const default_try = async () => {
    const resA = await multiPromptChain.call({ input: 'Why does every cell in our body contain DNA?' });
    console.log(resA);
}

