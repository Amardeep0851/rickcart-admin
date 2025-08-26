"use client";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { ProductOption, ProductOptionValue, } from "@prisma/client";
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

interface OptionFormProps {
  data?: ProductOption & {
    values: ProductOptionValue[]; 
  };
}

function OptionForm({ data }: OptionFormProps) {
  
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toastMessage = data
    ? "Option is updated successfully"
    : "New option is created successfully";

  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    values: z.array(
      z.object({
        value: z.string().min(1, { message: "Value is required." }),
      })
    ),
  });

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: data?.name || "",
    values: data?.values.map((v) => ({ value: v.value })) ?? [{ value: "" }],
  },
});

  const { fields, append, remove } = useFieldArray< z.infer<typeof formSchema>, "values">({
    control: form.control,
    name: "values",
  });

  const FormSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      let response;

      if (data) {
        response = await axios.patch( `/api/${params.storeId}/options/${data.id}`,
          values
        );
      } else {
        response = await axios.post(`/api/${params.storeId}/options/`, values);
      }
      if (response.status === 200) {
        router.refresh();
        toast.success(toastMessage);
        router.push(`/${params.storeId}/options/`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const onDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await axios.delete(
        `/api/${params.storeId}/categories/${data?.id}`
      );
      if (response.status === 200) {
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
          description={<>Add a new option and its values for your products. For example: Name- size, values- Large, Small, Medium</>}
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
            <div className="space-y-4">
              <FormLabel>Values</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <FormField
                    name={`values.${index}.value`} 
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

export default OptionForm;
