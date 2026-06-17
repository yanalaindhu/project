export const RAG_MODELS = [
  {
    id: 'mind_rag',
    name: 'Mind-RAG',
    icon: 'Brain',
    engine: 'Claude 3.5 Sonnet',
    description: 'Optimized for emotional wellness, stress logs, and journal notes.',
    systemPrompt: 'Refencing vector store: "trivarna_mind_v1". Queries mood scores, stress Likert ratings, and emotional triggers.',
    welcomeMessage: 'Hello! I am Mind-RAG. I have loaded your emotional assessments and stress logs. Ask me to analyze your mental fatigue, mood trends, or suggest mindfulness integrations.'
  },
  {
    id: 'body_rag',
    name: 'Body-RAG',
    icon: 'Activity',
    engine: 'GPT-4o',
    description: 'Optimized for sleep logs, hydration tracking, and physical recovery.',
    systemPrompt: 'Referencing vector store: "trivarna_body_v1". Queries sleep duration, water intake, and exercise metrics.',
    welcomeMessage: 'Welcome to Body-RAG. Your sleep logs, daily physical activity levels, and hydration scores are connected. Let me know if you want a review of your sleep quality or exercise habits.'
  },
  {
    id: 'lifestyle_rag',
    name: 'Lifestyle-RAG',
    icon: 'Target',
    engine: 'Gemini 1.5 Pro',
    description: 'Optimized for goals progress, habit compliance, and focus hours.',
    systemPrompt: 'Referencing vector store: "trivarna_lifestyle_v1". Queries active goals, habit check-in history, and productivity indices.',
    welcomeMessage: 'Greetings! I am Lifestyle-RAG, synced to your goals, routine metrics, and habit consistency. Ask me about your habit compliance or how to organize your peak productive window.'
  },
  {
    id: 'hybrid_rag',
    name: 'Hybrid-RAG',
    icon: 'Compass',
    engine: 'Cross-RAG Ensemble',
    description: 'Aggregates queries across all mental, physical, and routine databases.',
    systemPrompt: 'Referencing vector store: "trivarna_hybrid_master". Performs federated search across all user data vectors.',
    welcomeMessage: 'Holistic Hybrid-RAG online. I have unified access to all your wellness indices (mind, body, and lifestyle). Ask me for a complete life balance summary or a fully consolidated daily schedule.'
  }
];
