// src/lib/server/db/schema.ts
import { pgTable, serial, varchar, decimal, timestamp, boolean, integer, primaryKey } from 'drizzle-orm/pg-core';

// Projects table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 255 }),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Restaurants table
export const restaurants = pgTable('restaurants', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 100 }),
  location: varchar('location', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  projectId: integer('project_id').references(() => projects.id),
  createdAt: timestamp('created_at').defaultNow()
});

// Campaigns table
export const campaigns = pgTable('campaigns', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  budget: decimal('budget', { precision: 10, scale: 2 }).notNull(),
  spent: decimal('spent', { precision: 10, scale: 2 }).default('0'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  restaurantId: integer('restaurant_id').references(() => restaurants.id),
  projectId: integer('project_id').references(() => projects.id),
  createdAt: timestamp('created_at').defaultNow()
});

// Platforms table
export const platforms = pgTable('platforms', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// Campaign platforms join table - fixed the composite primary key
export const campaignPlatforms = pgTable('campaign_platforms', {
  campaignId: integer('campaign_id').notNull().references(() => campaigns.id),
  platformId: integer('platform_id').notNull().references(() => platforms.id),
  isPrimary: boolean('is_primary').default(false),
  budgetPercentage: integer('budget_percentage')
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.campaignId, table.platformId] })
  };
});

// Campaign metrics table
export const campaignMetrics = pgTable('campaign_metrics', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id').references(() => campaigns.id),
  date: timestamp('date').notNull(),
  impressions: integer('impressions').default(0),
  clicks: integer('clicks').default(0),
  conversions: integer('conversions').default(0),
  spend: decimal('spend', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow()
});

// Platform metrics table
export const platformMetrics = pgTable('platform_metrics', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id').references(() => campaigns.id),
  platformId: integer('platform_id').references(() => platforms.id),
  date: timestamp('date').notNull(),
  impressions: integer('impressions').default(0),
  clicks: integer('clicks').default(0),
  conversions: integer('conversions').default(0),
  spend: decimal('spend', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow()
});

// Customers table
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  city: varchar('city', { length: 100 }),
  acquisitionSource: varchar('acquisition_source', { length: 100 }),
  orderCount: integer('order_count').default(0),
  totalSpent: decimal('total_spent', { precision: 10, scale: 2 }).default('0'),
  restaurantId: integer('restaurant_id').references(() => restaurants.id),
  projectId: integer('project_id').references(() => projects.id),
  createdAt: timestamp('created_at').defaultNow(),
  lastOrderDate: timestamp('last_order_date')
});

// Customer conversions table
export const customerConversions = pgTable('customer_conversions', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  campaignId: integer('campaign_id').references(() => campaigns.id),
  platformId: integer('platform_id').references(() => platforms.id),
  conversionType: varchar('conversion_type', { length: 50 }).notNull(),
  conversionValue: decimal('conversion_value', { precision: 10, scale: 2 }).default('0'),
  conversionDate: timestamp('conversion_date').defaultNow()
});

// Node configurations by project
export const nodeConfigurations = pgTable('node_configurations', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id),
  nodeType: varchar('node_type', { length: 50 }).notNull(),
  nodeId: varchar('node_id', { length: 100 }).notNull(),
  position: varchar('position', { length: 255 }).notNull(),
  configuration: varchar('configuration', { length: 4000 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
