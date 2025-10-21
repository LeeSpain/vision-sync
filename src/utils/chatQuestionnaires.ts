export const QUESTIONNAIRE_FLOWS = {
  service_type: {
    question: "Which type of solution best fits your needs?",
    interactiveType: "service_selector",
    options: [
      {
        id: "ai_agent",
        label: "AI Agent Solutions",
        icon: "🤖",
        description: "Custom AI-powered platforms and intelligent applications",
        value: "ai_agent"
      },
      {
        id: "off_shelf",
        label: "Off-the-Shelf Products",
        icon: "📦",
        description: "Ready-to-deploy solutions for immediate use",
        value: "off_shelf"
      },
      {
        id: "bespoke",
        label: "Bespoke Builds",
        icon: "🎨",
        description: "Fully custom development tailored to requirements",
        value: "bespoke"
      }
    ]
  },
  
  budget_range: {
    question: "What's your estimated budget range?",
    interactiveType: "multiple_choice",
    options: [
      { id: "under_5k", label: "Under $5,000", value: "under_5k", description: "Starter projects" },
      { id: "5k_15k", label: "$5,000 - $15,000", value: "5k_15k", description: "Small to medium" },
      { id: "15k_50k", label: "$15,000 - $50,000", value: "15k_50k", description: "Medium to large" },
      { id: "50k_plus", label: "$50,000+", value: "50k_plus", description: "Enterprise scale" },
      { id: "flexible", label: "Flexible / Not sure", value: "flexible", description: "Open to recommendations" }
    ]
  },
  
  timeline: {
    question: "When do you need this completed?",
    interactiveType: "quick_reply",
    options: [
      { id: "asap", label: "As soon as possible", value: "asap", icon: "⚡" },
      { id: "1_3months", label: "1-3 months", value: "1_3months", icon: "📅" },
      { id: "3_6months", label: "3-6 months", value: "3_6months", icon: "🗓️" },
      { id: "6plus", label: "6+ months", value: "6plus", icon: "⏰" },
      { id: "flexible", label: "Flexible timeline", value: "flexible", icon: "🤷" }
    ]
  },
  
  industry: {
    question: "What industry is your business in?",
    interactiveType: "multiple_choice",
    options: [
      { id: "healthcare", label: "Healthcare", icon: "🏥", value: "healthcare" },
      { id: "retail", label: "Retail / E-commerce", icon: "🛍️", value: "retail" },
      { id: "real_estate", label: "Real Estate", icon: "🏠", value: "real_estate" },
      { id: "finance", label: "Finance", icon: "💰", value: "finance" },
      { id: "education", label: "Education", icon: "📚", value: "education" },
      { id: "hospitality", label: "Hospitality", icon: "🏨", value: "hospitality" },
      { id: "other", label: "Other", icon: "💼", value: "other" }
    ]
  }
};

export type QuestionnaireFlowKey = keyof typeof QUESTIONNAIRE_FLOWS;
