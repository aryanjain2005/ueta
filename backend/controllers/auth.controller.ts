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
