import {OpenAI} from 'langchain/llms/openai';
import {PromptTemplate} from 'langchain';
import {LLMChain, SequentialChain} from 'langchain/chains';


const llm = new OpenAI({ temperature: 0 ,openAIApiKey:process.env.VITE_OPENAI_TOKEN});

// chain 1 :Review -> English_Review
const template = `将以下评论翻译成英语: {Review}`;
const firstTemplate = new PromptTemplate({
    template,
    inputVariables: ["Review"],
});
const reviewChain = new LLMChain({ llm, prompt: firstTemplate,outputKey:"English_Review" });


//chain 2-1 : English_Review -> summary
const template2 = `你能用一句话概括下面的评论吗:{English_Review}`
const secondTemplate = new PromptTemplate({
    template:  template2,
    inputVariables: ["English_Review"],
})
const summaryChain = new LLMChain({ llm, prompt: secondTemplate,outputKey:"Summary" });

//chain 2-2 review->language
const template3 = `以下评论所使用的语言是什么:{Review}`
const thirdTemplate = new PromptTemplate({
    template:  template3,
    inputVariables: ["Review"],
})
const languageChain = new LLMChain({ llm, prompt: thirdTemplate,outputKey:"Language" });


//chain 3-1 : summary+language -> followup_message

const template4 = `回复摘要中的指定语言的后续内容：:"
"摘要: {Summary}\n\n语言: {Language}`
const fourthTemplate = new PromptTemplate({
    template:  template4,
    inputVariables: ["Summary","Language"],
})
const followupChain = new LLMChain({ llm, prompt: fourthTemplate,outputKey:"Followup_Message" });


// overall chain
const overallChain = new SequentialChain({
        chains:[reviewChain, summaryChain, languageChain, followupChain],
        verbose: true,
        inputVariables:["Review"],
        outputVariables:["Followup_Message"]
    }
)

export  const sequentialChain = async () => {
    const re = await overallChain.run("我发现味道很糟糕。泡沫不持久，感觉很奇怪。我在商店买的同款产品味道好多了...是旧批次还是假货！？");
    console.log(re);
    return re;
}
