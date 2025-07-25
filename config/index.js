import dotenv from 'dotenv';

const { env } = process;

dotenv.config({
  path: env.NODE_ENV ? `.env.${env.NODE_ENV}` : '.env',
});

const config = Object.freeze({
  APP_ENV: env.NODE_ENV || 'production',
  APP_DEBUG: env.APP_DEBUG === 'true' || false,
  APP_URL: env.APP_URL || null,
  APP_PORT: env.APP_PORT || null,
  APP_LANG: env.APP_LANG || 'zh_TW',
  APP_WEBHOOK_PATH: env.APP_WEBHOOK_PATH || '/webhook',
  APP_API_TIMEOUT: env.APP_API_TIMEOUT || 9000,
  APP_MAX_GROUPS: Number(env.APP_MAX_GROUPS) || 1000,
  APP_MAX_USERS: Number(env.APP_MAX_USERS) || 1000,
  APP_MAX_PROMPT_MESSAGES: Number(env.APP_MAX_PROMPT_MESSAGES) || 4,
  APP_MAX_PROMPT_TOKENS: Number(env.APP_MAX_PROMPT_TOKENS) || 256,
  APP_INIT_PROMPT: env.APP_INIT_PROMPT || '',
  HUMAN_NAME: env.HUMAN_NAME || '',
  HUMAN_INIT_PROMPT: env.HUMAN_INIT_PROMPT || '',
  BOT_NAME: env.BOT_NAME || 'AI',
  BOT_INIT_PROMPT: env.BOT_INIT_PROMPT || '',
  BOT_TONE: env.BOT_TONE || '',
  BOT_DEACTIVATED: env.BOT_DEACTIVATED === 'true' || false,
  ERROR_MESSAGE_DISABLED: env.ERROR_MESSAGE_DISABLED === 'true' || false,
  VERCEL_ENV: env.VERCEL_ENV || null,
  VERCEL_TIMEOUT: env.VERCEL_TIMEOUT || env.APP_API_TIMEOUT,
  VERCEL_PROJECT_NAME: env.VERCEL_PROJECT_NAME || env.VERCEL_GIT_REPO_SLUG || null,
  VERCEL_TEAM_ID: env.VERCEL_TEAM_ID || null,
  VERCEL_ACCESS_TOKEN: env.VERCEL_ACCESS_TOKEN || null,
  VERCEL_DEPLOY_HOOK_URL: env.VERCEL_DEPLOY_HOOK_URL || null,
  OPENAI_TIMEOUT: env.OPENAI_TIMEOUT || env.APP_API_TIMEOUT,
  OPENAI_API_KEY: env.OPENAI_API_KEY || null,
  ASSISTANT_ID: env.ASSISTANT_ID || null,
  OPENAI_BASE_URL: env.OPENAI_BASE_URL || 'https://api.openai.com',
  OPENAI_COMPLETION_MODEL: env.OPENAI_COMPLETION_MODEL || 'gpt-3.5-turbo',
  OPENAI_COMPLETION_TEMPERATURE: Number(env.OPENAI_COMPLETION_TEMPERATURE) || 1,
  OPENAI_COMPLETION_MAX_TOKENS: Number(env.OPENAI_COMPLETION_MAX_TOKENS) || 64,
  OPENAI_COMPLETION_FREQUENCY_PENALTY: Number(env.OPENAI_COMPLETION_FREQUENCY_PENALTY) || 0,
  OPENAI_COMPLETION_PRESENCE_PENALTY: Number(env.OPENAI_COMPLETION_PRESENCE_PENALTY) || 0.6,
  OPENAI_COMPLETION_STOP_SEQUENCES: env.OPENAI_COMPLETION_STOP_SEQUENCES ? String(env.OPENAI_COMPLETION_STOP_SEQUENCES).split(',') : [' assistant:', ' user:'],
  OPENAI_IMAGE_GENERATION_MODEL: env.OPENAI_IMAGE_GENERATION_MODEL || 'dall-e-2',
  OPENAI_IMAGE_GENERATION_SIZE: env.OPENAI_IMAGE_GENERATION_SIZE || '256x256',
  OPENAI_IMAGE_GENERATION_QUALITY: env.OPENAI_IMAGE_GENERATION_QUALITY || 'standard',
  OPENAI_VISION_MODEL: env.OPENAI_VISION_MODEL || 'gpt-4o',
  LINE_TIMEOUT: env.LINE_TIMEOUT || env.APP_API_TIMEOUT,
  LINE_CHANNEL_ACCESS_TOKEN: env.LINE_CHANNEL_ACCESS_TOKEN || null,
  LINE_CHANNEL_SECRET: env.LINE_CHANNEL_SECRET || null,
  SERPAPI_TIMEOUT: env.SERPAPI_TIMEOUT || env.APP_API_TIMEOUT,
  SERPAPI_API_KEY: env.SERPAPI_API_KEY || null,
  SERPAPI_LOCATION: env.SERPAPI_LOCATION || 'tw',
});

export default config;
