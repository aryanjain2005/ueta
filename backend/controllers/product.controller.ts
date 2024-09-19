import { Request, Response } from "express";

// Example product model import
import ProductModel from "../models/product.model";

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, img } = req.body;

    if (!name || !img) {
      return res
        .status(400)
        .json({ message: "Name and image URL are required" });
    }

    // Add new product to the database
    const newProduct = await ProductModel.create({ name, img });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { objectId } = req.params;
  try {
    const product = await ProductModel.findById(objectId);
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching productdvae" });
  }
};

export const getProductsByIds = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const ids = req.query.ids ? (req.query.ids as string).split(",") : [];
  try {
    const products = await ProductModel.find({
      _id: { $in: ids },
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching productssdadc" });
  }
};
