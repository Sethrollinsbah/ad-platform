// src/routes/sitemap.xml/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  // You can make this dynamic by fetching data from a CMS or database
  const pages = [
    {
      url: 'https://resads.com/',
      lastMod: '2025-03-27',
      changeFreq: 'weekly',
      priority: 1.0
    },
    {
      url: 'https://resads.com/features',
      lastMod: '2025-03-27',
      changeFreq: 'monthly',
      priority: 0.8
    },
    {
      url: 'https://resads.com/pricing',
      lastMod: '2025-03-27',
      changeFreq: 'monthly',
      priority: 0.9
    },
    {
      url: 'https://resads.com/testimonials',
      lastMod: '2025-03-27',
      changeFreq: 'monthly',
      priority: 0.7
    },
    {
      url: 'https://resads.com/contact',
      lastMod: '2025-03-27',
      changeFreq: 'monthly',
      priority: 0.8
    },
    {
      url: 'https://resads.com/blog',
      lastMod: '2025-03-27',
      changeFreq: 'weekly',
      priority: 0.7
    }
  ];

  // Create the sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastMod}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
};
