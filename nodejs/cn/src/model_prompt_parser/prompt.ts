import * as fs from 'fs';
import exp from 'constants';


const reviewDemo = fs.readFileSync('src/model_prompt_parser/review/1.txt', 'utf8');
export  const firstPrompt = `
What is 1+1?
`

export const customer_email = `
Arrr, I be fuming that me blender lid 
flew off and splattered me kitchen walls 
with smoothie! And to make matters worse,
the warranty don't cover the cost of 
cleaning up me kitchen. I need yer help 
right now, matey!
`

export const email_style=`American English in a calm and respectful tone`

export const changeStylePrompt=(email:string,style:string)=>`Translate the text 
that is delimited by <>
into a style that is ${style}.
text: <${email}>`
