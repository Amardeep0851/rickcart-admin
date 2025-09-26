"use client";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormProductProps } from "@/lib/services/products/product-types";
import { formSchema } from "@/lib/services/products/product-schema";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


import FormHeading from "@/components/ui/form-heading";
import AlertModel from "@/components/ui/alert-model";
import ImageUpload, { ImageType } from "@/components/ui/image-upload";
import CurrentyInput from "@/components/ui/currency-input";
import Tiptap from "@/components/text-editor/tiptap";
import SearchableSelect from "@/components/ui/searchable-select";
import TagsInput from "@/components/ui/tag-input";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductFormProps {
  data?: FormProductProps;
  options: {
    label: string;
    value: string;
  }[];
  categories: {
    label: string;
    value: string;
  }[];
}

function ProductForm({ data, options, categories }: ProductFormProps) {
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toastMessage = data
    ? "Product is updated successfully"
    : "New product is created successfully";

  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
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
      categoryId: data?.category.id || "",
      options: data?.options.map((option) => ({ value: option.id, label: option.name, })) || [],
    },
  });

  const FormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {

      let response;
      if (data) {
        response = await axios.patch( `/api/${params.storeId}/products/${data.id}`, values );
      } 
      else {
        response = await axios.post(`/api/${params.storeId}/products/`, values);
      }
      if (response.status === 200) {
        router.refresh();
        toast.success(toastMessage);
        router.push(`/${params.storeId}/products/`);
      }
    } catch (err: any) {
      console.log(err);
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
        toast.success("Product deleted successfully.");
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
          title="Create New Product"
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
                      imageType={ImageType.PRODUCT}
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
                      placeholder="Enter product title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2 "> Descriptions </FormLabel>
                  <FormControl>
                    <Tiptap
                      description={field.value}
                      onChange={field.onChange}
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
                  <FormLabel className="pb-2"> Price </FormLabel>
                  <FormControl>
                    <CurrentyInput
                      value={
                        field.value !== undefined ? field.value.toString() : ""
                      }
                      onChange={(value) => {
                        const numericvalue = value
                          ? parseFloat(value)
                          : undefined;
                        field.onChange(numericvalue);
                      }}
                      disabled={isLoading}
                      name="price"
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
                  <FormLabel className="pb-2"> Price for discount </FormLabel>
                  <FormControl>
                    <CurrentyInput
                      value={
                        field.value !== undefined ? field.value.toString() : ""
                      }
                      onChange={(value) => {
                        const numericvalue = value
                          ? parseFloat(value)
                          : undefined;
                        field.onChange(numericvalue);
                      }}
                      disabled={isLoading}
                      name="comparePrice"
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
                  <FormLabel className="pb-2"> Cost price </FormLabel>
                  <FormControl>
                    <CurrentyInput
                      value={
                        field.value !== undefined ? field.value.toString() : ""
                      }
                      onChange={(value) => {
                        const numericvalue = value
                          ? parseFloat(value)
                          : undefined;
                        field.onChange(numericvalue);
                      }}
                      disabled={isLoading}
                      name="costPrice"
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
                  <FormLabel className="pb-2"> Stock </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(value) =>
                        field.onChange(Number(value.target.value))
                      }
                      value={field.value}
                      disabled={isLoading}
                      placeholder="Enter quantity in stock."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
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
                  <FormLabel className="pb-2"> Alert stock value </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(value) =>
                        field.onChange(Number(value.target.value))
                      }
                      value={field.value}
                      disabled={isLoading}
                      placeholder="Enter number, when low stock start showing alert."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
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
                  <FormLabel className="pb-2"> Category name </FormLabel>
                  
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          (categories || []).map((category, index) => (
                            <SelectItem key={index} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="options"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2">Options</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={options}
                      disabled={isLoading}
                      onChange={(val) => field.onChange(val)}
                      value={field.value || []}
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
                  <FormLabel className="pb-2"> Meta Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Meta title."
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
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="pb-2"> Meta tags (Example - Product, Shirt, Shoes) </FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field.value || []}
                        onChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              name="metaDescription"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Meta dscription </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
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
                  <FormLabel className="pb-2"> Stock Alert </FormLabel>
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
                  <FormLabel className="pb-2"> Is Active </FormLabel>
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
                  <FormLabel className="pb-2"> Is Featured </FormLabel>
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
