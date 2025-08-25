"use client";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Billboard, Category } from "@prisma/client";
import { useForm } from "react-hook-form";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import FormHeading from "@/components/ui/form-heading";
import AlertModel from "@/components/ui/alert-model";
import { Checkbox } from "@/components/ui/checkbox";

interface CategoryFormProps {
  data?: Category;
}

function CategoryForm({ data }: CategoryFormProps) {
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [billboards, setBillboards] = useState< Billboard[] >([]);
  const [loading, setLoading] = useState(false);

  const toastMessage = data
    ? "Category information is updated successfully"
    : "New category is created successfully";

  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    billboardId: z.string().min(1, { message: "Billboard is required." }),
    status:z.boolean()
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || "",
      billboardId: data?.billboardId ?? "",
      status: data?.status ?? true,
    },
  });

  const FormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let response;

      if (data) {
        response = await axios.patch(
          `/api/${params.storeId}/categories/${data.id}`,
          values
        );
      } else {
        response = await axios.post(
          `/api/${params.storeId}/categories/`,
          values
        );
      }
      if (response.data.statusCode === 200) {
        router.refresh();
        toast.success(toastMessage);
        router.push(`/${params.storeId}/categories/`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/${params.storeId}/billboard`);
        setBillboards(response.data.data);
      } catch (error) {
        console.error("[FRONTEND_FETCHING_BILLBOARDS]", error);
      }finally{
        setLoading(false)
      }
    };
    getCategories();
  }, [params.storeId]);

    const onDelete = async () => {

    try {
      setIsDeleting(true);

      const response = await axios.delete(
        `/api/${params.storeId}/categories/${data?.id}`
      );
      if (response.data.statusCode === 200) {
        router.refresh();
        toast.success("Category deleted successfully.");
        router.push(`/${params.storeId}/categories/`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
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
              Add a new category to your store.
            </>
          }
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(FormSubmit)}
            className="px-4 pt-6 pb-6 w-full space-y-6"
          >
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
                name="billboardId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pb-2"> Select Billboard</FormLabel>
                    <FormControl>
                      <Select 
                        disabled={loading} 
                        onValueChange={field.onChange}  
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger  className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0 w-full">
                          <SelectValue placeholder="Choose a billboard" />
                        </SelectTrigger>
                        <SelectContent>
                          {
                            billboards?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.title}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pb-2"> Status </FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                        disabled={isLoading}
                        className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0 borde-4"
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

export default CategoryForm;
