import {OpenAI} from 'langchain/llms/openai';
import {LLMChain, MultiPromptChain} from 'langchain/chains';
import {ChatPromptTemplate} from 'langchain/prompts';
import {PromptTemplate} from 'langchain';
import exp from 'constants';

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


