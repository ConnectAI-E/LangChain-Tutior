import {OpenAI} from 'langchain/llms/openai';
import {LLMChain, LLMRouterChain, MultiPromptChain} from 'langchain/chains';
import {ChatPromptTemplate} from 'langchain/prompts';
import {PromptTemplate} from 'langchain';
import exp from 'constants';
import {RouterOutputParser} from 'langchain/output_parsers';

const model = new OpenAI({ temperature: 0, openAIApiKey: process.env.VITE_OPENAI_TOKEN,verbose:true });


const promptMap = {
    '物理': '您是一位非常聪明的物理教授。' +
        '您擅长以简明易懂的方式回答物理问题。' +
        '当您不知道问题的答案时，您会坦率承认自己不知道。\n' +
        '以下是一个问题：\n' +
        '{input}',
    '数学': '您是一位非常优秀的数学家。' +
        '您擅长回答数学问题。' +
        '您之所以如此出色，是因为您能够将复杂的问题分解为各个组成部分，' +
        '回答这些组成部分，然后将它们整合起来回答更广泛的问题。\n' +
        '以下是一个问题：\n' +
        '{input}',
    '历史': '您是一位非常出色的历史学家。' +
        '您对各个历史时期的人物、事件和背景有着卓越的知识和理解。' +
        '您能够思考、反思、辩论、讨论和评估过去。' +
        '您对历史证据怀有敬意，并有能力利用它来支持您的解释和判断。\n' +
        '以下是一个问题：\n' +
        '{input}',
    '计算机': '您是一位成功的计算机科学家。' +
        '您热衷于创造力、协作、前瞻性思维、自信、强大的问题解决能力、理论和算法的理解，以及出色的沟通能力。' +
        '您擅长回答编程问题。' +
        '您之所以如此出色，是因为您知道如何通过描述一系列机器容易解释的命令步骤来解决问题，' +
        '并且知道如何选择一个在时间复杂度和空间复杂度之间有良好平衡的解决方案。\n' +
        '以下是一个问题：\n' +
        '{input}',
} as any;

const promptNames = ["物理", "数学", "历史","计算机"];
const promptDescriptions = [
    "擅长回答物理问题",
    "擅长回答数学问题",
    "擅长回答历史问题",
    "擅长回答计算机问题",
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
let routerTemplate = `
给定一个原始文本输入给语言模型，选择最适合输入的模型提示。您将得到可用模型提示的名称和适合该提示的描述。如果您认为修改原始输入将最终导致语言模型给出更好的回答，您也可以对原始输入进行修改。

<<格式化>>
返回一个markdown代码片段，其中包含一个JSON对象的格式化表示，如下所示：
\`\`\`json
{{{{
    "destination": 字符串 \ 要使用的模型提示的名称或"DEFAULT"
    "next_inputs": 字符串 \ 原始输入的可能修改版本
}}}}
\`\`\`

<<候选提示>>
{目标}

<<输入>>
{{输入}}

<<输出（记得包含\`\`\`json)>>

注意："next_inputs"如果您认为不需要进行任何修改，可以只是原始输入。

注意："destination"必须是下面指定的候选提示名称之一，或者如果输入不适合任何候选提示，它可以是"DEFAULT"。
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
    const resA = await multiPromptChain.call({ input: '什么是黑体辐射？' });
    console.log(resA);
}

export const math_try = async () => {
    const resA = await multiPromptChain.run('2 + 2等于多少' );
    console.log(resA);
}


export const history_try = async () => {
    const resA = await multiPromptChain.call({ input: '美国的历史是什么？' });
    console.log(resA);
}

export const default_try = async () => {
    const resA = await multiPromptChain.call({ input: '为什么我们身体的每个细胞都含有DNA？' });
    console.log(resA);
}

