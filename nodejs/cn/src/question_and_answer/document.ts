import {OpenAI} from 'langchain/llms/openai';
import {OpenAIEmbeddings} from 'langchain/embeddings';
import {CSVLoader} from 'langchain/document_loaders';
import {HNSWLib} from 'langchain/vectorstores';
import {s} from 'vitest/dist/types-0373403c';
import {RetrievalQAChain} from 'langchain/chains';


let llm = new OpenAI({temperature: 0.0,openAIApiKey:process.env.VITE_OPENAI_TOKEN});
let embedding = new OpenAIEmbeddings({
    openAIApiKey:process.env.VITE_OPENAI_TOKEN
});



export const documentLoader = async () => {
    // First we can use the document loader to load the information we will be searching
    let loader = new CSVLoader('src/question_and_answer/OutdoorClothingCatalog_1000.csv');
    let docs = await loader.load();
    // let vectorStore = await HNSWLib.fromDocuments(docs, embedding);
    console.log(docs[0]);
}


export const showEmbedding = async()=>{
    let embed = await embedding.embedQuery('你好，我叫Nigel。');
    console.log(embed.length);
    console.log(embed.slice(0, 5));
}


export const queryVectorStore = async () => {
    let query2 = '请推荐一款具有防晒功能的衬衫。';
    let loader = new CSVLoader('src/question_and_answer/OutdoorClothingCatalog_1000.csv');
    let docs = await loader.load();

    let vectorStore = await HNSWLib.fromDocuments(docs, embedding);
    let result2 = await vectorStore.similaritySearch(query2);
    console.log(result2.length);
    console.log(result2[0]);
    return result2


}

export const queryLLM = async () => {
    const result = await queryVectorStore() as any
    let compiledDocs = result.reduce((collected:string, doc:any) => collected.concat('\n', doc.pageContent), '');
    console.log(compiledDocs);

    let query = ' 请使用Markdown列出所有带有防晒功能的衬衫，并对每个衬衫进行总结。'
    let response1 = await llm.call(compiledDocs + query);
    console.log(response1);
}


export const retrieverQA = async () => {
    let loader = new CSVLoader('src/question_and_answer/OutdoorClothingCatalog_1000.csv');
    let docs = await loader.load();
    let vectorStore = await HNSWLib.fromDocuments(docs, embedding);
    let retriever = vectorStore.asRetriever();

    // it defaults to the stuff chain [See notes]
    let retrevalChain = RetrievalQAChain.fromLLM(llm, retriever);

    let query3 = '请使用Markdown列出所有带有防晒功能的衬衫，并对每个衬衫进行总结。';
    let result3 = await retrevalChain.call({query: query3});
    console.log(result3);

}
