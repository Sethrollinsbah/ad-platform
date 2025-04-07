// src/lib/server/db/init.ts
// This file contains functions to initialize the database with default data

import { db, schema } from './index';
import { eq } from 'drizzle-orm';

/**
 * Initialize the database with some default data if empty
 */
export async function initializeDatabase() {
  try {
    // Check if any projects exist
    const existingProjects = await db
      .select({ count: { value: db.fn.count() } })
      .from(schema.projects);
    
    const projectCount = existingProjects[0]?.count?.value || 0;
    
    if (projectCount === 0) {
      console.log('No projects found. Creating default projects...');
      await createDefaultProjects();
    } else {
      console.log(`Database already contains ${projectCount} projects. Skipping initialization.`);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

/**
 * Create default projects
 */
async function createDefaultProjects() {
  const defaultProjects = [
    {
      name: 'resads-demo',
      displayName: 'ResAds Demo',
      active: true
    },
    {
      name: 'italian-restaurant',
      displayName: 'Italian Restaurant',
      active: true
    },
    {
      name: 'cafe-bistro',
      displayName: 'Café Bistro',
      active: false
    }
  ];
  
  for (const project of defaultProjects) {
    const [newProject] = await db
      .insert(schema.projects)
      .values({
        name: project.name,
        displayName: project.displayName,
        active: project.active,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    // Create a restaurant for this project
    const [restaurant] = await db
      .insert(schema.restaurants)
      .values({
        name: `${project.displayName} Restaurant`,
        type: 'Restaurant',
        location: 'Example City, State',
        contactEmail: `contact@${project.name}.example.com`,
        contactPhone: '(555) 123-4567',
        projectId: newProject.id,
        createdAt: new Date()
      })
      .returning();
    
    // Create default campaigns for the first project
    if (project.name === 'resads-demo') {
      await createDefaultCampaigns(newProject.id, restaurant.id);
    }
  }
  
  console.log('Default projects created successfully.');
}

/**
 * Create default campaigns for a project
 */
async function createDefaultCampaigns(projectId: number, restaurantId: number) {
  // Create default campaigns
  const defaultCampaigns = [
    {
      name: 'Weekend Special',
      status: 'Active',
      budget: 1200,
      spent: 487.25,
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-04-15')
    },
    {
      name: 'Happy Hour Promotion',
      status: 'Scheduled',
      budget: 800,
      spent: 0,
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-30')
    }
  ];
  
  for (const campaignData of defaultCampaigns) {
    const [campaign] = await db
      .insert(schema.campaigns)
      .values({
        ...campaignData,
        restaurantId,
        projectId,
        createdAt: new Date()
      })
      .returning();
    
    // For the Weekend Special campaign, add platforms
    if (campaignData.name === 'Weekend Special') {
      await createDefaultPlatforms(campaign.id);
    }
  }
}

/**
 * Create default platforms for a campaign
 */
async function createDefaultPlatforms(campaignId: number) {
  // Create or get platforms
  const platformsData = [
    { name: 'Instagram', type: 'Social' },
    { name: 'Google', type: 'Search' },
    { name: 'Facebook', type: 'Social' }
  ];
  
  for (const platformData of platformsData) {
    // Check if platform exists
    const existingPlatforms = await db
      .select()
      .from(schema.platforms)
      .where(eq(schema.platforms.name, platformData.name));
    
    let platformId: number;
    
    if (existingPlatforms.length > 0) {
      platformId = existingPlatforms[0].id;
    } else {
      const [newPlatform] = await db
        .insert(schema.platforms)
        .values({
          ...platformData,
          createdAt: new Date()
        })
        .returning();
      
      platformId = newPlatform.id;
    }
    
    // Associate platform with campaign
    const budgetPercentage = platformData.name === 'Instagram' ? 35 : 
                             platformData.name === 'Google' ? 40 : 25;
    
    await db
      .insert(schema.campaignPlatforms)
      .values({
        campaignId,
        platformId,
        isPrimary: platformData.name === 'Instagram',
        budgetPercentage
      });
  }
}
