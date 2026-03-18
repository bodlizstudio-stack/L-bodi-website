/**
 * AI provider abstraction — swap implementation without changing API route.
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProvider {
  /** Send messages and return assistant reply. */
  chat(messages: ChatMessage[]): Promise<string>;
}
