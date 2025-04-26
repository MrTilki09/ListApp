import { sqliteTable, text, integer,  } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const tasks = sqliteTable('tasks', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description').notNull(),
    cost: integer('cost').notNull(),
    timestamp: text('timestamp')
        .notNull()
        .default(sql`(current_timestamp)`),
});

// export const lists = sqliteTable('lists', {
//     id: integer('id').primaryKey({ autoIncrement: true }),
//     name: text('name').notNull(),
// });

// Export Task to use as an interface in your app
export type Task = typeof tasks.$inferSelect;