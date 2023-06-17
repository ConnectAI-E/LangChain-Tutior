import {OpenAI} from 'langchain/llms/openai';
import {PromptTemplate} from 'langchain';
import {LLMChain, SimpleSequentialChain} from 'langchain/chains';

const llm = new OpenAI({ temperature: 0 ,openAIApiKey:process.env.VITE_OPENAI_TOKEN});

// chain 1 -- product name
const template = `What is the best name to describe a company that makes {product}`;
const productTemplate = new PromptTemplate({
    template,
    inputVariables: ["product"],
});
const productChain = new LLMChain({ llm, prompt: productTemplate });


//chain 2 -- r
const companyPrompt = `为以下公司提供一个20个词的描述： \\
    公司:{company_name}`;
const companyPromptTemplate = new PromptTemplate({
    template:  companyPrompt,
    inputVariables: ["company_name"],
});
const reviewChain = new LLMChain({
    llm: llm,
    prompt: companyPromptTemplate,
});



const overallChain = new SimpleSequentialChain({
    chains: [productChain, reviewChain],
    verbose: true,
});
export const simpleSequentialChain = async () => {
    const re = await overallChain.run("Queen Size Sheet Set");
    console.log(re);
    return re;
}
