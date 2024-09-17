import { Request, Response } from "express";
import Brand from "../models/brand.model";

// Get all brands
export const getBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: "Error fetching brands" });
  }
};

// Add a new brand
export const addBrand = async (req: Request, res: Response): Promise<void> => {
  const { name, img } = req.body;
  try {
    const newBrand = new Brand({ name, img });
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(500).json({ error: "Error adding new brand" });
  }
};
