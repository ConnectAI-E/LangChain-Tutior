import {PromptTemplate} from 'langchain';

const template = `
Translate the text 
that is delimited by <>
into a style that is {style}.
text: <{customer_email}>
`
export const promptGen = new PromptTemplate({
    template: template,
    inputVariables: ['customer_email', 'style'],
})



