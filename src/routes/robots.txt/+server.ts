// src/routes/robots.txt/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  // You can make this dynamic based on environment or other factors
  const baseUrl = 'https://resads.com';
  
  const robotsTxt = `# www.robotstxt.org/

# Allow crawling of all content
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin pages
Disallow: /admin/
Disallow: /dashboard/

# Block specific bots that may overload the server
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: MJ12bot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};
