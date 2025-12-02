import type {
  LLMModelConfig,
  LLMResponseChunk,
  NarrationContext,
  NarrationMessage,
} from "./types";

export interface LLMAdapter {
  chat: (options: {
    messages: NarrationMessage[];
    context?: NarrationContext;
    config?: Partial<LLMModelConfig>;
    onChunk?: (chunk: LLMResponseChunk) => void;
  }) => Promise<NarrationMessage>;
}


