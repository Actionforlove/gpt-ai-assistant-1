import config from '../config/index.js';
import { MOCK_TEXT_OK } from '../constants/mock.js';
import { createAssistantCompletion, FINISH_REASON_STOP } from '../services/openai.js';

class Completion {
  text;
  finishReason;

  constructor({
    text,
    finishReason,
  }) {
    this.text = text;
    this.finishReason = finishReason;
  }

  get isFinishReasonStop() {
    return this.finishReason === FINISH_REASON_STOP;
  }
}

/**
 * @param {Object} param
 * @param {Prompt} param.prompt
 * @returns {Promise<Completion>}
 */
const generateCompletion = async ({
  prompt,
}) => {
  if (config.APP_ENV !== 'production') return new Completion({ text: MOCK_TEXT_OK });
  
  console.log('正在使用 Assistant API，ASSISTANT_ID:', config.ASSISTANT_ID);
  
  const { data } = await createAssistantCompletion({ messages: prompt.messages });
  const [choice] = data.choices;
  
  return new Completion({
    text: choice.message.content.trim(),
    finishReason: choice.finish_reason,
  });
};

export default generateCompletion;
