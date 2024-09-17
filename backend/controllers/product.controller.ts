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
