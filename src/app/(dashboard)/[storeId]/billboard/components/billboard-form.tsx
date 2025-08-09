"use client";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import { Billboard } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter, useParams, redirect } from "next/navigation";
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
import FormHeading from "@/components/ui/form-heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import AlertModel from "@/components/ui/alert-model";
import { Checkbox } from "@/components/ui/checkbox";

interface BillboardFormProps {
  data?: Billboard;
}

function BillboardForm({ data }: BillboardFormProps) {
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toastMessage = data ? "Billboard information is updated successfully" : "New billboard is created successfully";

  const formSchema = z.object({
    title: z.string().min(1, { message: "Title cannot be empty." }),
    imageUrl: z.string().min(1, { message: "Image cannot be empty." }),
    link: z.string().nullable(),
    buttonText: z.string().nullish(),
    status:z.boolean().nullish()

  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title || "",
      imageUrl: data?.imageUrl || "",
      link: data?.link || "",
      buttonText: data?.buttonText || "Shop Now",
      status: data?.status ?? false
    },
  });

  

  const FormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/billboard/${params.storeId}`,
        values
      );
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(`/api/store/${params.storeId}`);

      if (response.status === 200) {
        router.refresh();
        router.push("/");
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
        title={`Confirm Deletion of ${data?.title}`}
        description={`Are you sure you want to permanently delete ${data?.title}? Once deleted, this information cannot be recovered. Please confirm your decision before proceeding.`}
        onClose={() => setIsOpen(!isOpen)}
        onComfirm={onDelete}
        isOpen={isOpen}
        disabled={isDeleting}
      />
      <div>
        <FormHeading
          title="Create New Billboard"
          description={<>
          Add a new billboard to your store. Billboards are used to promote key products, sales, or announcements on your homepage or category pages. Recommended image dimensions: <b>1200x400</b> pixels.
          </>}
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(FormSubmit)}
            className="px-4 pt-6 pb-6 w-full space-y-6"
          >
            <FormField
              name="imageUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> upload Image </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Billboard title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Title </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Billboard title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="buttonText"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Button Text </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Billboard title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="link"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2"> Link </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Billboard title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
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
                  <FormLabel className="pb-2"> Title </FormLabel>
                  <FormControl>
                    <Checkbox
                      disabled={isLoading}
                      placeholder="Enter Billboard title..."
                      className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4 mt-5">
              <Button
                type="button"
                variant="destructive"
                className="cursor-pointer"
                disabled={isLoading}
                onClick={() => setIsOpen(!isOpen)}
              >
                <Trash />
              </Button>

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

export default BillboardForm;
