#import os

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())  # read local .env file

import warnings
warnings.filterwarnings("ignore")

from langchain.agents.agent_toolkits import create_python_agent
from langchain.agents import load_tools, initialize_agent
from langchain.agents import AgentType
from langchain.tools.python.tool import PythonREPLTool
#from langchain.python import PythonREPL
from langchain.chat_models import ChatOpenAI
import langchain

llm = ChatOpenAI(temperature=0)
tools = load_tools(["llm-math", "wikipedia"], llm=llm)

customer_list = [["Harrison", "Chase"], 
                 ["Lang", "Chain"],
                 ["Dolly", "Too"],
                 ["Elle", "Elem"], 
                 ["Geoff", "Fusion"], 
                 ["Trance", "Former"],
                 ["Jen", "Ayai"]]

def do_answer1():
    langchain.debug = True
    agent = create_python_agent(
        llm,
        tool=PythonREPLTool(),
        verbose=True
    )

    answer = agent.run(f"""Sort these customers by \
    last name and then first name \
    and print the output: {customer_list}""") 
    print(answer)
    langchain.debug = False


def do_answer2():
    from langchain.agents import tool
    from datetime import date 
    langchain.debug = True 

    @tool
    def time(text: str) -> str:
        """Returns todays date, use this for any \
        questions related to knowing todays date. \
        The input should always be an empty string, \
        and this function will always return todays \
        date - any date mathmatics should occur \
        outside this function."""
        return str(date.today()) 

    agent = initialize_agent(
        tools + [time], 
        llm, 
        agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION,
        handle_parsing_errors=True,
        verbose = True)  
    
    try:
        result = agent("whats the date today?") 
    except: # noqa
        print("exception on external access")
    print(result)
    langchain.debug = False

if __name__ == "__main__":
    #do_answer1()
    do_answer2()
