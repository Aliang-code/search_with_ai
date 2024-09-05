import { IModelInfo } from './interface';

// Search engine related. You don't really need to change this.
export const EndPoint = {
  BING_SEARCH_V7_ENDPOINT: 'https://api.bing.microsoft.com/v7.0/search',
  GOOGLE_SEARCH_ENDPOINT: 'https://www.googleapis.com/customsearch/v1'
};

export const BING_MKT = 'en-US';

// default timeout ms
export const DEFAULT_SEARCH_ENGINE_TIMEOUT = 20000;

// default search keywords
export const DefaultQuery = 'Who said \'live long and prosper';
export const DefaultSystem = 'You are a helpful assistant.';

export const Models: IModelInfo[] = [
  {
    platform: 'aliyun',
    type: '',
    models: ['qwen-max', 'qwen-max-1201', 'qwen-turbo', 'qwen-plus']
  },
  {
    platform: 'openai',
    type: 'openai',
    models: ['gpt-3.5-turbo', 'gpt-4-0125-preview', 'gpt-4-turbo-preview', 'gpt-4o']
  },
  {
    platform: 'baidu',
    type: 'baidu',
    models: ['eb-instant', 'completions_pro', 'ernie_bot_8k']
  },
  {
    platform: 'google',
    type: 'gemini',
    models: ['gemini-pro', 'gemini-1.5-pro-latest']
  },
  {
    platform: 'yi',
    type: 'openai',
    models: ['yi-34b-chat-0205', 'yi-34b-chat-200k']
  },
  {
    platform: 'moonshot',
    type: 'openai',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k']
  },
  {
    platform: 'lepton',
    type: 'openai',
    models: ['llama2-7b', 'llama2-13b', 'llama2-70b', 'mixtral-8*7b', 'mixtral-8*22b']
  },
  {
    platform: 'deepseek',
    type: 'openai',
    models: ['deepseek-chat', 'deepseek-coder']
  },
  {
    platform: 'chatglm',
    type: 'openai',
    models: ['glm-4', 'glm-4v', 'glm-3-turbo']
  },
  {
    platform: 'tencent',
    type: 'tencent',
    models: ['std', 'pro']
  },
  {
    platform: 'groq',
    type: 'groq',
    models: ["llama3-groq-8b-8192-tool-use-preview","llama3-8b-8192","llama3-70b-8192","llama-3.1-70b-versatile","llama-guard-3-8b","mixtral-8x7b-32768","gemma2-9b-it","llama-3.1-8b-instant","llama3-groq-70b-8192-tool-use-preview","gemma-7b-it"]
  }
];
