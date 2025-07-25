import axios from 'axios';
import FormData from 'form-data';
import config from '../config/index.js';
import { handleFulfilled, handleRejected, handleRequest } from './utils/index.js';

export const ROLE_SYSTEM = 'system';
export const ROLE_AI = 'assistant';
export const ROLE_HUMAN = 'user';

export const FINISH_REASON_STOP = 'stop';
export const FINISH_REASON_LENGTH = 'length';

export const IMAGE_SIZE_256 = '256x256';
export const IMAGE_SIZE_512 = '512x512';
export const IMAGE_SIZE_1024 = '1024x1024';

export const MODEL_GPT_3_5_TURBO = 'gpt-3.5-turbo';
export const MODEL_GPT_4_OMNI = 'gpt-4o';
export const MODEL_WHISPER_1 = 'whisper-1';
export const MODEL_DALL_E_3 = 'dall-e-3';

const client = axios.create({
  baseURL: config.OPENAI_BASE_URL,
  timeout: config.OPENAI_TIMEOUT,
  headers: {
    'Accept-Encoding': 'gzip, deflate, compress',
  },
});

client.interceptors.request.use((c) => {
  c.headers.Authorization = `Bearer ${config.OPENAI_API_KEY}`;
  return handleRequest(c);
});

client.interceptors.response.use(handleFulfilled, (err) => {
  if (err.response?.data?.error?.message) {
    err.message = err.response.data.error.message;
  }
  return handleRejected(err);
});

const hasImage = ({ messages }) => (
  messages.some(({ content }) => (
    Array.isArray(content) && content.some((item) => item.image_url)
  ))
);

// 原始的 Chat Completions API（保留作為備用）
const createChatCompletion = ({
  model = config.OPENAI_COMPLETION_MODEL,
  messages,
  temperature = config.OPENAI_COMPLETION_TEMPERATURE,
  maxTokens = config.OPENAI_COMPLETION_MAX_TOKENS,
  frequencyPenalty = config.OPENAI_COMPLETION_FREQUENCY_PENALTY,
  presencePenalty = config.OPENAI_COMPLETION_PRESENCE_PENALTY,
}) => {
  const body = {
    model: hasImage({ messages }) ? config.OPENAI_VISION_MODEL : model,
    messages,
    temperature,
    max_tokens: maxTokens,
    frequency_penalty: frequencyPenalty,
    presence_penalty: presencePenalty,
  };
  return client.post('/v1/chat/completions', body);
};

// 新的 Assistant API 函數
const createAssistantCompletion = async ({ messages }) => {
  if (!config.ASSISTANT_ID) {
    // 如果沒有設定 ASSISTANT_ID，回退到舊 API
    return createChatCompletion({ messages });
  }

  try {
    // 1. 建立 thread
    const threadResponse = await client.post('/v1/threads');
    const threadId = threadResponse.data.id;

    // 2. 從 messages 中提取最後一條用戶訊息
    const userMessages = messages.filter(msg => msg.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1];
    
    if (!lastUserMessage) {
      throw new Error('沒有找到用戶訊息');
    }

    // 3. 加入用戶訊息到 thread
    await client.post(`/v1/threads/${threadId}/messages`, {
      role: 'user',
      content: lastUserMessage.content
    });

    // 4. 執行 Assistant
    const runResponse = await client.post(`/v1/threads/${threadId}/runs`, {
      assistant_id: config.ASSISTANT_ID
    });
    const runId = runResponse.data.id;

    // 5. 等待執行完成
    let runStatus;
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusResponse = await client.get(`/v1/threads/${threadId}/runs/${runId}`);
      runStatus = statusResponse.data;
      
      if (runStatus.status === 'failed') {
        throw new Error('Assistant 執行失敗');
      }
    } while (runStatus.status !== 'completed');

    // 6. 取得回應
    const messagesResponse = await client.get(`/v1/threads/${threadId}/messages`);
    const assistantMessage = messagesResponse.data.data[0];

    // 7. 格式化回應以符合原有介面
    return {
      data: {
        choices: [{
          message: {
            content: assistantMessage.content[0].text.value
          },
          finish_reason: 'stop'
        }]
      }
    };

  } catch (error) {
    console.error('Assistant API 錯誤，回退到 Chat Completions API:', error.message);
    // 如果 Assistant API 失敗，回退到原始 API
    return createChatCompletion({ messages });
  }
};

const createImage = ({
  model = config.OPENAI_IMAGE_GENERATION_MODEL,
  prompt,
  size = config.OPENAI_IMAGE_GENERATION_SIZE,
  quality = config.OPENAI_IMAGE_GENERATION_QUALITY,
  n = 1,
}) => {
  // set image size to 1024 when using the DALL-E 3 model and the requested size is 256 or 512.
  if (model === MODEL_DALL_E_3 && [IMAGE_SIZE_256, IMAGE_SIZE_512].includes(size)) {
    size = IMAGE_SIZE_1024;
  }
  return client.post('/v1/images/generations', {
    model,
    prompt,
    size,
    quality,
    n,
  });
};

const createAudioTranscriptions = ({
  buffer,
  file,
  model = MODEL_WHISPER_1,
}) => {
  const formData = new FormData();
  formData.append('file', buffer, file);
  formData.append('model', model);
  return client.post('/v1/audio/transcriptions', formData.getBuffer(), {
    headers: formData.getHeaders(),
  });
};

export {
  createAudioTranscriptions,
  createChatCompletion,
  createAssistantCompletion,
  createImage,
};
