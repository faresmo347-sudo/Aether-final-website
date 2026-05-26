import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

let zaiInstance: InstanceType<typeof ZAI> | null = null

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

export async function POST(req: NextRequest) {
  try {
    const { content, type } = await req.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const zai = await getZAI()

    const systemPrompt = `You are an intelligent tagging assistant for a personal memory app called Aether. Your job is to generate 2-4 highly relevant, specific hashtags for a user's saved memory.

Rules:
- Tags must be directly relevant to the actual content of the memory
- A cafe visit should get tags like #cafe #food #places — NOT generic tags like #notes or #memory
- A book recommendation should get tags like #books #reading — NOT #notes
- A startup idea should get tags like #startup #ideas — NOT #thoughts
- For voice memories, generate tags based on what was actually said
- For image memories, generate tags based on what the image likely contains
- For link memories, generate tags based on the URL and any description
- NEVER use generic placeholder tags like #notes, #memory, #thoughts, #capture unless truly appropriate
- Always include the # symbol
- Return ONLY a JSON array of tag strings, nothing else
- Example output: ["#cafe", "#food", "#places"]`

    const userPrompt = `Generate 2-4 highly relevant specific tags for this ${type || 'text'} memory:

"${content.slice(0, 1000)}"

Return only a JSON array of tag strings with # symbols.`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    })

    const responseText = completion.choices[0]?.message?.content || ''

    // Parse the JSON array from the response
    let tags: string[] = []
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*?\]/)
      if (jsonMatch) {
        tags = JSON.parse(jsonMatch[0])
      }
    } catch {
      const hashTags = responseText.match(/#\w+/g)
      if (hashTags) {
        tags = hashTags.slice(0, 4)
      }
    }

    if (tags.length === 0) {
      tags = ['#memory']
    }

    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Tag generation error:', error)
    return NextResponse.json({ tags: ['#memory'] })
  }
}
