// CORE

export enum CorePlan {
  FREE = "FREE",
  PERSONAL = "PERSONAL",
  TEAM_FREE = "TEAM_FREE",
  SPECIAL_TEAM_FREE_FOR_LTD_USER = "SPECIAL_TEAM_FREE_FOR_LTD_USER",
  TEAM = "TEAM",
  LIFETIME = "LIFETIME",
  LIFETIME_PRO = "LIFETIME_PRO",
  LEGACY_LIFETIME_PRO = "LEGACY_LIFETIME_PRO",
  EXCLUSIVE_LIFETIME = "EXCLUSIVE_LIFETIME",
  EXCLUSIVE_LIFETIME_PRO = "EXCLUSIVE_LIFETIME_PRO",
  EXCLUSIVE_LIFETIME_MAX = "EXCLUSIVE_LIFETIME_MAX",
}

export const PAID_FEATURE_LIST = [
  "Copilot mode",
  "Access to all plugins",
  "Custom API actions",
  "Integrations with external knowledge storages",
  "Access to GPT-4 Turbo",
]

export const CORE_PLAN_LIST = [
  {
    enum: CorePlan.FREE,
    isHidden: false,
    display_name: "Free",
    is_lifetime: true,
    is_personal: true,
    desc: "Best for trying out MindPal",
    notice: null,
    checkout_data: {
      billed_one_time: {
        price: 0,
        product_id: null,
        variant_id: null,
        checkout_url: null,
      },
    },
    limits: {
      no_seats_included: 0,
      max_ai_queries: 50,
      max_knowledge_sources: 0.1,
      max_chatbots: 0,
      max_chatbot_messages: 0,
      is_llm_api_key_required: false,
      is_plugins_unlimited: false,
    }, 
  },
  {
    enum: CorePlan.PERSONAL,
    isHidden: false,
    display_name: "Personal Pro",
    is_lifetime: false,
    is_personal: true,
    desc: "Best for individual use",
    checkout_data: {
      billed_monthly: {
        price: 20,
        product_id: 112691,
        variant_id: 128149,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/20dc7d18-041e-4ca8-a2b6-5a9c7f8ff6d1",
      },
      billed_yearly: {
        price: 15,
        product_id: 112691,
        variant_id: 242982,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/0a446909-8337-4417-aa03-85cc6a76211c",
      },
    },
    limits: {
      no_seats_included: 0,
      max_ai_queries: 2000,
      max_knowledge_sources: 5,
      max_chatbots: 0,
      max_chatbot_messages: 0,
      is_llm_api_key_required: false,
      is_plugins_unlimited: true,
    }, 
    notice: null,
  },
  {
    enum: CorePlan.LIFETIME,
    isHidden: false,
    display_name: "Lifetime Unlimited",
    is_lifetime: true,
    is_personal: true,
    desc: "Best for individual use",
    checkout_data: {
      billed_one_time: {
        price: 129,
        product_id: 112691,
        variant_id: 138037,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/c4880b43-7707-4c56-afd8-92084768117e",
      },
    },
    limits: {
      no_seats_included: 0,
      max_ai_queries: null,
      max_knowledge_sources: 20,
      max_chatbots: 0,
      max_chatbot_messages: 0,
      is_llm_api_key_required: true,
      is_plugins_unlimited: false,
    }, 
    notice: "You will need to input your own OpenAI API Key to power your usage on MindPal. Your API Key is securely stored on your local browser.",
  },
  {
    enum: CorePlan.LIFETIME_PRO,
    isHidden: false,
    display_name: "Lifetime Unlimited Pro",
    is_lifetime: true,
    is_personal: true,
    desc: "Best for business use",
    checkout_data: {
      billed_one_time: {
        price: 249,
        product_id: 112691,
        variant_id: 128152,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/80979c8d-0419-4e47-807f-954bdd475c30",
      },
    },
    limits: {
      no_seats_included: 0,
      max_ai_queries: null,
      max_knowledge_sources: 50,
      max_chatbots: null,
      max_chatbot_messages: null,
      is_llm_api_key_required: true,
      is_plugins_unlimited: false,
    }, 
    notice: "You will need to input your own OpenAI API Key to power your usage on MindPal. Your API Key is securely stored on your local browser.",
  },
  {
    enum: CorePlan.LEGACY_LIFETIME_PRO,
    isHidden: true,
    display_name: "Legacy Lifetime Unlimited Pro",
    is_lifetime: true,
    is_personal: true,
    desc: "Best for business use",
    checkout_data: {
      billed_one_time: {
        price: 249,
        product_id: 112691,
        variant_id: 128152,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/80979c8d-0419-4e47-807f-954bdd475c30",
      },
    },
    limits: {
      no_seats_included: 0,
      max_ai_queries: null,
      max_knowledge_sources: 50,
      max_chatbots: null,
      max_chatbot_messages: null,
      is_llm_api_key_required: true,
      is_plugins_unlimited: false,
    }, 
    notice: "You will need to input your own OpenAI API Key to power your usage on MindPal. Your API Key is securely stored on your local browser.",
  },
  {
    enum: CorePlan.EXCLUSIVE_LIFETIME,
    isHidden: false,
    display_name: "Lifetime Unlimited",
    is_lifetime: true,
    is_personal: true,
    desc: "Best for individual use",
    checkout_data: {
      billed_one_time: {
        price: 149,
        product_id: 160632,
        variant_id: 202185,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/34efae6a-91ca-43ce-8f46-e0b3fa3e7771",
      },
    },
    limits: {
      no_seats_included: 0,
      max_ai_queries: null,
      max_knowledge_sources: 5,
      max_chatbots: 0,
      max_chatbot_messages: 0,
      is_llm_api_key_required: true,
      is_plugins_unlimited: false,
    }, 
    notice: "You will need to input your own OpenAI API Key to power your usage on MindPal. Your API Key is securely stored on your local browser.",
  },
  {
    enum: CorePlan.EXCLUSIVE_LIFETIME_PRO,
    isHidden: false,
    display_name: "Lifetime Unlimited PRO",
    is_lifetime: true,
    is_personal: true,
    desc: "Best for agency & business use",
    checkout_data: {
      billed_one_time: {
        price: 249,
        product_id: 160632,
        variant_id: 202186,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/81f095b3-061b-4213-84dc-b8aece160d33",
      },
    },
    limits: {
      no_seats_included: 0,
      max_ai_queries: null,
      max_knowledge_sources: 5,
      max_chatbots: null,
      max_chatbot_messages: null,
      is_llm_api_key_required: true,
      is_plugins_unlimited: false,
    }, 
    notice: "You will need to input your own OpenAI API Key to power your usage on MindPal. Your API Key is securely stored on your local browser.",
  },
  {
    enum: CorePlan.EXCLUSIVE_LIFETIME_MAX,
    isHidden: false,
    display_name: "Lifetime Unlimited MAX",
    is_lifetime: true,
    is_personal: true,
    desc: "Best for agency & business use",
    checkout_data: {
      billed_one_time: {
        price: 399,
        product_id: 160632,
        variant_id: 205257,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/80300787-60e8-40d8-9c65-4332df6349ee?aff=adXbL",
      },
    },
    limits: {
      no_seats_included: 0,
      max_ai_queries: null,
      max_knowledge_sources: 5,
      max_chatbots: null,
      max_chatbot_messages: null,
      is_llm_api_key_required: true,
      is_plugins_unlimited: true,
    }, 
    notice: "You will need to input your own OpenAI API Key to power your usage on MindPal. Your API Key is securely stored on your local browser.",
  },
  {
    enum: CorePlan.TEAM_FREE,
    isHidden: false,
    display_name: "Team Free",
    is_lifetime: true,
    is_personal: false,
    desc: "Best for teams trying out MindPal",
    checkout_data: {
      billed_one_time: {
        price: 0,
        product_id: null,
        variant_id: null,
        checkout_url: null,
      },
    },
    limits: {
      no_seats_included: 5,
      max_ai_queries: 50,
      max_knowledge_sources: 0.1,
      max_chatbots: 0,
      max_chatbot_messages: 0,
      is_llm_api_key_required: false,
      is_plugins_unlimited: false,
    }, 
    notice: null,
  },
  {
    enum: CorePlan.SPECIAL_TEAM_FREE_FOR_LTD_USER,
    isHidden: false,
    display_name: "Special Team Free",
    is_lifetime: true,
    is_personal: false,
    desc: "Special team plan for MindPal's LTD early adopters",
    checkout_data: {
      billed_one_time: {
        price: 0,
        product_id: null,
        variant_id: null,
        checkout_url: null,
      },
    },
    limits: {
      no_seats_included: 5,
      max_ai_queries: null,
      max_knowledge_sources: 0,
      max_chatbots: null,
      max_chatbot_messages: null,
      is_llm_api_key_required: true,
      is_plugins_unlimited: false,
    }, 
    notice: "The owner will need to input an OpenAI API Key to power this team's usage on MindPal.",
  },
  {
    enum: CorePlan.TEAM,
    isHidden: false,
    display_name: "Team Pro",
    is_lifetime: false,
    is_personal: false,
    desc: "Best for innovative teams",
    checkout_data: {
      billed_monthly: {
        price: 20,
        product_id: 112691,
        variant_id: 128149,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/20dc7d18-041e-4ca8-a2b6-5a9c7f8ff6d1",
      },
      billed_yearly: {
        price: 15,
        product_id: 112691,
        variant_id: 242982,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/0a446909-8337-4417-aa03-85cc6a76211c",
      },
    },
    limits: {
      no_seats_included: 0,
      max_ai_queries: 2000,
      max_knowledge_sources: 5,
      max_chatbots: 0,
      max_chatbot_messages: 0,
      is_llm_api_key_required: false,
      is_plugins_unlimited: false,
    }, 
    notice: null,
  },
]

// STORAGE TOPUP

export const STORAGE_TOPUP = [
  {
    is_personal: true,
    checkout_data: {
      billed_monthly: {
        price_per_unit: 1,
        count_per_unit: 1,
        product_id: 146504,
        variant_id: 178955,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/4b31a978-1daf-41de-a8cc-6fec54cb2941",
      },
    },
  },
]

// CHATBOT BASE

export enum ChatbotPlan {
  FREE = "FREE",
  STARTER = "STARTER",
  STANDARD = "STANDARD",
  UNLIMITED = "UNLIMITED",
}

export const CHATBOT_PLAN_LIST = [
  {
    enum: ChatbotPlan.FREE,
    display_name: "Free",
    notice: null,
    checkout_data: {
      billed_one_time: {
        price: 0,
        product_id: null,
        variant_id: null,
        checkout_url: null,
      },
    },
    limits: {
      max_chatbots: 1,
      max_chatbot_messages: 20,
      custom_chatbot_branding: false,
      enhanced_security: false,
      is_llm_api_key_required: false,
    }, 
  },
  {
    enum: ChatbotPlan.STARTER,
    display_name: "Starter",
    notice: null,
    checkout_data: {
      billed_monthly: {
        price: 19,
        product_id: 146506,
        variant_id: 178957,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/61c027f9-8848-4bee-be25-25f2af2f50a2",
      },
      billed_yearly: {
        price: 190,
        product_id: 146509,
        variant_id: 178964,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/6ec553bc-5df3-4101-9f4b-866a86fcefa9",
      },
    },
    limits: {
      max_chatbots: null,
      max_chatbot_messages: 2000,
      custom_chatbot_branding: false,
      enhanced_security: false,
      is_llm_api_key_required: false,
    }, 
  },
  {
    enum: ChatbotPlan.STANDARD,
    display_name: "Standard",
    notice: null,
    checkout_data: {
      billed_monthly: {
        price: 99,
        product_id: 146506,
        variant_id: 178958,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/33c71fb5-5e70-4009-8c93-6e0fee018ddf",
      },
      billed_yearly: {
        price: 990,
        product_id: 146509,
        variant_id: 178965,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/30507f38-22e6-4604-9d64-4fd59f78e656",
      },
    },
    limits: {
      max_chatbots: null,
      max_chatbot_messages: 10000,
      custom_chatbot_branding: true,
      enhanced_security: true,
      is_llm_api_key_required: false,
    }, 
  },
  {
    enum: ChatbotPlan.UNLIMITED,
    display_name: "Unlimited",
    notice: "Messages over the limit will use your own OpenAI/ OpenRouter API Key.",
    checkout_data: {
      billed_monthly: {
        price: 399,
        product_id: 146506,
        variant_id: 178959,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/23b882c5-1cfa-430d-b781-c9fffb505c02",
      },
      billed_yearly: {
        price: 3990,
        product_id: 146509,
        variant_id: 178966,
        checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/0340db1a-66c8-4cff-b383-bfd1d2c0f023",
      },
    },
    limits: {
      max_chatbots: null,
      max_chatbot_messages: 40000,
      custom_chatbot_branding: true,
      enhanced_security: true,
      is_llm_api_key_required: true,
    }, 
  },
]

// CHATBOT MESSAGES

export const CHATBOT_MESSAGE_TOPUP = {
  billed_monthly: {
    price_per_unit: 7,
    count_per_unit: 1000,
    product_id: 146513,
    variant_id: 178972,
    checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/c7fd7082-5056-4506-8704-2342631020cd",
  },
}

// CHATBOT DOMAINS

export const CHATBOT_CUSTOM_DOMAIN_TOPUP = {
  billed_monthly: {
    price_per_unit: 29,
    count_per_unit: 1,
    product_id: 149942,
    variant_id: 184312,
    checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/2350de84-b971-4063-b19b-e8b61e10c15e",
  },
}

// VIP

export const VIP_PASS = {
  displayName: "VIP Pass",
  desc: "Become our patron",
  checkout_data: {
    billed_one_time: {
      price: 29,
      product_id: 146514,
      variant_id: 178973,
      checkout_url: "https://mindpalspace.lemonsqueezy.com/checkout/buy/81c67f84-1b27-4341-a5e8-fa1457c22298",
    },
  },
  feature_list: [
    "Support development",
    "Early access to beta versions",
    "Access to VIP channel",
  ]
}