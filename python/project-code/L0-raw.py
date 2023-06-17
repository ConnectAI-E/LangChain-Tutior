from langchain.chat_models import ChatOpenAI
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())  # read local .env file

raw_prompt = """Human: You are a teacher coming up with questions to ask on a quiz.\n\n
Given the following document, please generate a question and answer based on that document.\n\n
Example Format:\n<Begin Document>\n...\n<End Document>\nQUESTION: question here\nANSWER: answer here\n\n
These questions should be detailed and be based explicitly on information in the document. Begin!\n\n
<Begin Document>\npage_content=\": 0\\nname: Women's Campside Oxfords\\n
description: This ultracomfortable lace-to-toe Oxford boasts a super-soft canvas, thick cushioning, and quality construction for a broken-in feel from the first time you put them on. \\n\\n\
Size &amp; Fit: Order regular shoe size. For half sizes not offered, order up to next whole size. \\n\\n
Specs: Approx. weight: 1 lb.1 oz. per pair. \\n\\n
Construction: Soft canvas material for a broken-in feel and look. Comfortable EVA innersole with Cleansport NXT® antimicrobial odor control. Vintage hunt, fish and camping motif on innersole. Moderate arch contour of innersole. EVA foam midsole for cushioning and support. Chain-tread-inspired molded rubber outsole with modified chain-tread pattern. Imported. \\n\\n
Questions? Please contact us for any inquiries.\" metadata={'source': 'OutdoorClothingCatalog_1000.csv', 'row': 0}\n<End Document>"""

def call_as_llm(raw_prompt):
    raw_prompt = raw_prompt.replace("\\\\", "\\")
    raw_prompt = raw_prompt.replace("\\n", "\n")
    print()
    print(raw_prompt)
    print()

    llm = ChatOpenAI(temperature = 0.0)

    response = llm.call_as_llm(raw_prompt) 
    print()
    print("response")
    print(response)
    return response


if __name__ == "__main__":
    response = call_as_llm(raw_prompt)
