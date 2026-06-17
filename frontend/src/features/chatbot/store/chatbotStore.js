import { create } from 'zustand';
import { RAG_MODELS } from '../data/ragModels';
import { VECTOR_DATABASES } from '../data/vectorDatabases';
import { MOCK_RESPONSES } from '../data/mockConversations';

const getWelcomeMessage = (modelId) => {
  const model = RAG_MODELS.find(m => m.id === modelId) || RAG_MODELS[0];
  return {
    id: 'welcome-' + modelId,
    sender: 'assistant',
    text: model.welcomeMessage,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sources: []
  };
};

export const useChatbotStore = create((set, get) => ({
  selectedModel: 'mind_rag',
  isTyping: false,
  messages: [getWelcomeMessage('mind_rag')],
  activeDatabases: VECTOR_DATABASES['mind_rag'],

  setSelectedModel: (modelId) => {
    set({
      selectedModel: modelId,
      messages: [getWelcomeMessage(modelId)],
      activeDatabases: VECTOR_DATABASES[modelId] || [],
      isTyping: false
    });
  },

  setTyping: (isTyping) => set({ isTyping }),

  sendMessage: async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: 'msg-' + Date.now() + '-user',
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: []
    };

    // Append user message and set typing state
    set((state) => ({
      messages: [...state.messages, userMessage],
      isTyping: true
    }));

    // Simulate RAG search latency (1000ms)
    setTimeout(() => {
      const currentModel = get().selectedModel;
      const normalizedPrompt = text.toLowerCase().trim();
      
      const modelResponses = MOCK_RESPONSES[currentModel] || MOCK_RESPONSES['mind_rag'];
      const responseData = modelResponses[normalizedPrompt] || modelResponses.fallback;

      const assistantMessage = {
        id: 'msg-' + Date.now() + '-assistant',
        sender: 'assistant',
        text: responseData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: responseData.sources || []
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isTyping: false
      }));
    }, 1000);
  },

  clearHistory: () => {
    const currentModel = get().selectedModel;
    set({
      messages: [getWelcomeMessage(currentModel)],
      isTyping: false
    });
  }
}));
