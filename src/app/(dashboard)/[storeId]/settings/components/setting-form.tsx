"use client";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import { Store } from "@prisma/client";
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
import { Input } from "@/components/ui/input";
import FormHeading from "@/components/ui/form-heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import AlertModel from "@/components/ui/alert-model";

interface settingFormProps {
  data: Store;
}

function SettingForm({ data }: settingFormProps) {
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty." }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    form.setValue("name", data.name);
  }, [data.name, form]);

  const FormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/store/${params.storeId}`,
        values
      );
      router.refresh();
      toast.success("Store information is updated successfully.");
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
        title={`Confirm Deletion of ${data.name}`}
        description={`Are you sure you want to permanently delete ${data.name}? Once deleted, this information cannot be recovered. Please confirm your decision before proceeding.`}
        onClose={() => setIsOpen(!isOpen)}
        onComfirm={onDelete}
        isOpen={isOpen}
        disabled={isDeleting}
      />
      <div>
        <FormHeading
          title="Store settings"
          description="Use this page to update your store's name or delete the store permanently. Changing the store name will reflect across your dashboard and customer-facing interfaces. Deleting the store will remove all associated data and cannot be undone."
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
                      placeholder="Enter store name..."
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

export default SettingForm;
