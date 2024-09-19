import { Request, Response } from "express";
import Brand from "../models/brand.model";

// Get all brands
export const getBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: "Error fetching brandscwc" });
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
export const getBrandById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { objectId } = req.params;

  try {
    const brand = await Brand.findById(objectId);
    if (brand) {
      return res.status(200).json(brand);
    } else {
      return res.status(404).json({ message: "Brand not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching branddcdwc" });
  }
};

export const getBrandsByProductId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { objectId } = req.params;

  try {
    const brands = await Brand.find({
      "products._id": objectId,
    });
    return res.status(200).json(brands);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching brands" });
  }
};
