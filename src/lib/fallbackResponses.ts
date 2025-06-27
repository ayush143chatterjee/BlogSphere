export const getFallbackResponse = (query: string): string => {
  const responses = [
    {
      keywords: ['write', 'writing', 'blog', 'article', 'post'],
      response: "Here are some general writing tips:\n1. Start with a clear outline\n2. Write a compelling introduction\n3. Use short paragraphs\n4. Include relevant examples\n5. End with a strong conclusion"
    },
    {
      keywords: ['idea', 'topic', 'subject', 'theme'],
      response: "To find blog topics:\n1. Research trending subjects in your field\n2. Answer common questions from your audience\n3. Share personal experiences\n4. Analyze current events\n5. Create how-to guides"
    },
    {
      keywords: ['improve', 'better', 'enhance', 'tips'],
      response: "To improve your writing:\n1. Read extensively in your niche\n2. Practice regularly\n3. Get feedback from others\n4. Edit thoroughly\n5. Study successful writers"
    }
  ];

  const defaultResponse = "I can help you with writing tips, blog ideas, and content improvement strategies. What specific aspect would you like to know more about?";
  
  const query_lower = query.toLowerCase();
  const matchedResponse = responses.find(r => 
    r.keywords.some(keyword => query_lower.includes(keyword))
  );

  return matchedResponse?.response || defaultResponse;
};