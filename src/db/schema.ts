import { pgTable, serial, text, integer, decimal, timestamp, varchar } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    price: decimal('price', { precision: 18, scale: 6 }).notNull(), // USDC has 6 decimals
    stock: integer('stock').notNull().default(1),
    imageUrl: text('image_url'),
    sellerAddress: varchar('seller_address', { length: 42 }).notNull(), // Ethereum address
    sellerName: varchar('seller_name', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const comments = pgTable('comments', {
    id: serial('id').primaryKey(),
    productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    authorAddress: varchar('author_address', { length: 42 }).notNull(), // Ethereum address
    authorName: varchar('author_name', { length: 100 }),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
