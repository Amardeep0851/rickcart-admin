import { db } from "@/lib/db";
import { Category, Billboard } from "@prisma/client";

// DTOs for clean data contracts
export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  billboardName: string | null;
  billboardId: string | null;
  parentName: string | null;
  childrenCount: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDTO {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  billboardId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}

// Custom errors for better error handling
export class CategoryError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "CategoryError";
  }
}

export class CategoryService {
  // Get all categories with proper filtering and pagination
  static async getAll(
    storeId: string, 
    options: {
      page?: number;
      limit?: number;
      search?: string;
      parentId?: string | null;
      isActive?: boolean;
      sortBy?: 'name' | 'createdAt' | 'sortOrder';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{ categories: CategoryDTO[]; total: number; pages: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      parentId,
      isActive,
      sortBy = 'sortOrder',
      sortOrder = 'asc'
    } = options;

    try {
      // Build where clause
      const where: any = {
        storeId,
        ...(isActive !== undefined && { isActive }),
        ...(parentId !== undefined && { parentId }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        })
      };

      // Get total count for pagination
      const total = await db.category.count({ where });

      // Get categories with relations
      const categories = await db.category.findMany({
        where,
        include: {
          billboard: {
            select: { title: true }
          },
          parent: {
            select: { name: true }
          },
          children: {
            select: { id: true }
          },
          products: {
            select: { id: true },
            where: { isActive: true }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const formattedCategories: CategoryDTO[] = categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: category.isActive,
        isFeatured: category.isFeatured,
        sortOrder: category.sortOrder,
        billboardName: category.billboard?.title || null,
        billboardId: category.billboardId,
        parentName: category.parent?.name || null,
        childrenCount: category.children.length,
        productCount: category.products.length,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      }));

      return {
        categories: formattedCategories,
        total,
        pages: Math.ceil(total / limit)
      };

    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new CategoryError("Failed to fetch categories", "FETCH_ERROR");
    }
  }

  // Get single category by ID
  static async getById(storeId: string, categoryId: string): Promise<CategoryDTO | null> {
    try {
      const category = await db.category.findFirst({
        where: { id: categoryId, storeId },
        include: {
          billboard: { select: { title: true } },
          parent: { select: { name: true } },
          children: { select: { id: true } },
          products: { 
            select: { id: true },
            where: { isActive: true }
          }
        }
      });

      if (!category) return null;

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: category.isActive,
        isFeatured: category.isFeatured,
        sortOrder: category.sortOrder,
        billboardName: category.billboard?.title || null,
        billboardId: category.billboardId,
        parentName: category.parent?.name || null,
        childrenCount: category.children.length,
        productCount: category.products.length,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      };

    } catch (error) {
      console.error("Error fetching category:", error);
      throw new CategoryError("Failed to fetch category", "FETCH_ERROR");
    }
  }

  // Create new category
  static async create(storeId: string, data: CreateCategoryDTO): Promise<CategoryDTO> {
    try {
      // Check if slug is unique within the store
      const existingCategory = await db.category.findFirst({
        where: { storeId, slug: data.slug }
      });

      if (existingCategory) {
        throw new CategoryError("Category with this slug already exists", "SLUG_EXISTS");
      }

      // Validate parent exists if provided
      if (data.parentId) {
        const parentExists = await db.category.findFirst({
          where: { id: data.parentId, storeId }
        });

        if (!parentExists) {
          throw new CategoryError("Parent category not found", "PARENT_NOT_FOUND");
        }
      }

      // Create category
      const category = await db.category.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          parentId: data.parentId,
          billboardId: data.billboardId,
          isActive: data.isActive ?? true,
          isFeatured: data.isFeatured ?? false,
          sortOrder: data.sortOrder ?? 0,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          storeId,
        },
        include: {
          billboard: { select: { title: true } },
          parent: { select: { name: true } },
          children: { select: { id: true } },
          products: { select: { id: true } }
        }
      });

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: category.isActive,
        isFeatured: category.isFeatured,
        sortOrder: category.sortOrder,
        billboardName: category.billboard?.title || null,
        billboardId: category.billboardId,
        parentName: category.parent?.name || null,
        childrenCount: category.children.length,
        productCount: category.products.length,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      };

    } catch (error) {
      if (error instanceof CategoryError) throw error;
      console.error("Error creating category:", error);
      throw new CategoryError("Failed to create category", "CREATE_ERROR");
    }
  }

  // Update category
  static async update(
    storeId: string, 
    categoryId: string, 
    data: UpdateCategoryDTO
  ): Promise<CategoryDTO> {
    try {
      // Check if category exists
      const existingCategory = await db.category.findFirst({
        where: { id: categoryId, storeId }
      });

      if (!existingCategory) {
        throw new CategoryError("Category not found", "NOT_FOUND");
      }

      // Check slug uniqueness if updating slug
      if (data.slug && data.slug !== existingCategory.slug) {
        const slugExists = await db.category.findFirst({
          where: { 
            storeId, 
            slug: data.slug,
            id: { not: categoryId }
          }
        });

        if (slugExists) {
          throw new CategoryError("Category with this slug already exists", "SLUG_EXISTS");
        }
      }

      const updatedCategory = await db.category.update({
        where: { id: categoryId, storeId },
        data,
        include: {
          billboard: { select: { title: true } },
          parent: { select: { name: true } },
          children: { select: { id: true } },
          products: { select: { id: true } }
        }
      });

      return {
        id: updatedCategory.id,
        name: updatedCategory.name,
        slug: updatedCategory.slug,
        description: updatedCategory.description,
        isActive: updatedCategory.isActive,
        isFeatured: updatedCategory.isFeatured,
        sortOrder: updatedCategory.sortOrder,
        billboardName: updatedCategory.billboard?.title || null,
        billboardId: updatedCategory.billboardId,
        parentName: updatedCategory.parent?.name || null,
        childrenCount: updatedCategory.children.length,
        productCount: updatedCategory.products.length,
        createdAt: updatedCategory.createdAt.toISOString(),
        updatedAt: updatedCategory.updatedAt.toISOString(),
      };

    } catch (error) {
      if (error instanceof CategoryError) throw error;
      console.error("Error updating category:", error);
      throw new CategoryError("Failed to update category", "UPDATE_ERROR");
    }
  }

  // Delete category
  static async delete(storeId: string, categoryId: string): Promise<void> {
    try {
      // Check if category exists
      const category = await db.category.findFirst({
        where: { id: categoryId, storeId },
        include: {
          children: { select: { id: true } },
          products: { select: { id: true } }
        }
      });

      if (!category) {
        throw new CategoryError("Category not found", "NOT_FOUND");
      }

      // Check if category has children
      if (category.children.length > 0) {
        throw new CategoryError("Cannot delete category with subcategories", "HAS_CHILDREN");
      }

      // Check if category has products
      if (category.products.length > 0) {
        throw new CategoryError("Cannot delete category with products", "HAS_PRODUCTS");
      }

      await db.category.delete({
        where: { id: categoryId, storeId }
      });

    } catch (error) {
      if (error instanceof CategoryError) throw error;
      console.error("Error deleting category:", error);
      throw new CategoryError("Failed to delete category", "DELETE_ERROR");
    }
  }

  // Get category hierarchy (tree structure)
  static async getHierarchy(storeId: string): Promise<any[]> {
    try {
      const categories = await db.category.findMany({
        where: { storeId, isActive: true },
        include: {
          children: {
            include: {
              children: true // Get 2 levels deep
            }
          }
        },
        orderBy: { sortOrder: 'asc' }
      });

      // Return only root categories (no parent)
      return categories.filter(cat => !cat.parentId);

    } catch (error) {
      console.error("Error fetching category hierarchy:", error);
      throw new CategoryError("Failed to fetch category hierarchy", "HIERARCHY_ERROR");
    }
  }
}

// services/category.service.ts

import { db } from "@/config/db";
import { CategoryDTO } from "@/dtos/category";

export async function getAllCategoriesByStore(storeId: string): Promise<CategoryDTO[]> {
  const categories = await db.category.findMany({
    where: { storeId },
    include: { billboard: true },
    orderBy: { createdAt: "desc" },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    billboardLabel: c.billboard?.title ?? null, // safer
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function deleteCategory(storeId: string, categoryId: string) {
  try {
    await db.category.delete({
      where: { id: categoryId, storeId },
    });
    return { success: true };
  } catch (e: any) {
    if (e.code === "P2003") {
      throw new Error("Category is in use by other resources");
    }
    throw e;
  }
}

export async function createCategory(
  storeId: string,
  data: { name: string; billboardId: string }
) {
  return db.category.create({
    data: {
      name: data.name,
      storeId,
      billboardId: data.billboardId,
    },
  });
}