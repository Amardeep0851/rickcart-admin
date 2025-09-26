import z from "zod";

export const formSchema = z.object({
  images: z
    .array(z.string())
    .min(1, {message:"At least upload 1 image."})
    .max(5, {message:"Maximum 5 images can be uploaded."}),
    name: z.string().min(1, { message: "Name is required." }),
    description: z.string().min(1, { message: "Description is required." }),
    price: z.number().min(1, { message: "Price is required." }),
    comparePrice: z.number().optional(),
    costPrice: z.number().optional(),
    trackQuantity: z.boolean(),
    quantity: z.number().min(1, { message: "Quantity is required." }),
    lowStockAlert: z.number().optional(),
    categoryId: z.string().min(1, { message: "Category is required." }),
    options: z.array(z.object({ value: z.string(), label: z.string(), })).min(1, { message: "At least one option is required" }),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    tags: z.array(z.string()).min(1, { message: "Tags are required" }),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
  });