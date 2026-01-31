import { BlogPost } from "@/lib/blog";

const content = (
  <article className="blog-post space-y-6">
    <p className="text-lg text-slate-700">
      CNC machine operators frequently need technical information: tooling
      recommendations, feeds/speeds calculations, material properties,
      troubleshooting guidance. Traditional documentation is scattered. Goal:
      context-aware AI assistant for instant technical support.
    </p>

    <h2>Technical Architecture</h2>
    <p>
      Using <strong>GPT-4o</strong> (OpenAI&apos;s latest model) for improved
      technical accuracy and context understanding.
    </p>

    <pre>
      <code>{`import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getCNCResponse(
  userMessage: string,
  conversationHistory: Message[]
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ],
    temperature: 0.3, // Lower temp for technical accuracy
    max_tokens: 1000
  });

  return response.choices[0].message.content;
}`}</code>
    </pre>

    <h2>System Prompt Engineering</h2>
    <p>
      Critical component: system prompt defines AI personality and knowledge
      boundaries.
    </p>

    <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-slate-900 shadow-sm">
      <strong>Design decisions:</strong>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>
          <strong>Low temperature (0.3):</strong> Reduces creative responses,
          increases factual consistency
        </li>
        <li>
          <strong>Token limit (1000):</strong> Balances detail with response
          time
        </li>
        <li>
          <strong>Clear expertise boundaries:</strong> Prevents hallucination on
          non-CNC topics
        </li>
        <li>
          <strong>Safety emphasis:</strong> Critical for machining operations
        </li>
      </ul>
    </div>

    <h2>Conversation Context Management</h2>
    <p>
      Maintaining conversation history for coherent multi-turn interactions:
    </p>

    <pre>
      <code>{`interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  userId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

async function saveConversation(userId: string, messages: Message[]) {
  await db.collection('conversations').updateOne(
    { userId },
    { 
      $set: { messages, updatedAt: new Date() },
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true }
  );
}`}</code>
    </pre>

    <h2>File Upload Integration</h2>
    <p>
      Users can upload technical drawings, G-code files, CAD screenshots for
      context-aware assistance.
    </p>

    <h3>Image Analysis with GPT-4 Vision</h3>
    <p>GPT-4o supports image inputs for visual analysis:</p>

    <pre>
      <code>{`async function analyzeImage(
  imageBase64: string,
  userQuestion: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          { type: 'text', text: userQuestion },
          {
            type: 'image_url',
            image_url: { url: \`data:image/jpeg;base64,\${imageBase64}\` }
          }
        ]
      }
    ]
  });

  return response.choices[0].message.content;
}`}</code>
    </pre>

    <p>
      <strong>Use cases:</strong> Analyze technical drawings, identify tooling
      from photos, diagnose issues from screenshots, review setup photos for
      safety concerns.
    </p>

    <h2>Authentication & User Scope</h2>
    <p>Using Clerk for authentication and user-scoped data:</p>

    <pre>
      <code>{`import { auth } from '@clerk/nextjs';

export default async function handler(req, res) {
  const { userId } = auth();

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // All conversations scoped to userId
  const conversation = await getConversation(userId);
}`}</code>
    </pre>

    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-slate-900 shadow-sm">
      <strong>Security considerations:</strong>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>API key stored server-side only (never exposed to client)</li>
        <li>User conversations isolated by userId</li>
        <li>File uploads validated and sanitized</li>
        <li>Rate limiting: 10 requests/minute</li>
      </ul>
    </div>

    <h2>Performance Optimization</h2>

    <h3>Streaming Responses</h3>
    <p>
      Added streaming for better UX instead of waiting for complete response:
    </p>

    <pre>
      <code>{`async function streamCNCResponse(
  userMessage: string,
  conversationHistory: Message[]
): Promise<ReadableStream> {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ],
    stream: true
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        controller.enqueue(new TextEncoder().encode(content));
      }
      controller.close();
    }
  });
}`}</code>
    </pre>

    <p>
      <strong>Benefits:</strong> Response appears immediately (first tokens in
      ~500ms), better perceived performance, user can start reading before
      completion.
    </p>

    <h3>Caching Common Queries</h3>
    <p>Frequently asked questions cached in MongoDB to reduce API costs:</p>

    <pre>
      <code>{`async function getCachedResponse(query: string): Promise<string | null> {
  const cached = await db.collection('cached_responses').findOne({
    query: { $regex: new RegExp(query, 'i') }
  });

  if (cached) {
    await db.collection('cached_responses').updateOne(
      { _id: cached._id },
      { 
        $inc: { hitCount: 1 },
        $set: { lastAccessed: new Date() }
      }
    );
    return cached.response;
  }

  return null;
}`}</code>
    </pre>

    <h2>Cost Management</h2>
    <p>OpenAI API costs based on token usage:</p>
    <ul>
      <li>GPT-4o: $5.00 / 1M input tokens, $15.00 / 1M output tokens</li>
      <li>Average conversation: 2000 tokens (500 input, 1500 output)</li>
      <li>Cost per conversation: ~$0.025</li>
    </ul>

    <p>
      <strong>Mitigation strategies:</strong> Token limits (1000 max per
      response), context pruning (last 10 messages only), caching (40%
      reduction), rate limiting.
    </p>
    <p>
      <strong>Current monthly cost:</strong> ~$50 (2000 conversations)
    </p>

    <h2>Results</h2>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3>Performance</h3>
        <ul>
          <li>Response time: 2-3 seconds (streaming)</li>
          <li>Accuracy: 85% first-response resolution</li>
          <li>User satisfaction: 4.2/5.0</li>
        </ul>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3>Most Common Queries</h3>
        <ul>
          <li>Feeds/speeds calculations (28%)</li>
          <li>Tooling recommendations (22%)</li>
          <li>G-code troubleshooting (18%)</li>
          <li>Material properties (15%)</li>
          <li>Machine setup guidance (17%)</li>
        </ul>
      </div>
    </div>

    <h2>Future Improvements</h2>
    <ol>
      <li>
        <strong>Fine-tuning:</strong> Train custom model on CNC dataset for
        better accuracy
      </li>
      <li>
        <strong>Tool calling:</strong> Let AI directly invoke calculation tools
      </li>
      <li>
        <strong>Voice input:</strong> Speech-to-text for hands-free operation
      </li>
      <li>
        <strong>Multi-language:</strong> Support for international users
      </li>
      <li>
        <strong>Conversation export:</strong> Save discussions as PDF
      </li>
    </ol>

    <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-slate-900 shadow-sm">
      <strong>Key Takeaway:</strong> Effective AI assistants require careful
      prompt engineering, context management, and domain-specific constraints.
      Generic chatbots won&apos;t provide the technical accuracy needed for
      specialized fields like CNC machining.
    </div>
  </article>
);

export const cncAiPost: BlogPost = {
  slug: "cnc-technical-ai",
  title: "CNC Technical AI: GPT-4 Integration for Technical Support",
  date: "2024-11-04",
  excerpt:
    "Building a context-aware AI assistant for CNC machining using GPT-4o. System prompt engineering, file upload support, and cost management for ~$50/month operation.",
  tags: ["ai", "gpt-4", "api-integration", "cnc-tools"],
  content,
  readTime: 10,
  bookstackUrl:
    "http://bookstack.deejpotter.com/books/technical-blog-project-write-ups/page/cnc-technical-ai-gpt-4-integration",
};
