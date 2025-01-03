import { DrizzleD1Database } from "drizzle-orm/d1";
import type { Brand, Business, Product } from "types";
import { and, eq, ne, sql } from "drizzle-orm";
import * as s from "./schema";

export const getBrand = async (
  db: DrizzleD1Database<typeof s>,
  slug: string
) => {
  const brandsResult = await db.query.brands.findFirst({
    where: eq(s.brands.slug, slug),
    with: {
      productBrands: {
        with: {
          product: {
            columns: {
              id: true,
              name: true,
              description: true,
              image: true,
              slug: true,
            },
            with: {
              businessProducts: {
                with: {
                  business: {
                    columns: {
                      id: true,
                      type: true,
                      name: true,
                      shopName: true,
                      location: true,
                      address: true,
                      slug: true,
                      image: true,
                      shopImages: true,
                    },
                    with: {
                      contacts: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      businessBrands: {
        with: {
          business: {
            columns: {
              id: true,
              type: true,
              name: true,
              shopName: true,
              location: true,
              address: true,
              slug: true,
              image: true,
              shopImages: true,
            },
            with: {
              contacts: true,
            },
          },
        },
      },
    },
  });

  if (!brandsResult) throw new Error("Brand not found");

  const moreBrands = await db
    .select({
      name: s.brands.name,
      image: s.brands.image,
      slug: s.brands.slug,
    })
    .from(s.brands)
    .where(ne(s.brands.slug, slug))
    .orderBy(sql`random()`)
    .limit(10);

  const brand: Brand = {
    name: brandsResult.name,
    description: brandsResult.description,
    image: brandsResult.image,
    slug: brandsResult.slug,
    products: brandsResult.productBrands.map((productBrand) => ({
      name: productBrand.product.name,
      description: productBrand.product.description,
      image: productBrand.product.image,
      slug: productBrand.product.slug,
      dealers: productBrand.product.businessProducts
        .filter((b) => b.business.type === "dealer")
        .map((businessProduct) => ({
          type: "dealer",
          slug: businessProduct.business.slug,
          name: businessProduct.business.name,
          shopName: businessProduct.business.shopName,
          location: businessProduct.business.location,
          address: businessProduct.business.address,
          image: businessProduct.business.image,
          shopImages: businessProduct.business.shopImages?.split(",") || null,
          contact: businessProduct.business.contacts.map((contact) => ({
            type: contact.type,
            value: contact.value,
          })),
        })),
      distributors: productBrand.product.businessProducts
        .filter((b) => b.business.type === "distributor")
        .map((businessProduct) => ({
          type: "distributor",
          slug: businessProduct.business.slug,
          name: businessProduct.business.name,
          shopName: businessProduct.business.shopName,
          location: businessProduct.business.location,
          address: businessProduct.business.address,
          image: businessProduct.business.image,
          shopImages: businessProduct.business.shopImages?.split(",") || null,
          contact: businessProduct.business.contacts.map((contact) => ({
            type: contact.type,
            value: contact.value,
          })),
        })),
    })),
    dealers: brandsResult.businessBrands
      .filter((bb) => bb.business.type === "dealer")
      .map((businessBrand) => ({
        type: "dealer",
        slug: businessBrand.business.slug,
        name: businessBrand.business.name,
        shopName: businessBrand.business.shopName,
        location: businessBrand.business.location,
        address: businessBrand.business.address,
        image: businessBrand.business.image,
        shopImages: businessBrand.business.shopImages?.split(",") || null,
        contact: businessBrand.business.contacts.map((contact) => ({
          type: contact.type,
          value: contact.value,
        })),
      })),
    distributors: brandsResult.businessBrands
      .filter((bb) => bb.business.type === "distributor")
      .map((businessBrand) => ({
        type: "distributor",
        slug: businessBrand.business.slug,
        name: businessBrand.business.name,
        shopName: businessBrand.business.shopName,
        location: businessBrand.business.location,
        address: businessBrand.business.address,
        image: businessBrand.business.image,
        shopImages: businessBrand.business.shopImages?.split(",") || null,
        contact: businessBrand.business.contacts.map((contact) => ({
          type: contact.type,
          value: contact.value,
        })),
      })),
    moreBrands: moreBrands.map((brand) => ({
      image: brand.image,
      name: brand.name,
      slug: brand.slug,
    })),
  };

  return brand;
};

export const getProduct = async (
  db: DrizzleD1Database<typeof s>,
  slug: string
) => {
  const productResult = await db.query.products.findFirst({
    where: eq(s.products.slug, slug),
    with: {
      productBrands: {
        with: {
          brand: {
            columns: {
              id: true,
              name: true,
              description: true,
              image: true,
              slug: true,
            },
            with: {
              businessBrands: {
                with: {
                  business: {
                    columns: {
                      id: true,
                      type: true,
                      name: true,
                      shopName: true,
                      location: true,
                      address: true,
                      slug: true,
                      image: true,
                      shopImages: true,
                    },
                    with: {
                      contacts: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      businessProducts: {
        with: {
          business: {
            columns: {
              id: true,
              type: true,
              name: true,
              shopName: true,
              location: true,
              address: true,
              slug: true,
              image: true,
              shopImages: true,
            },
            with: {
              contacts: true,
            },
          },
        },
      },
    },
  });

  if (!productResult) throw new Error("Product not found");

  const moreProducts = await db
    .select({
      name: s.products.name,
      image: s.products.image,
      slug: s.products.slug,
    })
    .from(s.products)
    .where(ne(s.products.slug, slug))
    .orderBy(sql`random()`)
    .limit(10);

  const product: Product = {
    name: productResult.name,
    description: productResult.description,
    image: productResult.image,
    slug: productResult.slug,
    brands: productResult.productBrands.map((productBrand) => ({
      name: productBrand.brand.name,
      description: productBrand.brand.description,
      image: productBrand.brand.image,
      slug: productBrand.brand.slug,
      dealers: productBrand.brand.businessBrands
        .filter((b) => b.business.type === "dealer")
        .map((businessBrand) => ({
          type: "dealer",
          slug: businessBrand.business.slug,
          name: businessBrand.business.name,
          shopName: businessBrand.business.shopName,
          location: businessBrand.business.location,
          address: businessBrand.business.address,
          image: businessBrand.business.image,
          shopImages: businessBrand.business.shopImages?.split(",") || null,
          contact: businessBrand.business.contacts.map((contact) => ({
            type: contact.type,
            value: contact.value,
          })),
        })),
      distributors: productBrand.brand.businessBrands
        .filter((b) => b.business.type === "distributor")
        .map((businessBrand) => ({
          type: "distributor",
          slug: businessBrand.business.slug,
          name: businessBrand.business.name,
          shopName: businessBrand.business.shopName,
          location: businessBrand.business.location,
          address: businessBrand.business.address,
          image: businessBrand.business.image,
          shopImages: businessBrand.business.shopImages?.split(",") || null,
          contact: businessBrand.business.contacts.map((contact) => ({
            type: contact.type,
            value: contact.value,
          })),
        })),
    })),
    dealers: productResult.businessProducts
      .filter((bp) => bp.business.type === "dealer")
      .map((businessProduct) => ({
        type: "dealer",
        slug: businessProduct.business.slug,
        name: businessProduct.business.name,
        shopName: businessProduct.business.shopName,
        location: businessProduct.business.location,
        address: businessProduct.business.address,
        image: businessProduct.business.image,
        shopImages: businessProduct.business.shopImages?.split(",") || null,
        contact: businessProduct.business.contacts.map((contact) => ({
          type: contact.type,
          value: contact.value,
        })),
      })),
    distributors: productResult.businessProducts
      .filter((bp) => bp.business.type === "distributor")
      .map((businessProduct) => ({
        type: "distributor",
        slug: businessProduct.business.slug,
        name: businessProduct.business.name,
        shopName: businessProduct.business.shopName,
        location: businessProduct.business.location,
        address: businessProduct.business.address,
        image: businessProduct.business.image,
        shopImages: businessProduct.business.shopImages?.split(",") || null,
        contact: businessProduct.business.contacts.map((contact) => ({
          type: contact.type,
          value: contact.value,
        })),
      })),
    moreProducts: moreProducts.map((brand) => ({
      image: brand.image,
      name: brand.name,
      slug: brand.slug,
    })),
  };

  return product;
};

export const getDistributor = async (
  db: DrizzleD1Database<typeof s>,
  slug: string
) => {
  const res = await db.query.businesses.findFirst({
    where: and(
      eq(s.businesses.slug, slug),
      eq(s.businesses.type, "distributor")
    ),
    with: {
      contacts: true,
      businessProducts: {
        with: {
          product: {
            columns: {
              id: true,
              name: true,
              description: true,
              image: true,
              slug: true,
            },
            with: {
              productBrands: {
                with: {
                  brand: {
                    columns: {
                      id: true,
                      name: true,
                      description: true,
                      image: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      businessBrands: {
        with: {
          brand: {
            columns: {
              id: true,
              name: true,
              description: true,
              image: true,
              slug: true,
            },
            with: {
              productBrands: {
                with: {
                  product: {
                    columns: {
                      id: true,
                      name: true,
                      description: true,
                      image: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!res || res.type !== "distributor") {
    throw new Error("Distributor not found");
  }
  const distributor: Business<"distributor"> = {
    type: "distributor",
    name: res.name,
    shopName: res.shopName,
    location: res.location,
    address: res.address,
    slug: res.slug,
    image: res.image,
    shopImages: res.shopImages?.split(",") || null,
    contact: res.contacts.map((contact) => ({
      type: contact.type,
      value: contact.value,
    })),
    products: res.businessProducts.map((businessProduct) => ({
      name: businessProduct.product.name,
      description: businessProduct.product.description,
      image: businessProduct.product.image,
      slug: businessProduct.product.slug,
      brands: businessProduct.product.productBrands
        .filter(
          (productBrand) => productBrand.productId === businessProduct.productId
        )
        .map((productBrand) => ({
          name: productBrand.brand.name,
          description: productBrand.brand.description,
          image: productBrand.brand.image,
          slug: productBrand.brand.slug,
        })),
    })),
    brands: res.businessBrands.map((businessBrand) => ({
      name: businessBrand.brand.name,
      description: businessBrand.brand.description,
      image: businessBrand.brand.image,
      slug: businessBrand.brand.slug,
      products: businessBrand.brand.productBrands
        .filter(
          (productBrand) => productBrand.brandId === businessBrand.brandId
        )
        .map((productBrand) => ({
          name: productBrand.product.name,
          description: productBrand.product.description,
          image: productBrand.product.image,
          slug: productBrand.product.slug,
        })),
    })),
  };
  return distributor;
};

export const getDealer = async (
  db: DrizzleD1Database<typeof s>,
  slug: string
) => {
  const res = await db.query.businesses.findFirst({
    where: and(eq(s.businesses.slug, slug), eq(s.businesses.type, "dealer")),
    with: {
      contacts: true,
      businessProducts: {
        where: eq(s.businessProduct.businessId, s.businesses.id),
        with: {
          product: {
            columns: {
              id: true,
              name: true,
              description: true,
              image: true,
              slug: true,
            },
            with: {
              productBrands: {
                with: {
                  brand: {
                    columns: {
                      id: true,
                      name: true,
                      description: true,
                      image: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      businessBrands: {
        with: {
          brand: {
            columns: {
              id: true,
              name: true,
              description: true,
              image: true,
              slug: true,
            },
            with: {
              productBrands: {
                with: {
                  product: {
                    columns: {
                      id: true,
                      name: true,
                      description: true,
                      image: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!res || res.type !== "dealer") {
    throw new Error("Dealer not found");
  }
  const dealer: Business<"dealer"> = {
    type: "dealer",
    name: res.name,
    address: res.address,
    shopName: res.shopName,
    location: res.location,
    slug: res.slug,
    image: res.image,
    shopImages: res.shopImages?.split(",") || null,
    contact: res.contacts.map((contact) => ({
      type: contact.type,
      value: contact.value,
    })),
    products: res.businessProducts.map((businessProduct) => ({
      name: businessProduct.product.name,
      description: businessProduct.product.description,
      image: businessProduct.product.image,
      slug: businessProduct.product.slug,
      brands: businessProduct.product.productBrands
        .filter(
          (productBrand) => productBrand.productId === businessProduct.productId
        )
        .map((productBrand) => ({
          name: productBrand.brand.name,
          description: productBrand.brand.description,
          image: productBrand.brand.image,
          slug: productBrand.brand.slug,
        })),
    })),
    brands: res.businessBrands.map((businessBrand) => ({
      name: businessBrand.brand.name,
      description: businessBrand.brand.description,
      image: businessBrand.brand.image,
      slug: businessBrand.brand.slug,
      products: businessBrand.brand.productBrands
        .filter(
          (productBrand) => productBrand.brandId === businessBrand.brandId
        )
        .map((productBrand) => ({
          name: productBrand.product.name,
          description: productBrand.product.description,
          image: productBrand.product.image,
          slug: productBrand.product.slug,
        })),
    })),
  };
  return dealer;
};

export const getBrands = async (db: DrizzleD1Database<typeof s>) => {
  const brands = await db.query.brands.findMany({
    columns: {
      name: true,
      description: true,
      image: true,
      slug: true,
    },
  });

  return brands;
};

export const getProducts = async (db: DrizzleD1Database<typeof s>) => {
  const products = await db.query.products.findMany({
    columns: {
      name: true,
      description: true,
      image: true,
      slug: true,
    },
  });
  return products;
};
