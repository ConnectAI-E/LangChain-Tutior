import {OpenAI} from 'langchain/llms/openai';
import {LLMChain, LLMRouterChain, MultiPromptChain} from 'langchain/chains';
import {ChatPromptTemplate} from 'langchain/prompts';
import {PromptTemplate} from 'langchain';
import exp from 'constants';
import {RouterOutputParser} from 'langchain/output_parsers';

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
    "Good for answering questions about math",
    "Good for answering questions about history",
    "Good for answering questions about computer",
];
const promptTemplates = promptNames.map((name, i) => {
    return promptMap[name];
})




//default chain
const defaultPrompt = '{input}'
const defaultPromptTemplate = new PromptTemplate({
    template: defaultPrompt,
    inputVariables: ['input'],
})
const defaultChain = new LLMChain({ llm: model, prompt: defaultPromptTemplate });


// router chain
let routerTemplate = `Given a raw text input to a 
language model select the model prompt best suited for the input. 
You will be given the names of the available prompts and a 
description of what the prompt is best suited for. 
You may also revise the original input if you think that revising
it will ultimately lead to a better response from the language model.

<< FORMATTING >>
Return a markdown code snippet with a JSON object formatted to look like:
\`\`\`json
{{{{
    "destination": string \ name of the prompt to use or "DEFAULT"
    "next_inputs": string \ a potentially modified version of the original input
}}}}
\`\`\`



<< CANDIDATE PROMPTS >>
{destinations}

<< INPUT >>
{{input}}

<< OUTPUT (remember to include the \`\`\`json)>>\`

REMEMBER: "next_inputs" can just be the original input 
if you don't think any modifications are needed.


REMEMBER: "destination" MUST be one of the candidate prompt 
names specified below OR it can be "DEFAULT" if the input is not
well suited for any of the candidate prompts.
`

const destinationTemplate = `"{name}": "{description}"`
const destinationTemplates = promptNames.map((name, i) => {
    return destinationTemplate.replace('{name}', name).replace('{description}', promptDescriptions[i]);
})
const destinations = destinationTemplates.join(',\n');
routerTemplate = routerTemplate.replace('{destinations}', destinations);

let routerParser = RouterOutputParser.fromNamesAndDescriptions({
    destination: 'name of the prompt to use or "DEFAULT"',
    next_inputs: 'a potentially modified version of the original input',
});
let routerFormat = routerParser.getFormatInstructions();

let routerPrompt = new PromptTemplate({
    template: routerTemplate,
    inputVariables: ['input'],
    outputParser: routerParser,
    partialVariables: {
        format_instructions: routerFormat
    }
});
let routerChain = LLMRouterChain.fromLLM(model,routerPrompt );


//
// Build an array of destination LLMChains and a list of the names with descriptions
let destinationChains = {} as any;

// let prompt = new PromptTemplate({template: promptMap[item], inputVariables: ['input']});
// let chain = new LLMChain({llm: model, prompt: prompt});
// destinationChains[item] = chain;
for (let i = 0; i <promptTemplates.length  ; i++) {
    let prompt = new PromptTemplate({template: promptTemplates[i], inputVariables: ['input']});
    let chain = new LLMChain({llm: model, prompt: prompt});
    destinationChains[promptNames[i]]=chain
}



const multiPromptChain = new MultiPromptChain({
    routerChain,
    destinationChains,
    defaultChain,
    verbose: true
},);

export const physics_try = async () => {
    const resA = await multiPromptChain.call({ input: 'What is black body radiation?' });
    console.log(resA);
}

export const math_try = async () => {
    const resA = await multiPromptChain.run('what is 2 + 2' );
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

