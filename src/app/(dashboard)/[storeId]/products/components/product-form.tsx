"use client";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import FormHeading from "@/components/ui/form-heading";
import AlertModel from "@/components/ui/alert-model";
import { ProductProps } from "@/lib/services/products/product-types";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormProps {
  data?: ProductProps;
}

function ProductForm({ data }: ProductFormProps) {
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toastMessage = data
    ? "Product is updated successfully"
    : "New product is created successfully";

  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    images: z.array(z.string()).length(1, { message: "Only one image is allowed" }),
    price: z.number().min(1, { message: "Price is required." }),
    comparePrice: z.number().optional(),
    costPrice: z.number().optional(),
    trackQuantity: z.boolean(),
    quantity: z.number().min(1, { message: "Quantity is required." }),
    lowStockAlert: z.number().optional(),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    tags: z.array(z.string()).min(1, { message: "Tags are required" }),
    categoryId: z.string().min(1, { message: "Category is required." }),
    options: z.array(z.string()).min(1, { message: "At least one option is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
    name: data?.name || "",
    images: data?.images ? data.images.map((image) => image.url) : [],          
    price: data?.price ? Number(data.price) : 0,
    comparePrice: data?.comparePrice ? Number(data.comparePrice) : 0,
    costPrice: data?.costPrice ? Number(data.costPrice) : 0,
    trackQuantity: data?.trackQuantity ?? false, 
    quantity: data?.quantity || 0,
    lowStockAlert: data?.lowStockAlert || 0,
    isActive: data?.isActive ?? true,
    isFeatured: data?.isFeatured ?? false,
    metaTitle: data?.metaTitle || "",
    metaDescription: data?.metaDescription || "",
    tags: data?.tags || [],                  
    categoryId: data?.categoryId || "",
    options: data?.productOptions.map((option) => option.id) || [],
    }
  });

  const { fields, append, remove } = useFieldArray< z.infer<typeof formSchema>,"options" >({
    control: form.control,
    name: "options",
  });

  const FormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let response;

      if (data) {
        response = await axios.patch(
          `/api/${params.storeId}/products/${data.id}`,
          values
        );
      } else {
        response = await axios.post(`/api/${params.storeId}/products/`, values);
      }
      if (response.status === 200) {
        router.refresh();
        toast.success(toastMessage);
        router.push(`/${params.storeId}/products/`);
      }
    } catch (err: any) {
      const message =
        err.response?.data || "Something went wrong. Please try again.";
      toast.error(message);
    }
  };

  const onDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await axios.delete(
        `/api/${params.storeId}/products/${data?.id}`
      );

      if (response.status === 200) {
        router.refresh();
        toast.success("Category deleted successfully.");
        router.push(`/${params.storeId}/products/`);
      }
    } catch (error: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("[FRONTEND_ERROR_DELETING_OPTIONS]", error);
      }
      const message =
        error.response.data || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <>
      <AlertModel
        title={`Confirm Deletion of "${data?.name}"`}
        description={`Are you sure you want to permanently delete ${data?.name}? Once deleted, this information cannot be recovered. Please confirm your decision before proceeding.`}
        onClose={() => setIsOpen(!isOpen)}
        onComfirm={onDelete}
        isOpen={isOpen}
        disabled={isDeleting}
      />
      <div>
        <FormHeading
          title="Create New Category"
          description={
            <>
              Add a new product, upload image and other data for your products.
            </>
          }
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(FormSubmit)}
            className="px-4 pt-6 pb-6 w-full space-y-6"
          >
            <FormField
              name="images"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? field.value : []}
                      onChange={(url) => field.onChange(url)}
                      disabled={isLoading}
                      multiple={true}
                      maxfile={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Category title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Category title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="comparePrice"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Category title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="costPrice"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Category title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lowStockAlert"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Category title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="quantity"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Category title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="metaTitle"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Category title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="metaDescription"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Category title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="tags"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Category title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Category title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="options"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Category title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="trackQuantity"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                    <Checkbox
                       checked={field.value ?? true}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                        disabled={isLoading}
                        className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                     <Checkbox
                       checked={field.value ?? true}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                        disabled={isLoading}
                        className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="isFeatured"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Name </FormLabel>
                  <FormControl>
                     <Checkbox
                       checked={field.value ?? true}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                        disabled={isLoading}
                        className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Values</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <input
                    type="hidden"
                    {...form.register(`options.${index}.id`)}
                  />
                  <FormField
                    name={`options.${index}.value`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            placeholder={`Value ${index + 1}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={isLoading || fields.length === 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={() => append({ value: "" })}
                disabled={isLoading}
              >
                + Add Value
              </Button>
            </div>

            <div className="flex justify-end space-x-4 mt-5">
              {!!data && (
                <Button
                  type="button"
                  variant="destructive"
                  className="cursor-pointer"
                  disabled={isLoading}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Trash />
                </Button>
              )}

              <Button
                type="submit"
                variant="default"
                className="cursor-pointer"
                disabled={isLoading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

export default ProductForm;
