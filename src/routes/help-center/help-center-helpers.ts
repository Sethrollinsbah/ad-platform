// src/lib/help-center/help-center-helpers.ts
import type { Guide, Category, FAQ, FAQCategory } from './types';
import helpGuidesData from './help-guides.json';

/**
 * Get all help guides
 */
export const getAllGuides = (): Guide[] => {
  return helpGuidesData.guides;
};

/**
 * Get a guide by ID
 */
export const getGuideById = (id: string): Guide | undefined => {
  return helpGuidesData.guides.find(guide => guide.id === id);
};

/**
 * Get all categories
 */
export const getAllCategories = (): Category[] => {
  return helpGuidesData.categories;
};

/**
 * Get guides by category
 */
export const getGuidesByCategory = (categoryId: string): Guide[] => {
  return helpGuidesData.guides.filter(guide => guide.category.toLowerCase() === categoryId.toLowerCase());
};

/**
 * Get related guides
 */
export const getRelatedGuides = (guideId: string, limit = 3): Guide[] => {
  const guide = getGuideById(guideId);
  
  if (!guide || !guide.relatedGuides) {
    return [];
  }
  
  return guide.relatedGuides
    .map(id => getGuideById(id))
    .filter((guide): guide is Guide => guide !== undefined)
    .slice(0, limit);
};

/**
 * Search guides
 */
export const searchGuides = (query: string): Guide[] => {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return helpGuidesData.guides.filter(guide => 
    guide.title.toLowerCase().includes(lowerQuery) ||
    guide.description.toLowerCase().includes(lowerQuery) ||
    guide.sections.some(section => 
      section.heading.toLowerCase().includes(lowerQuery) ||
      section.content.toLowerCase().includes(lowerQuery)
    )
  );
};

/**
 * Get all FAQs
 */
export const getAllFAQs = (): FAQ[] => {
  return helpGuidesData.faqs;
};

/**
 * Get FAQs by category
 */
export const getFAQsByCategory = (categoryId: string): FAQ[] => {
  return helpGuidesData.faqs.filter(faq => faq.category === categoryId);
};

/**
 * Get all FAQ categories
 */
export const getAllFAQCategories = (): FAQCategory[] => {
  return helpGuidesData.faqCategories;
};

/**
 * Search FAQs
 */
export const searchFAQs = (query: string): FAQ[] => {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return helpGuidesData.faqs.filter(faq => 
    faq.question.toLowerCase().includes(lowerQuery) ||
    faq.answer.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get most popular guides
 */
export const getPopularGuides = (limit = 5): Guide[] => {
  // In a real app, this would be based on view counts or other metrics
  // For now, we'll just return the first few guides as a placeholder
  return helpGuidesData.guides.slice(0, limit);
};

/**
 * Format the guide content from sections to HTML
 */
export const formatGuideContent = (guide: Guide): string => {
  if (!guide.sections) return '';
  
  return guide.sections.map(section => `
    <h2>${section.heading}</h2>
    <div class="mt-4 mb-6">
      ${section.content.replace(/\n\n/g, '<br><br>')}
    </div>
  `).join('');
};
