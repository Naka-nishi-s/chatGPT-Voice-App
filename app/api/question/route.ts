import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(request: NextRequest) {
  // フロントからデータを受け取る
  const requestData = await request.json();

  // API_KEYをenvから取得
  const API_KEY = process.env.API_KEY;

  // aiを叩くものを作る
  const openai = new OpenAI({ apiKey: API_KEY });

  try {
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "あなたは質問に対する解答を返してくれるAIです。" },
        { role: "user", content: requestData.text }
      ],
    });

    const gptResponseText = gptResponse.choices[0].message.content;

    console.log(gptResponseText)

    return NextResponse.json({ text: gptResponseText });
  } catch (error) {
    return NextResponse.json({ text: "Error querying GPT-3.5" });
  }
}
