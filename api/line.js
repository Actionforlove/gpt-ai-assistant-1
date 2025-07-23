export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { events } = req.body;
  const event = events && events[0];

  if (!event || !event.message || !event.replyToken) {
    return res.status(400).send('Bad Request');
  }

  const userMessage = event.message.text;

  // 呼叫 OpenAI GPT
  const gptReply = await getGPTResponse(userMessage);

  // 傳送回 LINE
  await replyToLine(event.replyToken, gptReply);

  return res.status(200).send('OK');
}

// 呼叫 GPT
async function getGPTResponse(message) {
  const OPENAI_API_KEY = "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";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: message }]
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "很抱歉，目前無法取得回覆。";
}

// 回覆 LINE
async function replyToLine(replyToken, text) {
  const LINE_CHANNEL_ACCESS_TOKEN = "你的 LINE access token";

  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }]
    })
  });
}
