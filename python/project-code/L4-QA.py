#import os
import json

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())  # read local .env file

from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import CSVLoader
from langchain.vectorstores import DocArrayInMemorySearch
from langchain.indexes import VectorstoreIndexCreator
import langchain
#from IPython.display import display, Markdown

file = 'OutdoorClothingCatalog_1000_0.csv'

def load_df():
    import pandas as pd
    df = pd.read_csv(file)
    print(df)


def index_and_query():
    langchain.debug = True
    loader = CSVLoader(file_path=file)

    print("build vectorstore index...")
    index = VectorstoreIndexCreator(
        vectorstore_cls=DocArrayInMemorySearch
    ).from_loaders([loader])
    print("build vectorstore done.")

    query = "Please list all your shirts with sun protection in a table in markdown and summarize each one."
    #query = "Please list all your shirts with sun protection in json list, each shirt has name and description as keywords for the json dictionary, and summarize each one."

    response = index.query(query)
    print(response)

    try:
        rjson = json.loads(response.encode('utf-8'))
        print(rjson)
    except: # noqa
        pass
    langchain.debug = False

def get_db():
    from langchain.embeddings import OpenAIEmbeddings

    embeddings = OpenAIEmbeddings()
    embed = embeddings.embed_query("Hi my name is Harrison")
    print(len(embed))

    loader = CSVLoader(file_path=file)
    docs = loader.load()
    db = DocArrayInMemorySearch.from_documents(docs, embeddings)
    return db

def compelte_stepbystep_raw():
    #from langchain.embeddings import OpenAIEmbeddings
    langchain.debug = True

    db = get_db()

    query = "Please suggest a shirt with sunblocking"
    docs = db.similarity_search(query)
    print(len(docs))
    print(docs[0])
        
    llm = ChatOpenAI(temperature = 0.0)

    qdocs = "".join([docs[i].page_content for i in range(len(docs))])
    print(qdocs)

    response = llm.call_as_llm(f"{qdocs} Question: Please list all your shirts with sun protection in a table in markdown and summarize each one.") 
    print()
    print("response")
    print(response)

    langchain.debug = False

def complete_stepbystep_retrievalqa():
    langchain.debug = True

    llm = ChatOpenAI(temperature = 0.0)

    db = get_db()    

    retriever = db.as_retriever()
    qa_stuff = RetrievalQA.from_chain_type(
        llm=llm, 
        chain_type="stuff", 
        retriever=retriever, 
        verbose=True
    )

    query = "Please list all your shirts with sun protection in a table in markdown and summarize each one."
    response_final = qa_stuff.run(query)
    print()
    print("response_final")
    print(response_final)

    langchain.debug = False
    #response = index.query(query, llm=llm)


if __name__ == "__main__":
    load_df()
    #index_and_query()
    #compelte_stepbystep_raw()
    complete_stepbystep_retrievalqa()