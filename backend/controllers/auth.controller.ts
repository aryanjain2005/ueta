import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";

export const signupController = async (req: Request, res: Response) => {
  const { name, email, password, img, role, type } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      img,
      role,
      type,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    // Type assertion or guard to handle the error correctly
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

export const getUsersByBrandProd = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { objectId } = req.params;
  const dataType = req.query.dataType; // Get the data type from the query

  try {
    const users = await User.find({
      [`brand_prod.${dataType}`]: objectId,
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users" });
  }
};

export const getDealers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const dealers = await User.find({ role: "dealer" }); // Find users with role "dealer"
    return res.status(200).json(dealers);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching dealers" });
  }
};

export const addDealer = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, email, password, img } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDealer = new User({
      name,
      email,
      password: hashedPassword,
      img,
      role: "dealer", // Set role as dealer
      type: "standard", // Set type or modify as needed
    });

    await newDealer.save();
    return res
      .status(201)
      .json({ message: "Dealer created successfully", user: newDealer });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};
