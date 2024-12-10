import { Request, Response } from "express";
import User from "../models/user.model";
import Brand from "../models/brand.model";
import Product from "../models/product.model";
import bcrypt from "bcrypt";

export const signupController = async (req: Request, res: Response) => {
  console.log("Signup request received");
  const { name, email, password, img, role, type } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!name || !email || !password || !img || !role || !type) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      img,
      role,
      type,
    });
    console.log("New user created:", newUser);
    await newUser.save();
    console.log("User saved to database");
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

export const loginController = async (req: Request, res: Response) => {
  console.log("Login request received");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.status(200).json({
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      img: user.img,
      type: user.type,
    });
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
  const dataType = req.query.dataType as string; // "brand", "product", or "brandprod"
  console.log(req.params);
  console.log(req.query);

  try {
    let query = {};

    // Construct query based on the dataType
    if (dataType === "brand") {
      const { objectId } = req.query; // Extract objectId for brand query
      if (!objectId) {
        return res.status(400).json({
          message: "Missing objectId for brand query",
        });
      }
      query = { "brand_prod.brand": objectId };
    } else if (dataType === "product") {
      const { objectId } = req.query; // Extract objectId for product query
      if (!objectId) {
        return res.status(400).json({
          message: "Missing objectId for product query",
        });
      }
      query = { "brand_prod.product": objectId };
    } else if (dataType === "brandprod") {
      const { brandId, productId } = req.query; // Extract both brandId and productId for brandprod query
      if (!brandId || !productId) {
        return res.status(400).json({
          message: "Missing brandId or productId for brandprod query",
        });
      }
      query = {
        "brand_prod.brand": brandId,
        "brand_prod.product": productId,
      };
    } else {
      return res.status(400).json({
        message: "Invalid dataType. Use 'brand', 'product', or 'brandprod'",
      });
    }

    // Fetch users based on the constructed query
    const users = await User.find(query);

    // if (!users || users.length === 0) {
    //   console.log("Koi nhi mila");
    //   return res
    //     .status(404)
    //     .json({ message: "No users found for the given criteria" });
    // }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
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
export const getDistributors = async (req: Request, res: Response) => {
  try {
    const distributors = await User.find({ role: "distributor" }); // Find users with role "distributor"
    res.status(200).json(distributors);
  } catch (error) {
    console.error("Error fetching distributors:", error);
    res.status(500).json({ message: "Failed to load distributors" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { objectId } = req.params;
  try {
    // Fetch user by id
    const user = await User.findById(objectId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch brands and products based on the user's brand_prod array
    const brandProductDetails = await Promise.all(
      user.brand_prod.map(async (bp) => {
        const brand = await Brand.findById(bp.brand);
        const product = await Product.findById(bp.product);
        return { brand, product };
      })
    );

    return res.status(200).json({ user, brandProductDetails });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
