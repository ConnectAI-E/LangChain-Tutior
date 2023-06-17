import os
import openai

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())  # read local .env file
openai.api_key = os.environ['OPENAI_API_KEY']

def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0, 
    )
    return response.choices[0].message["content"]

def exam0():
    response = get_completion("What is 1+1?")
    print(response)

def exam1():
    customer_email = """
    Arrr, I be fuming that me blender lid \
    flew off and splattered me kitchen walls \
    with smoothie! And to make matters worse,\
    the warranty don't cover the cost of \
    cleaning up me kitchen. I need yer help \
    right now, matey!
    """
    style = """American English \
    in a calm and respectful tone
    """

    prompt = f"""Translate the text \
    that is delimited by triple backticks 
    into a style that is {style}.
    text: ```{customer_email}```
    """
    print(prompt)
    response = get_completion(prompt)
    print(response)

def chat_exam0():
    from langchain.chat_models import ChatOpenAI
    chat = ChatOpenAI(temperature=0.0)
    print(chat)

    template_string = """Translate the text \
    that is delimited by triple backticks \
    into a style that is {style}. \
    text: ```{text}```
    """

    from langchain.prompts import ChatPromptTemplate

    prompt_template = ChatPromptTemplate.from_template(template_string)
    customer_style = """American English \
    in a calm and respectful tone
    """
    customer_email = """
    Arrr, I be fuming that me blender lid \
    flew off and splattered me kitchen walls \
    with smoothie! And to make matters worse, \
    the warranty don't cover the cost of \
    cleaning up me kitchen. I need yer help \
    right now, matey!
    """
    customer_messages = prompt_template.format_messages(style=customer_style,
                                                        text=customer_email)

    # Call the LLM to translate to the style of the customer message
    customer_response = chat(customer_messages)
    print(customer_response.content)


if __name__ == "__main__":
    # exam0()
    #exam1()
    chat_exam0()
