#import os

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())  # read local .env file

import warnings
warnings.filterwarnings("ignore")

#from langchain.agents.agent_toolkits import create_python_agent
from langchain.agents import load_tools, initialize_agent
from langchain.agents import AgentType
#from langchain.tools.python.tool import PythonREPLTool
#from langchain.python import PythonREPL
from langchain.chat_models import ChatOpenAI
import langchain

llm = ChatOpenAI(temperature=0)
tools = load_tools(["llm-math", "wikipedia"], llm=llm)

def do_answer1():
    langchain.debug = True
    agent = initialize_agent(
        tools, 
        llm, 
        agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION,
        handle_parsing_errors=True,
        verbose = True)

    answer = agent("What is the 25% of 300?")
    print(answer)

    langchain.debug = False

question = "Tom M. Mitchell is an American computer scientist \
and the Founders University Professor at Carnegie Mellon University (CMU)\
what book did he write?"

def do_answer2():
    langchain.debug = True
    agent = initialize_agent(
        tools, 
        llm, 
        agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION,
        handle_parsing_errors=True,
        verbose = True)

    answer = agent(question)
    print(answer)

    langchain.debug = False

if __name__ == "__main__":
    #do_answer1()
    do_answer2()