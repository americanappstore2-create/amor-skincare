import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 100 }).notNull(),
  category: mysqlEnum("category", [
    "serum",
    "cream",
    "toner",
    "mask",
    "cleanser",
    "eye_care",
    "sunscreen",
    "other",
  ]).notNull(),
  description: text("description"),
  ingredients: text("ingredients"),
  usage: text("usage"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  inStock: int("inStock").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 50 }).notNull(),
  deliveryAddress: text("deliveryAddress"),
  deliveryMethod: mysqlEnum("deliveryMethod", ["delivery", "pickup"]).default("delivery").notNull(),
  pickupLocation: varchar("pickupLocation", { length: 255 }),
  paymentMethod: mysqlEnum("paymentMethod", ["kaspi_red", "cash"]).notNull(),
  items: json("items").notNull(), // Array of { productId, name, price, quantity }
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", [
    "new",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ])
    .default("new")
    .notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export const loyaltyCustomers = mysqlTable("loyalty_customers", {
  id: int("id").autoincrement().primaryKey(),
  phone: varchar("phone", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  birthDate: timestamp("birthDate"),
  bonusBalance: int("bonusBalance").default(0).notNull(),
  discountPercent: decimal("discountPercent", { precision: 5, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LoyaltyCustomer = typeof loyaltyCustomers.$inferSelect;
export type InsertLoyaltyCustomer = typeof loyaltyCustomers.$inferInsert;

export const loyaltyTransactions = mysqlTable("loyalty_transactions", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  type: mysqlEnum("type", ["bonus_earned", "bonus_spent", "discount_applied", "manual_adjustment"]).notNull(),
  amount: int("amount").notNull(), // bonus points or discount amount
  description: text("description"),
  orderId: int("orderId"), // optional reference to order
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;
export type InsertLoyaltyTransaction = typeof loyaltyTransactions.$inferInsert;
