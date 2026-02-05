import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Task from "@/models/Task";
import { verifyJWT } from "@/lib/jwt";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    const category = await Category.findOne({
      _id: id,
      userId: decoded.userId,
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;
    const { name, color } = await req.json();

    await dbConnect();

    const category = await Category.findOne({
      _id: id,
      userId: decoded.userId,
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    if (name && name.trim()) {
      const existingCategory = await Category.findOne({
        userId: decoded.userId,
        name: name.trim(),
        _id: { $ne: id },
      });

      if (existingCategory) {
        return NextResponse.json(
          { success: false, message: "Category name already exists" },
          { status: 400 },
        );
      }

      category.name = name.trim();
    }

    if (color) {
      category.color = color;
    }

    await category.save();

    const taskCount = await Task.countDocuments({
      userId: decoded.userId,
      category: category.name,
    });

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      category: {
        id: category._id.toString(),
        name: category.name,
        color: category.color,
        taskCount,
      },
    });
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category" },
      { status: 500 },
    );
  }
}
