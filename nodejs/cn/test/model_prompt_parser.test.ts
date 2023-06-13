import {expect, it, test,describe} from 'vitest';
import {getCompletion} from '../src/utill';
import {
    changeStylePrompt,
    customer_email, email_style,
    firstPrompt,
} from '../src/model_prompt_parser/prompt';


test('base OpenAI api', async () => {
    const re = await getCompletion('Hello, my name is');
    console.log(re);
    expect(re).not.toBe(null);
});

describe('directly OpenAI', async () => {
    it('1+1', async() => {
        const re = await getCompletion(firstPrompt);
        console.log(re);
        expect(re).not.toBe(null);
    });

    it('change email style',async () => {
        const re = await getCompletion(changeStylePrompt(customer_email,email_style));
        console.log(re);
        expect(re).not.toBe(null);
    })
});




