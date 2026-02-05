import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Task from "@/models/Task";
import User from "@/models/User";
import { verifyJWT } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    await dbConnect();

    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const categories = await Category.find()
      .populate("userId", "name email")
      .sort({
        createdAt: -1,
      });

    const categoriesWithTaskCount = await Promise.all(
      categories.map(async (category) => {
        const taskCount = await Task.countDocuments({
          userId: category.userId._id,
          category: category.name,
        });

        return {
          id: category._id.toString(),
          name: category.name,
          color: category.color,
          taskCount,
          userId: category.userId._id.toString(),
          userName: category.userId.name,
          userEmail: category.userId.email,
          createdAt: category.createdAt,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      categories: categoriesWithTaskCount,
    });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
