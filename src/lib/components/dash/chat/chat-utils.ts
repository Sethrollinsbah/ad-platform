import type { RestaurantInfo } from '../dashboard-types';

// Function to generate mock AI responses
export function generateAIResponse(question: string, restaurantInfo: RestaurantInfo): string {
  question = question.toLowerCase();

  if (question.includes('italian') || question.includes('pasta') || question.includes('pizza')) {
    restaurantInfo.type = 'Italian';
    return 'Great! Italian cuisine is popular and has broad appeal. For Italian restaurants, we typically focus on appealing food imagery, family-style dining experiences, and authentic flavors. What location are you in? This will help us target the right audience.';
  }

  if (question.includes('budget')) {
    return 'With your $750 budget, I recommend a combination of targeted Facebook ads to local food enthusiasts and Google Search ads for people looking for restaurants in your area. This should generate approximately 40,000 impressions and drive around 2,000 clicks to your website or listing. Would you like to focus more on brand awareness or direct conversions like reservations and orders?';
  }

  if (question.includes('audience') || question.includes('demographic')) {
    return 'For your restaurant, I recommend targeting these audience segments:\n\n1. Local residents within 5-7 miles (primary)\n2. Office workers looking for lunch options (if applicable)\n3. Weekend diners looking for special experiences\n4. Food enthusiasts and reviewers\n\nWe can create custom audiences based on interests, location, and dining behaviors. Which of these audiences is most important to you?';
  }

  if (question.includes('goal') || question.includes('objective')) {
    return 'For restaurant campaigns, we typically focus on these objectives:\n\n1. Increase reservations/bookings\n2. Drive foot traffic to your location\n3. Boost online orders/takeout\n4. Promote special events or new menu items\n5. Build brand awareness locally\n\nWhich of these aligns best with your current priorities?';
  }

  if (
    question.includes('creative') ||
    question.includes('image') ||
    question.includes('design')
  ) {
    return 'Great question about creative design! For restaurant ads, high-quality food photography is essential. We recommend:\n\n1. Professional photos of signature dishes\n2. Warm, inviting images of your dining area\n3. Happy customers enjoying their experience\n4. Any unique elements of your restaurant (patio, view, special features)\n\nWould you like me to recommend a photographer or help with guidelines for your existing images?';
  }

  if (
    question.includes('platform') ||
    question.includes('facebook') ||
    question.includes('instagram') ||
    question.includes('google')
  ) {
    return 'Based on your goals and audience, I recommend this platform mix:\n\n• Instagram (40% of budget): Best for food imagery and reaching younger diners\n• Facebook (30%): Great for local targeting and events\n• Google Search (30%): Capture high-intent users searching for restaurants\n\nThis balanced approach will maximize both awareness and conversions. Does this align with your thinking?';
  }

  if (question.includes('hello') || question.includes('hi ') || question.includes('hey')) {
    return "Hello! I'm excited to help you create an effective ad campaign for your restaurant. To get started, could you tell me about your restaurant? What type of cuisine do you serve, and what makes your restaurant special?";
  }

  // Default response
  return "That's great information to help build your campaign. As we continue, I'll help you define your target audience, budget allocation, creative approach, and conversion goals. Is there anything specific about restaurant advertising you'd like to know more about?";
}

// Function to extract budget from user input
export function extractBudgetFromInput(input: string): number | null {
  const input_lower = input.toLowerCase();
  
  if (input_lower.includes('budget') || input_lower.includes('spend') || input_lower.includes('cost')) {
    if (input_lower.includes('500')) return 500;
    if (input_lower.includes('1000') || input_lower.includes('1,000')) return 1000;
    if (input_lower.includes('1500') || input_lower.includes('1,500')) return 1500;
    if (input_lower.includes('2000') || input_lower.includes('2,000')) return 2000;
  }
  
  return null;
}

// Function to determine conversation focus
export function determineConversationFocus(input: string): {
  audienceFocus?: boolean;
  conversionFocus?: string;
  onlineOrdersFocus?: boolean;
} {
  const input_lower = input.toLowerCase();
  const result: {
    audienceFocus?: boolean;
    conversionFocus?: string;
    onlineOrdersFocus?: boolean;
  } = {};
  
  // Check for audience focus
  if (input_lower.includes('audience') || input_lower.includes('demographic') || input_lower.includes('people')) {
    result.audienceFocus = true;
  }
  
  // Check for conversion focus
  if (input_lower.includes('reservation') || input_lower.includes('book') || input_lower.includes('call')) {
    result.conversionFocus = 'calls';
  }
  
  // Check for online orders focus
  if (input_lower.includes('online') || input_lower.includes('order') || input_lower.includes('delivery')) {
    result.onlineOrdersFocus = true;
  }
  
  return result;
}
