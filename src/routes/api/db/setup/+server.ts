// src/routes/api/db/seed/+server.ts
import { json } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { sql, count } from 'drizzle-orm';

/**
 * Seed database with project-specific initial data
 */
async function seedDatabase(projectId = 'default') {
  try {
    console.log(`Seeding database for project: ${projectId}...`);
    
    // First check if this project already exists
    const existingProject = await db
      .select()
      .from(schema.projects)
      .where(sql`name = ${projectId}`)
      .limit(1);
      
    let projectDbId;
    
    if (existingProject.length > 0) {
      console.log('Project already exists in database');
      projectDbId = existingProject[0].id;
    } else {
      // Insert the project
      const [project] = await db
        .insert(schema.projects)
        .values({
          name: projectId,
          displayName: getProjectDisplayName(projectId),
          active: true,
          createdAt: new Date()
        })
        .returning();
        
      projectDbId = project.id;
    }
    
    // Get project-specific data
    const projectData = getProjectSeedData(projectId);
    
    // Insert project-specific restaurant
    const [restaurant] = await db
      .insert(schema.restaurants)
      .values({
        name: projectData.restaurant.name,
        type: projectData.restaurant.type,
        location: projectData.restaurant.location,
        contactEmail: projectData.restaurant.contactEmail,
        contactPhone: projectData.restaurant.contactPhone,
        projectId: projectDbId
      })
      .returning();
      
    const restaurantId = restaurant.id;
    
    // Insert project-specific campaigns
    for (const campaignData of projectData.campaigns) {
      const [campaign] = await db
        .insert(schema.campaigns)
        .values({
          name: campaignData.name,
          status: campaignData.status,
          budget: campaignData.budget,
          spent: campaignData.spent || 0,
          startDate: new Date(campaignData.startDate),
          endDate: new Date(campaignData.endDate),
          restaurantId,
          projectId: projectDbId
        })
        .returning();
        
      // Insert campaign platforms
      if (campaignData.platforms && campaignData.platforms.length > 0) {
        for (const platformData of campaignData.platforms) {
          // Check if platform exists, create if not
          let platformId;
          const existingPlatform = await db
            .select()
            .from(schema.platforms)
            .where(sql`name = ${platformData.name}`)
            .limit(1);
            
          if (existingPlatform.length > 0) {
            platformId = existingPlatform[0].id;
          } else {
            const [platform] = await db
              .insert(schema.platforms)
              .values({
                name: platformData.name,
                type: platformData.type
              })
              .returning();
              
            platformId = platform.id;
          }
          
          // Insert campaign-platform relationship
          await db
            .insert(schema.campaignPlatforms)
            .values({
              campaignId: campaign.id,
              platformId,
              isPrimary: platformData.isPrimary || false,
              budgetPercentage: platformData.budgetPercentage
            });
            
          // Insert some metrics for this platform
          if (platformData.metrics) {
            const today = new Date();
            const metricsData = [];
            
            // Generate metrics for the past 7 days
            for (let i = 6; i >= 0; i--) {
              const date = new Date();
              date.setDate(today.getDate() - i);
              
              // Create some variation in the metrics
              const baseImpressions = platformData.metrics.impressions / 7;
              const baseClicks = platformData.metrics.clicks / 7;
              const baseConversions = platformData.metrics.conversions / 7;
              const baseSpend = platformData.metrics.spend / 7;
              
              const variance = 0.2; // 20% variance
              
              metricsData.push({
                campaignId: campaign.id,
                platformId,
                date,
                impressions: Math.floor(baseImpressions * (1 + (Math.random() * variance * 2 - variance))),
                clicks: Math.floor(baseClicks * (1 + (Math.random() * variance * 2 - variance))),
                conversions: Math.floor(baseConversions * (1 + (Math.random() * variance * 2 - variance))),
                spend: baseSpend * (1 + (Math.random() * variance * 2 - variance))
              });
            }
            
            await db
              .insert(schema.platformMetrics)
              .values(metricsData);
          }
        }
      }
      
      // Insert campaign metrics
      if (campaignData.metrics) {
        const today = new Date();
        const metricsData = [];
        
        // Generate metrics for the past 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          
          // Create some variation in the metrics
          const baseImpressions = campaignData.metrics.impressions / 7;
          const baseClicks = campaignData.metrics.clicks / 7;
          const baseConversions = campaignData.metrics.conversions / 7;
          const baseSpend = campaignData.metrics.spend / 7;
          
          const variance = 0.2; // 20% variance
          
          metricsData.push({
            campaignId: campaign.id,
            date,
            impressions: Math.floor(baseImpressions * (1 + (Math.random() * variance * 2 - variance))),
            clicks: Math.floor(baseClicks * (1 + (Math.random() * variance * 2 - variance))),
            conversions: Math.floor(baseConversions * (1 + (Math.random() * variance * 2 - variance))),
            spend: baseSpend * (1 + (Math.random() * variance * 2 - variance))
          });
        }
        
        await db
          .insert(schema.campaignMetrics)
          .values(metricsData);
      }
    }
    
    // Insert customers data
    if (projectData.customers && projectData.customers.length > 0) {
      const customersData = projectData.customers.map(customer => ({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        city: customer.city,
        acquisitionSource: customer.acquisitionSource,
        orderCount: customer.orderCount,
        totalSpent: customer.totalSpent,
        restaurantId,
        projectId: projectDbId,
        createdAt: new Date(customer.createdAt || (Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)),
        lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate) : null
      }));
      
      await db
        .insert(schema.customers)
        .values(customersData);
    }
    
    console.log(`Database seeded successfully for project: ${projectId}!`);
    return true;
  } catch (error) {
    console.error(`Error seeding database for project ${projectId}:`, error);
    return false;
  }
}

/**
 * Helper to get the display name for a project
 */
function getProjectDisplayName(projectId: string): string {
  const displayNames: Record<string, string> = {
    'planetbun': 'Planet Bun Restaurant',
    'nike-sportswear': 'Nike Sportswear',
    'starbucks-seasonal': 'Starbucks Seasonal',
    'amazon-prime': 'Amazon Prime',
    'spotify-premium': 'Spotify Premium',
    'tesla-models': 'Tesla Motors'
  };
  
  return displayNames[projectId] || projectId;
}

/**
 * Get project-specific seed data
 */
function getProjectSeedData(projectId: string): any {
  // You could store this in a separate file or database
  // For this example, we'll define it inline
  
  const projectData: Record<string, any> = {
    'planetbun': {
      restaurant: {
        name: 'Planet Bun',
        type: 'Burger Restaurant',
        location: 'Miami, FL',
        contactEmail: 'contact@planetbun.com',
        contactPhone: '(555) 123-4567'
      },
      campaigns: [
        {
          name: 'Weekend Special Promotion',
          status: 'Active',
          budget: 1200,
          spent: 487.25,
          startDate: '2025-03-01',
          endDate: '2025-04-15',
          metrics: {
            impressions: 42350,
            clicks: 2118,
            conversions: 169,
            spend: 487.25
          },
          platforms: [
            {
              name: 'Instagram',
              type: 'Social',
              isPrimary: true,
              budgetPercentage: 35,
              metrics: {
                impressions: 22500,
                clicks: 1125,
                conversions: 90,
                spend: 170.54
              }
            },
            {
              name: 'Facebook',
              type: 'Social',
              isPrimary: false,
              budgetPercentage: 25,
              metrics: {
                impressions: 9850,
                clicks: 493,
                conversions: 39,
                spend: 121.81
              }
            },
            {
              name: 'Google',
              type: 'Search',
              isPrimary: false,
              budgetPercentage: 40,
              metrics: {
                impressions: 10000,
                clicks: 500,
                conversions: 40,
                spend: 194.90
              }
            }
          ]
        },
        {
          name: 'Happy Hour Promo',
          status: 'Scheduled',
          budget: 800,
          spent: 0,
          startDate: '2025-04-01',
          endDate: '2025-04-30'
        }
      ],
      customers: [
        { 
          name: 'John Smith', 
          email: 'john.smith@example.com', 
          phone: '(555) 111-2222', 
          city: 'Miami', 
          acquisitionSource: 'Website', 
          orderCount: 5, 
          totalSpent: 245.80 
        },
        { 
          name: 'Maria Garcia', 
          email: 'maria.g@example.com', 
          phone: '(555) 222-3333', 
          city: 'Miami', 
          acquisitionSource: 'Instagram', 
          orderCount: 3, 
          totalSpent: 157.50 
        },
        { 
          name: 'Robert Johnson', 
          email: 'rjohnson@example.com', 
          phone: '(555) 333-4444', 
          city: 'Coral Gables', 
          acquisitionSource: 'Google', 
          orderCount: 2, 
          totalSpent: 87.25 
        }
      ]
    },
    'nike-sportswear': {
      restaurant: {
        name: 'Nike Sportswear',
        type: 'Sportswear Brand',
        location: 'Portland, OR',
        contactEmail: 'marketing@nike.example.com',
        contactPhone: '(555) 987-6543'
      },
      campaigns: [
        {
          name: 'Summer Collection Launch',
          status: 'Active',
          budget: 5000,
          spent: 1250,
          startDate: '2025-04-01',
          endDate: '2025-06-30',
          metrics: {
            impressions: 120000,
            clicks: 6000,
            conversions: 480,
            spend: 1250
          },
          platforms: [
            {
              name: 'Instagram',
              type: 'Social',
              isPrimary: true,
              budgetPercentage: 40,
              metrics: {
                impressions: 60000,
                clicks: 3000,
                conversions: 240,
                spend: 500
              }
            },
            {
              name: 'TikTok',
              type: 'Social',
              isPrimary: false,
              budgetPercentage: 30,
              metrics: {
                impressions: 40000,
                clicks: 2000,
                conversions: 160,
                spend: 375
              }
            },
            {
              name: 'Google',
              type: 'Search',
              isPrimary: false,
              budgetPercentage: 30,
              metrics: {
                impressions: 20000,
                clicks: 1000,
                conversions: 80,
                spend: 375
              }
            }
          ]
        }
      ],
      customers: [
        { 
          name: 'Alex Johnson', 
          email: 'alex.j@example.com', 
          phone: '(555) 111-9999', 
          city: 'Portland', 
          acquisitionSource: 'Instagram', 
          orderCount: 3, 
          totalSpent: 345.50 
        },
        { 
          name: 'Samantha Williams', 
          email: 'samw@example.com', 
          phone: '(555) 222-8888', 
          city: 'Seattle', 
          acquisitionSource: 'TikTok', 
          orderCount: 2, 
          totalSpent: 210.75 
        }
      ]
    },
    'starbucks-seasonal': {
      restaurant: {
        name: 'Starbucks',
        type: 'Coffee Chain',
        location: 'Seattle, WA',
        contactEmail: 'marketing@starbucks.example.com',
        contactPhone: '(555) 456-7890'
      },
      campaigns: [
        {
          name: 'Spring Drink Promotion',
          status: 'Active',
          budget: 3500,
          spent: 875,
          startDate: '2025-03-15',
          endDate: '2025-04-30',
          metrics: {
            impressions: 85000,
            clicks: 4250,
            conversions: 340,
            spend: 875
          },
          platforms: [
            {
              name: 'Facebook',
              type: 'Social',
              isPrimary: true,
              budgetPercentage: 35,
              metrics: {
                impressions: 42500,
                clicks: 2125,
                conversions: 170,
                spend: 306.25
              }
            },
            {
              name: 'Instagram',
              type: 'Social',
              isPrimary: false,
              budgetPercentage: 35,
              metrics: {
                impressions: 29750,
                clicks: 1487,
                conversions: 119,
                spend: 306.25
              }
            },
            {
              name: 'Email',
              type: 'Email',
              isPrimary: false,
              budgetPercentage: 30,
              metrics: {
                impressions: 12750,
                clicks: 638,
                conversions: 51,
                spend: 262.50
              }
            }
          ]
        }
      ],
      customers: [
        { 
          name: 'Chris Taylor', 
          email: 'ctaylor@example.com', 
          phone: '(555) 333-7777', 
          city: 'Seattle', 
          acquisitionSource: 'Facebook', 
          orderCount: 12, 
          totalSpent: 87.60 
        },
        { 
          name: 'Emma Wilson', 
          email: 'emma.w@example.com', 
          phone: '(555) 444-6666', 
          city: 'Bellevue', 
          acquisitionSource: 'Email', 
          orderCount: 8, 
          totalSpent: 64.40 
        }
      ]
    }
  };
  
  // Return the specific project data or default if not found
  return projectData[projectId] || projectData['planetbun'];
}

/**
 * Endpoint to seed the database with project data
 */
export async function POST({ request }) {
  // In a real app, you would check for authentication and authorization here
  try {
    const body = await request.json();
    const { projectId = 'default' } = body;
    
    const result = await seedDatabase(projectId);
    
    return json({
      success: result,
      projectId
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Endpoint to seed all projects at once
 */
export async function GET() {
  try {
    const projectIds = ['planetbun', 'nike-sportswear', 'starbucks-seasonal'];
    const results = {};
    
    for (const projectId of projectIds) {
      results[projectId] = await seedDatabase(projectId);
    }
    
    return json({
      success: Object.values(results).every(Boolean),
      results
    });
  } catch (error) {
    console.error('Error seeding all projects:', error);
    return json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
