// src/lib/help-center/types.ts

/**
 * Help guide section
 */
export interface GuideSection {
  heading: string;
  content: string;
}

/**
 * Help guide
 */
export interface Guide {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  lastUpdated: string;
  readTime: string;
  author: string;
  slug: string;
  sections: GuideSection[];
  relatedGuides: string[];
}

/**
 * Category
 */
export interface Category {
  id: string;
  name: string;
  description: string;
}

/**
 * FAQ Category
 */
export interface FAQCategory {
  id: string;
  name: string;
  icon: string;
}

/**
 * FAQ Item
 */
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

/**
 * Help guides data structure
 */
export interface HelpGuidesData {
  guides: Guide[];
  categories: Category[];
  faqCategories: FAQCategory[];
  faqs: FAQ[];
}

/**
 * Contact option
 */
export interface ContactOption {
  title: string;
  description: string;
  icon: string;
  action: string;
  link: string;
}

/**
 * Search results
 */
export interface SearchResults {
  guides: Guide[];
  faqs: FAQ[];
}
