import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const id = (name: string) => text(name).primaryKey();

export const usersTable = pgTable("commerce_users", {
  id: id("id"),
  email: text("email").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const merchantsTable = pgTable("commerce_merchants", {
  id: id("id"),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productsTable = pgTable("commerce_products", {
  id: id("id"),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  image: text("image").notNull(),
  stock: integer("stock").notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull(),
  specifications: jsonb("specifications").notNull(),
  tags: jsonb("tags").notNull(),
  useCases: jsonb("use_cases").notNull(),
});

export const cartsTable = pgTable("commerce_carts", {
  id: id("id"),
  userId: text("user_id").notNull(),
  status: text("status").notNull().default("active"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItemsTable = pgTable("commerce_cart_items", {
  id: id("id"),
  cartId: text("cart_id").notNull(),
  productId: text("product_id").notNull(),
  quantity: integer("quantity").notNull(),
});

export const ordersTable = pgTable("commerce_orders", {
  id: id("id"),
  userId: text("user_id").notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  paymentId: text("payment_id"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItemsTable = pgTable("commerce_order_items", {
  id: id("id"),
  orderId: text("order_id").notNull(),
  productId: text("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
});

export const paymentsTable = pgTable("commerce_payments", {
  id: id("id"),
  orderId: text("order_id"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull(),
  provider: text("provider").notNull().default("razorpay_test"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversationsTable = pgTable("commerce_conversations", {
  id: id("id"),
  userId: text("user_id").notNull(),
  status: text("status").notNull().default("active"),
  context: jsonb("context").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversationMessagesTable = pgTable("commerce_conversation_messages", {
  id: id("id"),
  conversationId: text("conversation_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const opportunitiesTable = pgTable("commerce_opportunities", {
  id: id("id"),
  title: text("title").notNull(),
  explanation: text("explanation").notNull(),
  impact: numeric("impact", { precision: 12, scale: 2 }).notNull(),
  confidence: numeric("confidence", { precision: 5, scale: 2 }).notNull(),
  status: text("status").notNull(),
  action: text("action").notNull(),
});

export const approvalsTable = pgTable("commerce_approvals", {
  id: id("id"),
  title: text("title").notNull(),
  detail: text("detail").notNull(),
  type: text("type").notNull(),
  impact: numeric("impact", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const campaignsTable = pgTable("commerce_campaigns", {
  id: id("id"),
  name: text("name").notNull(),
  type: text("type").notNull(),
  products: jsonb("products").notNull(),
  discount: numeric("discount", { precision: 5, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull(),
});

export const policiesTable = pgTable("commerce_policies", {
  id: id("id"),
  merchantId: text("merchant_id").notNull(),
  maxDiscount: numeric("max_discount", { precision: 5, scale: 2 }).notNull(),
  maxAutomatedAmount: numeric("max_automated_amount", { precision: 12, scale: 2 }).notNull(),
  approvalThreshold: numeric("approval_threshold", { precision: 12, scale: 2 }).notNull(),
  allowedActions: jsonb("allowed_actions").notNull(),
  upsellEnabled: boolean("upsell_enabled").notNull(),
  crossSellEnabled: boolean("cross_sell_enabled").notNull(),
});

export const auditLogsTable = pgTable("commerce_audit_logs", {
  id: id("id"),
  event: text("event").notNull(),
  actor: text("actor").notNull(),
  status: text("status").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }),
  detail: text("detail").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});