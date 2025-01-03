import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image").notNull(),
  slug: text("slug").notNull().unique(),
});

export const brands = sqliteTable("brands", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image").notNull(),
  slug: text("slug").notNull().unique(),
});

export const businesses = sqliteTable("businesses", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  type: text("type", {
    enum: ["dealer", "distributor"],
  }).notNull(),
  name: text("name").notNull(),
  shopName: text("shop_name").notNull(),
  location: text("location"),
  address: text("address"),
  slug: text("slug").notNull().unique(),
  image: text("image"),
  shopImages: text("shop_images"),
});

// Contacts Table
export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  businessId: integer("business_id")
    .notNull()
    .references(() => businesses.id),
  type: text("type", {
    enum: ["phone", "email", "whatsapp", "facebook", "instagram"],
  }).notNull(), // "phone" | "email" | "whatsapp" | "facebook" | "instagram"
  value: text("value").notNull(),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // Store hashed passwords
  role: text("role", {
    enum: ["user", "admin", "dealer", "distributor"],
  }).notNull(), // Role: 'user', 'admin', 'dealer', or 'distributor'
});

export const productBrand = sqliteTable(
  "product_brand",
  {
    id: integer("id").primaryKey({
      autoIncrement: true,
    }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    brandId: integer("brand_id")
      .notNull()
      .references(() => brands.id),
  },
  (table) => ({
    productBrandUnique: uniqueIndex("product_brand_unique").on(
      table.productId,
      table.brandId
    ),
  })
);

export const businessProduct = sqliteTable(
  "business_product",
  {
    id: integer("id").primaryKey({
      autoIncrement: true,
    }),
    businessId: integer("business_id")
      .notNull()
      .references(() => businesses.id),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
  },
  (table) => ({
    businessProductUnique: uniqueIndex("business_product_unique").on(
      table.businessId,
      table.productId
    ),
  })
);

export const businessBrand = sqliteTable(
  "business_brand",
  {
    id: integer("id").primaryKey({
      autoIncrement: true,
    }),
    businessId: integer("business_id")
      .notNull()
      .references(() => businesses.id),
    brandId: integer("brand_id")
      .notNull()
      .references(() => brands.id),
  },
  (table) => ({
    businessBrandUnique: uniqueIndex("business_brand_unique").on(
      table.businessId,
      table.brandId
    ),
  })
);

export const productsRelations = relations(products, ({ many }) => ({
  productBrands: many(productBrand),
  businessProducts: many(businessProduct),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  productBrands: many(productBrand),
  businessBrands: many(businessBrand),
}));

export const businessesRelations = relations(businesses, ({ many }) => ({
  contacts: many(contacts),
  businessProducts: many(businessProduct),
  businessBrands: many(businessBrand),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  business: one(businesses, {
    fields: [contacts.businessId],
    references: [businesses.id],
  }),
}));

export const productBrandRelations = relations(productBrand, ({ one }) => ({
  product: one(products, {
    fields: [productBrand.productId],
    references: [products.id],
  }),
  brand: one(brands, {
    fields: [productBrand.brandId],
    references: [brands.id],
  }),
}));

export const businessProductRelations = relations(
  businessProduct,
  ({ one }) => ({
    business: one(businesses, {
      fields: [businessProduct.businessId],
      references: [businesses.id],
    }),
    product: one(products, {
      fields: [businessProduct.productId],
      references: [products.id],
    }),
  })
);

export const businessBrandRelations = relations(businessBrand, ({ one }) => ({
  business: one(businesses, {
    fields: [businessBrand.businessId],
    references: [businesses.id],
  }),
  brand: one(brands, {
    fields: [businessBrand.brandId],
    references: [brands.id],
  }),
}));
