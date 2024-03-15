import { EBackend, IChatInputMessage, IStreamHandler, SearchFunc } from './interface';
import { searchWithBing, searchWithGoogle, searchWithSogou } from './service';
import { MoreQuestionsPrompt, RagQueryPrompt } from './prompt';
import { AliyunChat, BaiduChat, OpenAIChat, GoogleChat, TencentChat, YiChat } from './platform';
// import { memoryCache } from './utils';
import util from 'util';
import { AliyunModels, AllModels, BaiduModels, OpenAIModels, GoogleModels, TencentModels, YiModels } from './constant';

interface RagOptions {
  backend?: EBackend
  stream?: boolean
  model?: string
}

const aliyun = new AliyunChat();
const openai = new OpenAIChat();
const baidu = new BaiduChat();
const google = new GoogleChat();
const tencent = new TencentChat();
const yi = new YiChat();

// const CACHE_NAME = 'search_with_ai';

export class Rag {
  private search: SearchFunc;
  private chat: (...args: any[]) => Promise<any>;
  private model: string;
  // enable stream?
  private stream: boolean;

  constructor(params?: RagOptions) {
    const { backend = EBackend.SOGOU, stream = true, model = AllModels.QWEN_MAX } = params || {};
    this.chat = processModel(model, stream);
    this.model = model;
    this.stream = stream;
    console.log('query with', backend, model);
    switch (backend) {
      case EBackend.GOOGLE:
        this.search = searchWithGoogle;
        break;
      case EBackend.BING:
        this.search = searchWithBing;
        break;
      case EBackend.SOGOU:
        this.search = searchWithSogou;
        break;
      default:
        throw new Error('Invalid params: backend');
    }
  }

  public async query(query: string, onMessage?: (...args: any[]) => void) {
    const contexts = await this.search(query);
    if (!this.stream) {
      const relatedPromise = this.getRelatedQuestions(query, contexts);
      const answerPromise = this.getAiAnswer(query, contexts);
      const [related, answer] = await Promise.all([relatedPromise, answerPromise]);
      return {
        related,
        answer,
        contexts
      };
    }
    onMessage?.(JSON.stringify({ contexts }));
    await this.getAiAnswer(query, contexts, (msg) => {
      onMessage?.(JSON.stringify({ answer: msg }));
    });
    await this.getRelatedQuestions(query, contexts, (msg) => {
      onMessage?.(JSON.stringify({ related: msg }));
    });
    onMessage?.(null, true);
  }

  // Gets related questions based on the query and context.
  private async getRelatedQuestions(query: string, contexts: any[], onMessage?: IStreamHandler) {
    try {
      const { messages } = this.paramsFormatter(query, contexts, 'related');
      const { model, stream, chat } = this;
      if (!stream) {
        const res = await this.chat(messages, this.model);
        return res.split('\n');
      }
      await chat(messages, onMessage, model);
    } catch(err) {
      console.error('encountered error while generating related questions:', err);
      return [];
    }
  }

  private async getAiAnswer(query: string, contexts: any[], onMessage?: IStreamHandler) {
    try {
      const { messages } = this.paramsFormatter(query, contexts, 'answer');
      const { model, stream, chat } = this;
      if (!stream) {
        const res = await this.chat(messages, this.model);
        return res;
      }
      await chat(messages, (msg: string, done: boolean) => {
        onMessage?.(msg, done);
      }, model);
    } catch (err) {
      return '';
    }
  }

  private paramsFormatter(query: string, contexts: any[], type: 'answer' | 'related') {
    const context = contexts.map((item, index) => `[[citation:${index + 1}]] ${item.snippet}` ).join('\n\n');
    const prompt = type === 'answer' ? RagQueryPrompt : MoreQuestionsPrompt;
    const system = util.format(prompt, context);
    const messages: IChatInputMessage[] = [
      {
        role: 'user',
        content: `${system} ${query}`
      }
    ];
    return {
      messages
    };
  }

  // private saveResult(contexts: any[], llmResponse: string, relatedQuestionsFuture: any[], searchUUID: string) {}
}

function processModel(model = AliyunModels.QWEN_MAX, stream = true) {
  if (Object.values(AliyunModels).includes(model)) {
    return stream ? aliyun.chatStream.bind(aliyun) : aliyun.chat.bind(aliyun);
  }
  if (Object.values(OpenAIModels).includes(model)) {
    return stream ? openai.chatStream.bind(openai) : openai.chat.bind(openai);
  }
  if (Object.values(BaiduModels).includes(model)) {
    return stream ? baidu.chatStream.bind(baidu) : baidu.chat.bind(baidu);
  }
  if (Object.values(GoogleModels).includes(model)) {
    return stream ? google.chatStream.bind(google) : google.chat.bind(google);
  }
  if (Object.values(TencentModels).includes(model)) {
    return tencent.chatStream.bind(tencent);
  }
  if (Object.values(YiModels).includes(model)) {
    return yi.chatStream.bind(yi);
  }
  return stream ? aliyun.chatStream.bind(aliyun) : aliyun.chat.bind(aliyun);
}
