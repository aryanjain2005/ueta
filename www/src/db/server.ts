// import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
// import {
//   brands,
//   products,
//   businesses,
//   businessBrand,
//   businessProduct,
//   productBrand,
//   contacts,
// } from "./schema";
// import * as schema from "./schema";
// import { aliasedTable, and, eq, inArray, ne, sql } from "drizzle-orm";

// //  export type Business<T extends "dealer" | "distributor"> = {
// //   type: T;
// //   name: string;
// //   shopName: string;
// //   location: string;
// //   address: string;
// //   slug: string;
// //   images: string;
// //   shopImages: string[];
// //   contact: {
// //     type: "phone" | "email" | "whatsapp" | "facebook" | "instagram";
// //     value: string;
// //   }[];
// //   products?: (Omit<
// //     Product,
// //     "moreProducts" | "dealers" | "distributors" | "brands"
// //   > & {
// //     brands: Omit<
// //       Brand,
// //       "products" | "dealers" | "distributors" | "moreBrands"
// //     >[];
// //   })[];
// //   brands: (Omit<
// //     Brand,
// //     "moreBrands" | "dealers" | "distributors" | "products"
// //   > & {
// //     products: Omit<
// //       Product,
// //       "brands" | "dealers" | "distributors" | "moreProducts"
// //     >[];
// //   })[];
// // };
// // make joins

// export const getBrand = async (
//   db: DrizzleD1Database<typeof schema>,
//   slug: string
// ) => {
//   const productWithBrands = await db
//     .select({
//       productId: products.id,
//       productName: products.name,
//       productDescription: products.description,
//       productImage: products.image,
//       productSlug: products.slug,
//       brandId: brands.id,
//       brandName: brands.name,
//       brandDescription: brands.description,
//       brandImage: brands.image,
//       brandSlug: brands.slug,
//     })
//     .from(products)
//     .innerJoin(productBrand, eq(products.id, productBrand.productId))
//     .leftJoin(brands, eq(productBrand.brandId, brands.id))
//     .where(eq(products.slug, productSlug));
//   const businessData = await db
//     .select({
//       brandId: businessBrand.brandId,
//       businessId: businesses.id,
//       businessType: businesses.type,
//       businessName: businesses.name,
//       businessShopName: businesses.shopName,
//       businessLocation: businesses.location,
//       businessAddress: businesses.address,
//       businessSlug: businesses.slug,
//       businessImage: businesses.image,
//       businessShopImages: businesses.shopImages,
//       contactType: contacts.type,
//       contactValue: contacts.value,
//     })
//     .from(businessBrand)
//     .leftJoin(businesses, eq(businessBrand.businessId, businesses.id))
//     .leftJoin(contacts, eq(businesses.id, contacts.businessId))
//     .where(
//       inArray(
//         businessBrand.brandId,
//         productWithBrands.map((row) => row.brandId)
//       )
//     );
//   const brandData = await db
//     .select({
//       selectedBrand: brands,
//       moreBrands: db
//         .select()
//         .from(brands)
//         .where(ne(brands.slug, slug))
//         .orderBy(sql`RANDOM()`)
//         .limit(10),
//     })
//     .from(brands)
//     .innerJoin(productBrand, eq(productBrand.brandId, brands.id))
//     .innerJoin(products, eq(products.id, productBrand.productId))
//     .leftJoin(businessBrand, eq(businessBrand.brandId, brands.id))
//     .leftJoin(businesses, eq(businesses.id, businessBrand.businessId))
//     .leftJoin(businessProduct, eq(businessProduct.businessId, businesses.id))
//     .leftJoin(products, eq(products.id, businessProduct.productId))
//     .where(eq(brands.slug, slug))
//     // selecct 1 row
//     .get();

//   if (!brandData) {
//     throw new Error("Brand not found");
//   }

//   return {
//     ...brandData.selectedBrand,
//     moreBrands: brandData.moreBrands,
//   };
// };

// export const getProduct = async (
//   db: DrizzleD1Database<typeof schema>,
//   slug: string
// ) => {
//   return await db.select().from(products).where(eq(products.slug, slug)).get();
// };

// export const getDistributor = async (
//   db: DrizzleD1Database<typeof schema>,
//   slug: string
// ) => {
//   return db.query.businesses.findFirst({
//     where: and(eq(businesses.slug, slug), eq(businesses.type, "distributor")),
//     with: {
//       contacts: true,
//       businessProducts: {
//         with: {
//           product: {
//             columns: {
//               id: true,
//               name: true,
//               description: true,
//               image: true,
//               slug: true,
//             },
//           },
//         },
//       },
//       businessBrands: {
//         with: {
//           brand: {
//             columns: {
//               id: true,
//               name: true,
//               description: true,
//               image: true,
//               slug: true,
//             },
//           },
//         },
//       },
//     },
//   });
// };
