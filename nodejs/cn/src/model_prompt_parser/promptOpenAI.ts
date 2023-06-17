import * as fs from 'fs';
import exp from 'constants';


const reviewDemo = fs.readFileSync('src/model_prompt_parser/review/1.txt', 'utf8');
export  const firstPrompt = `
1+1等于多少？
`

export const customer_email = `
嗯，我正气得发疯，我搅拌机的盖子突然飞了出去，把我厨房的墙壁都弄满了果汁！
更糟糕的是，保修期不包括清理厨房的费用。我现在需要你的帮助，伙计！
`

export const email_style=`以冷静和尊重的口吻表达美式英语`

export const changeStylePrompt=(email:string,style:string)=>`将被<>分隔的文本翻译成${style}风格。
文本：<${email}>`


