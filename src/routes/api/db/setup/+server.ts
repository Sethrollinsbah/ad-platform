// src/routes/api/db/setup/+server.ts
import { json } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';

/**
 * Set up initial data for a project in the database
 */
export async function POST({ request }) {
  try {
    const { projectId } = await request.json();
    
    if (!projectId) {
      return json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }
    
    // Check if project already exists
    let projects = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.name, projectId))
      .limit(1);
      
    let dbProjectId;
    
    // If project doesn't exist, create it
    if (projects.length === 0) {
      const [newProject] = await db
        .insert(schema.projects)
        .values({
          name: projectId,
          displayName: projectId,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
        
      dbProjectId = newProject.id;
    } else {
      dbProjectId = projects[0].id;
    }
    
    // Check if restaurant already exists for this project
    const restaurants = await db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.projectId, dbProjectId))
      .limit(1);
      
    let restaurantId;
    
    // If restaurant doesn't exist, create it
    if (restaurants.length === 0) {
      const [newRestaurant] = await db
        .insert(schema.restaurants)
        .values({
          name: `${projectId} Restaurant`,
          type: 'Restaurant',
          location: 'Some City, State',
          contactEmail: `contact@${projectId}.com`,
          contactPhone: '(555) 123-4567',
          projectId: dbProjectId,
          createdAt: new Date()
        })
        .returning();
        
      restaurantId = newRestaurant.id;
    } else {
      restaurantId = restaurants[0].id;
    }
    
    // Define default campaigns
    const defaultCampaigns = [
      {
        name: 'Weekend Special',
        status: 'Active',
        budget: 1200,
        spent: 487.25,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-04-15'),
        restaurantId,
        projectId: dbProjectId
      },
      {
        name: 'Happy Hour Promo',
        status: 'Scheduled',
        budget: 800,
        spent: 0,
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-04-30'),
        restaurantId,
        projectId: dbProjectId
      }
    ];
    
    // Insert campaigns if they don't exist
    for (const campaignData of defaultCampaigns) {
      // Check if campaign already exists
      const existingCampaigns = await db
        .select()
        .from(schema.campaigns)
        .where(eq(schema.campaigns.name, campaignData.name))
        .limit(1);
        
      if (existingCampaigns.length === 0) {
        // Create campaign
        const [campaign] = await db
          .insert(schema.campaigns)
          .values(campaignData)
          .returning();
          
        // Define platforms for this campaign
        if (campaign.name === 'Weekend Special') {
          // Create or get platforms
          let instagramId, googleId, facebookId;
          
          // Check if platforms exist
          const platforms = await db
            .select()
            .from(schema.platforms);
            
          const instagram = platforms.find(p => p.name === 'Instagram');
          const google = platforms.find(p => p.name === 'Google');
          const facebook = platforms.find(p => p.name === 'Facebook');
          
          if (instagram) {
            instagramId = instagram.id;
          } else {
            const [newPlatform] = await db
              .insert(schema.platforms)
              .values({ name: 'Instagram', type: 'Social', createdAt: new Date() })
              .returning();
              
            instagramId = newPlatform.id;
          }
          
          if (google) {
            googleId = google.id;
          } else {
            const [newPlatform] = await db
              .insert(schema.platforms)
              .values({ name: 'Google', type: 'Search', createdAt: new Date() })
              .returning();
              
            googleId = newPlatform.id;
          }
          
          if (facebook) {
            facebookId = facebook.id;
          } else {
            const [newPlatform] = await db
              .insert(schema.platforms)
              .values({ name: 'Facebook', type: 'Social', createdAt: new Date() })
              .returning();
              
            facebookId = newPlatform.id;
          }
          
          // Associate platforms with campaign
          await db
            .insert(schema.campaignPlatforms)
            .values([
              { campaignId: campaign.id, platformId: instagramId, isPrimary: true, budgetPercentage: 35 },
              { campaignId: campaign.id, platformId: googleId, isPrimary: false, budgetPercentage: 40 },
              { campaignId: campaign.id, platformId: facebookId, isPrimary: false, budgetPercentage: 25 }
            ]);
            
          // Add campaign metrics for the past 7 days
          const today = new Date();
          const metrics = [];
          
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            
            metrics.push({
              campaignId: campaign.id,
              date,
              impressions: Math.round(6000 + Math.random() * 1000),
              clicks: Math.round(300 + Math.random() * 100),
              conversions: Math.round(24 + Math.random() * 10),
              spend: (70 + Math.random() * 10).toFixed(2)
            });
          }
          
          await db
            .insert(schema.campaignMetrics)
            .values(metrics);
            
          // Add platform metrics
          for (const platformId of [instagramId, googleId, facebookId]) {
            const platformMetrics = [];
            
            for (let i = 6; i >= 0; i--) {
              const date = new Date();
              date.setDate(today.getDate() - i);
              
              // Distribute metrics based on platform
              let impressionShare, clickShare, conversionShare, spendShare;
              
              if (platformId === instagramId) {
                impressionShare = 0.35;
                clickShare = 0.35;
                conversionShare = 0.35;
                spendShare = 0.35;
              } else if (platformId === googleId) {
                impressionShare = 0.40;
                clickShare = 0.40;
                conversionShare = 0.40;
                spendShare = 0.40;
              } else {
                impressionShare = 0.25;
                clickShare = 0.25;
                conversionShare = 0.25;
                spendShare = 0.25;
              }
              
              platformMetrics.push({
                campaignId: campaign.id,
                platformId,
                date,
                impressions: Math.round((6000 + Math.random() * 1000) * impressionShare),
                clicks: Math.round((300 + Math.random() * 100) * clickShare),
                conversions: Math.round((24 + Math.random() * 10) * conversionShare),
                spend: ((70 + Math.random() * 10) * spendShare).toFixed(2)
              });
            }
            
            await db
              .insert(schema.platformMetrics)
              .values(platformMetrics);
          }
        }
      }
    }
    
    // Set up default node positions and configurations
    // Get or create campaign nodes from database
    const campaigns = await db
      .select()
      .from(schema.campaigns)
      .where(eq(schema.campaigns.restaurantId, restaurantId));
      
    // Set up default nodes
    const defaultNodes = [
      // Table node
      {
        nodeId: 'customers',
        nodeType: 'table',
        position: { x: -300, y: -300 },
        configuration: {
          headingText: 'Customers',
          headingColor: '#4285F4',
          borderColor: '#000000',
          shadowColor: '#99C9FF',
          tableData: [
            { field: 'id', type: 'bigint', constraint: 'autoincrement()' },
            { field: 'name', type: 'varchar', constraint: 'not null' },
            { field: 'email', type: 'varchar', constraint: 'not null' },
            { field: 'phone', type: 'varchar', constraint: '' },
            { field: 'created_at', type: 'timestamp', constraint: 'not null' },
            { field: 'last_order', type: 'timestamp', constraint: '' }
          ],
          schema: [
            { field: 'id', type: 'bigint', constraint: 'autoincrement()' },
            { field: 'name', type: 'varchar', constraint: 'not null' },
            { field: 'email', type: 'varchar', constraint: 'not null' },
            { field: 'phone', type: 'varchar', constraint: '' },
            { field: 'created_at', type: 'timestamp', constraint: 'not null' },
            { field: 'last_order', type: 'timestamp', constraint: '' }
          ]
        }
      }
    ];
    
    // Add campaign nodes
    campaigns.forEach((campaign, index) => {
      const campaignNodeId = `campaign-${campaign.name.toLowerCase().replace(/\s+/g, '-')}`;
      
      defaultNodes.push({
        nodeId: campaignNodeId,
        nodeType: 'campaign',
        position: { x: 100, y: 100 + index * 200 },
        configuration: {
          campaignName: campaign.name,
          campaignStatus: campaign.status,
          budget: parseFloat(campaign.budget),
          impressions: 45000,
          clicks: 2250,
          conversions: 180,
          startDate: campaign.startDate.toISOString().split('T')[0],
          endDate: campaign.endDate.toISOString().split('T')[0],
          mainColor: '#FF5252',
          shadowColor: '#FF9999'
        }
      });
    });
    
    // Add platform nodes
    const platformInfo = [
      {
        name: 'Instagram',
        type: 'Social',
        icon: '📸',
        budget: 450,
        percentage: 35,
        mainColor: '#E1306C',
        shadowColor: '#F5A3C7',
        x: 500,
        y: 100
      },
      {
        name: 'Google',
        type: 'Search',
        icon: '🔍',
        budget: 350,
        percentage: 27,
        mainColor: '#4285F4',
        shadowColor: '#A4C2F4',
        x: 500,
        y: 300
      },
      {
        name: 'Facebook',
        type: 'Social',
        icon: '👥',
        budget: 300,
        percentage: 23,
        mainColor: '#1877F2',
        shadowColor: '#8BB9FE',
        x: 500,
        y: 500
      }
    ];
    
    platformInfo.forEach((platform) => {
      const platformNodeId = `platform-${platform.name.toLowerCase()}`;
      
      defaultNodes.push({
        nodeId: platformNodeId,
        nodeType: 'platform',
        position: { x: platform.x, y: platform.y },
        configuration: {
          platformName: platform.name,
          platformType: platform.type,
          platformIcon: platform.icon,
          budget: platform.budget,
          budgetPercentage: platform.percentage,
          impressions: platform.percentage * 450,
          clicks: platform.percentage * 22.5,
          conversions: platform.percentage * 1.8,
          costPerClick: 0.4,
          costPerConversion: 5.0,
          mainColor: platform.mainColor,
          shadowColor: platform.shadowColor
        }
      });
    });
    
    // Save node configurations
    for (const node of defaultNodes) {
      // Check if configuration already exists
      const existingConfig = await db
        .select()
        .from(schema.nodeConfigurations)
        .where(
          eq(schema.nodeConfigurations.nodeId, node.nodeId),
          eq(schema.nodeConfigurations.projectId, dbProjectId)
        )
        .limit(1);
        
      if (existingConfig.length === 0) {
        // Create configuration
        await db
          .insert(schema.nodeConfigurations)
          .values({
            projectId: dbProjectId,
            nodeId: node.nodeId,
            nodeType: node.nodeType,
            position: JSON.stringify(node.position),
            configuration: JSON.stringify(node.configuration),
            createdAt: new Date(),
            updatedAt: new Date()
          });
      }
    }
    
    return json({ success: true });
  } catch (error) {
    console.error('Error setting up project data:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}
