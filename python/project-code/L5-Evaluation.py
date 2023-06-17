from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import CSVLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain.vectorstores import DocArrayInMemorySearch
import langchain

file = 'OutdoorClothingCatalog_1000.csv'

def create_retrievel_qa():
    loader = CSVLoader(file_path=file)
    #data = loader.load()

    index = VectorstoreIndexCreator(
        vectorstore_cls=DocArrayInMemorySearch
    ).from_loaders([loader])

    llm = ChatOpenAI(temperature = 0.0)
    qa = RetrievalQA.from_chain_type(
        llm=llm, 
        chain_type="stuff", 
        retriever=index.vectorstore.as_retriever(), 
        verbose=True,
        chain_type_kwargs = {
            "document_separator": "<<<<>>>>>"
        }
    )

    print(qa)
    return qa 


def do_gen_questions_on_docs(num_docs=2):
    from langchain.evaluation.qa import QAGenerateChain
    langchain.debug = True

    loader = CSVLoader(file_path=file)
    data = loader.load()

    print(len(data))
    print(data[0])
    print(data[1])
    print()

    example_gen_chain = QAGenerateChain.from_llm(ChatOpenAI())

    docs = [{"doc": t} for t in data[:num_docs]]
    print(docs)
    print()

    new_examples = example_gen_chain.apply_and_parse(docs)

    print(new_examples)
    langchain.debug = False
    return new_examples

def ask_questions_from_examples():
    langchain.debug = True
    examples = [
        {
            "query": "Do the Cozy Comfort Pullover Set have side pockets?",
            "answer": "Yes"
        },
        {
            "query": "What collection is the Ultra-Lofty 850 Stretch Down Hooded Jacket from?",
            "answer": "The DownTek collection"
        }
    ]

    examples += do_gen_questions_on_docs()
    for ndx, example in enumerate(examples):
        print(ndx, example)

    qa = create_retrievel_qa()
    query = examples[0]["query"]
    response = qa.run(query)
    print("query:  \t", query)
    print("answser:\t", response)
    print()

    query = examples[2]["query"]
    response = qa.run(query)
    print("query:  \t", query)
    print("answser:\t", response)
    print()

    langchain.debug = False

def ensure_questions_answered_correctly():
    langchain.debug = True
    examples = [
        {
            "query": "Do the Cozy Comfort Pullover Set have side pockets?",
            "answer": "Yes"
        },
        {
            "query": "What collection is the Ultra-Lofty 850 Stretch Down Hooded Jacket from?",
            "answer": "The DownTek collection"
        }
    ]

    examples += do_gen_questions_on_docs()
    for ndx, example in enumerate(examples):
        print(ndx, example)

    qa = create_retrievel_qa()
    predictions = qa.apply(examples)
    from langchain.evaluation.qa import QAEvalChain

    llm = ChatOpenAI(temperature=0)
    eval_chain = QAEvalChain.from_llm(llm)
    graded_outputs = eval_chain.evaluate(examples, predictions)

    for i, eg in enumerate(examples):
        print(f"Example {i}:")
        print("Question: " + predictions[i]['query'])
        print("Real Answer: " + predictions[i]['answer'])
        print("Predicted Answer: " + predictions[i]['result'])
        print("Predicted Grade: " + graded_outputs[i]['text'])
        print()
    
    langchain.debug = False    

if __name__ == "__main__":
    #do_gen_questions_on_docs()
    ask_questions_from_examples()
    #ensure_questions_answered_correctly()