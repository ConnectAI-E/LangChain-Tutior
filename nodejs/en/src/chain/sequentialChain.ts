import {OpenAI} from 'langchain/llms/openai';
import {PromptTemplate} from 'langchain';
import {LLMChain, SequentialChain} from 'langchain/chains';


const llm = new OpenAI({ temperature: 0 ,openAIApiKey:process.env.VITE_OPENAI_TOKEN});

// chain 1 :Review -> English_Review
const template = `Translate the following review to english: {Review}`;
const firstTemplate = new PromptTemplate({
    template,
    inputVariables: ["Review"],
});
const reviewChain = new LLMChain({ llm, prompt: firstTemplate,outputKey:"English_Review" });


//chain 2-1 : English_Review -> summary
const template2 = `Can you summarize the following review in 1 sentence:{English_Review}`
const secondTemplate = new PromptTemplate({
    template:  template2,
    inputVariables: ["English_Review"],
})
const summaryChain = new LLMChain({ llm, prompt: secondTemplate,outputKey:"Summary" });

//chain 2-2 review->language
const template3 = `What language is the following review in:{Review}`
const thirdTemplate = new PromptTemplate({
    template:  template3,
    inputVariables: ["Review"],
})
const languageChain = new LLMChain({ llm, prompt: thirdTemplate,outputKey:"Language" });


//chain 3-1 : summary+language -> followup_message

const template4 = `Write a follow up response to the following summary in the specified language:"
"Summary: {Summary}\n\nLanguage: {Language}`
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
    const re = await overallChain.run("Je trouve le goût médiocre. La mousse ne tient pas, c'est bizarre. J'achète les mêmes dans le commerce et le goût est bien meilleur...\\nVieux lot ou contrefaçon !?");
    console.log(re);
    return re;
}
