import { BaseOpenAIChat } from './base/openai';

const baseURL = 'https://api.groq.com/openai/v1';
const key = process.env.GROQ_KEY;


export const groq = new BaseOpenAIChat('groq', key, baseURL);
