import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      age = 30, 
      relation = 'persona', 
      interests = 'general', 
      budget = 50, 
      language = 'es' 
    } = body;

    const langPrompt = language === 'en' ? 'Answer in English' : 'Responde en Español';

    const prompt = `
      Eres un experto en regalos. ${langPrompt}.
      Genera 5 ideas de regalos para: ${relation}, ${age} años.
      Intereses: ${interests}.
      Presupuesto: ${budget}.
      
      IMPORTANTE: Devuelve SOLO JSON puro con esta estructura:
      {
        "gifts": [
          {
            "name": "Nombre Producto",
            "reason": "Por qué le gustará (breve)",
            "search_term": "Término búsqueda Amazon"
          }
        ]
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(completion.choices[0].message.content);
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}