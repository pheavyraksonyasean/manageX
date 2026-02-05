import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Task from "@/models/Task";
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

    const categories = await Category.find({ userId: decoded.userId }).sort({
      createdAt: -1,
    });

    const categoriesWithTaskCount = await Promise.all(
      categories.map(async (category) => {
        const taskCount = await Task.countDocuments({
          userId: decoded.userId,
          category: category.name,
        });

        return {
          id: category._id.toString(),
          name: category.name,
          color: category.color,
          taskCount,
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

export async function POST(req: NextRequest) {
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

    const { name, color } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 },
      );
    }

    if (!color) {
      return NextResponse.json(
        { success: false, message: "Color is required" },
        { status: 400 },
      );
    }

    await dbConnect();
    const existingCategory = await Category.findOne({
      userId: decoded.userId,
      name: name.trim(),
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Category already exists" },
        { status: 400 },
      );
    }
    const category = await Category.create({
      userId: decoded.userId,
      name: name.trim(),
      color,
    });

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      category: {
        id: category._id.toString(),
        name: category.name,
        color: category.color,
        taskCount: 0,
        createdAt: category.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 },
    );
  }
}
