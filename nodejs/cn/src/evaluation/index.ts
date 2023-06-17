import {ChatOpenAI} from 'langchain/chat_models';
import {OpenAIEmbeddings} from 'langchain/embeddings';
import {CSVLoader} from 'langchain/document_loaders';
import {HNSWLib} from 'langchain/vectorstores';
import {LLMChain, RetrievalQAChain} from 'langchain/chains';
import {StructuredOutputParser} from 'langchain/output_parsers';
import {PromptTemplate} from 'langchain';


let llm = new ChatOpenAI({
    temperature: 0.0,
    openAIApiKey: process.env.VITE_OPENAI_TOKEN,
});
let embedding = new OpenAIEmbeddings({
    openAIApiKey: process.env.VITE_OPENAI_TOKEN,
});

let loader = new CSVLoader('src/evaluation/OutdoorClothingCatalog_1000.csv');

export const loadDocs = async () => {
    let docs = await loader.load();

    // let vectorStore = await HNSWLib.fromDocuments(docs, embedding);
    // Let's select these two documents
    console.log(docs[10]);
    console.log(docs[11]);
};

export const testQA = async () => {
    let examples = [
        {
            query: 'Cozy Comfort Pullover Set是否有侧袋？',
            answer: '有',
        },
        {
            query: 'Ultra-Lofty 850 Stretch Down Hooded Jacket属于哪个系列？',
            answer: 'DownTek系列',
        },
    ] as any;
    let docs = await loader.load();

// Now let's create a node in memory vector store
    let vectorStore = await HNSWLib.fromDocuments(docs, embedding);
    // console.log(123);

// Looks like we cannot specify a doc separator in JS
    let retrevalChain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever());
    // Automated Test Genration
    // At this time there is no JS equivalent of the QAGenerateChain
    // to automatically generate evaluation question from the data set.
    // Although we can use a custom prompt and structured output to fullfil the task.

    let template1 = '作为一个测试工程师，你需要设计基于查询的测试。\n ' +
        '请根据以下的文档，在开始和结束文档标记之间，' +
        '生成一个基于该文档的查询和答案。\n' +
        '回复时，请仅使用以下的格式指示：\n\n' +
        '{format_instructions}\n\n' +
        '这些问题应该是详细的， ' +
        '并且明确基于文档中的信息。\n\n' +
        '<Begin Document>\n' +
        '{doc}\n' +
        '<End Document>';

    // Lets set the structure for the output to be what we did by hand before
    let parser1 = StructuredOutputParser.fromNamesAndDescriptions({
        query: '您所设置的问题',
        answer: '回答问题',
    });
    let format1 = parser1.getFormatInstructions();

// Now we can combine these to get our prompt template
    let promptTemplate1 = new PromptTemplate({
        template: template1,
        inputVariables: ['doc'],
        partialVariables: {
            format_instructions: format1,
        },
    });

// Now we have our Javascript QAGenerateChain
    let jsQAGenerateChain = new LLMChain({ llm: llm, prompt: promptTemplate1 });

// We can now loop thr the first 5 docs in our doc set and automatically
// generate test cases using the LLM
    for (let i = 0; i < 5; i++) {
        let result = await jsQAGenerateChain.call({ doc: docs[i].pageContent });
        let parsed = await parser1.parse(result.text);
        examples.push(parsed);
    }
    console.log(examples)

// We can now use this list of QA items to test the data set
    let testResult = await retrevalChain.call({ query: examples[0].query });
    console.log(testResult);


};


export const autoEvaluation = async () => {
    let examples = [
        {
            query: 'Cozy Comfort Pullover Set是否有侧袋？',
            answer: '有',
        },
        {
            query: 'Ultra-Lofty 850 Stretch Down Hooded Jacket属于哪个系列？',
            answer: 'DownTek系列',
        },
    ] as any;
    let docs = await loader.load();

// Now let's create a node in memory vector store
    let vectorStore = await HNSWLib.fromDocuments(docs, embedding);
    // console.log(123);

// Looks like we cannot specify a doc separator in JS
    let retrevalChain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever());
    // run from array of examples
    let predictions = await retrevalChain.apply(examples);
    console.log(predictions);

    // / Now let's build our own evaluator
    let template2 = `
        您正在评估学生问答环节的结果。
        在下方的标签<Question>、<Answer>和<Expected>之间，您将获得问题、学生答案和预期答案。
        请按照以下格式指示回复，包括问题、答案、预期答案以及评估结果：`+
        '{format_instructions}\n\n' +
        `您必须评估学生答案与预期答案的匹配程度，以确定问题的通过或失败。
        仅根据事实准确性评估问题，请忽略答案与预期答案之间的拼写、标点或措辞差异。
        以下是需要评估的项目：
        ` +
        '<Question>{question}</Question>\n' +
        '<Answer>{answer}</Answer>\n' +
        '<Expected>{expected}</Expected>';

    let parser2 = StructuredOutputParser.fromNamesAndDescriptions({
        question: "提出的问题",
        answer: "学生给出的答案",
        expected: "学生预期给出的答案",
        result: "通过或失败，根据答案与预期答案的匹配程度而定。"
    });
    let format2 = parser2.getFormatInstructions();
    let promptTemplate2 = new PromptTemplate({
        template: template2,
        inputVariables: ['question', 'answer', 'expected'],
        partialVariables: {
            format_instructions: format2
        }});

    let jsQAEvalChain = new LLMChain({llm: llm, prompt: promptTemplate2});
    for (let i = 0 ; i < examples.length; i++) {

        let result = await jsQAEvalChain.call({
            question: examples[i].query,
            answer: predictions[i].text,
            expected: examples[i].answer
        });

        let parsed = await parser2.parse(result.text);
        console.log(parsed);
    }

}
