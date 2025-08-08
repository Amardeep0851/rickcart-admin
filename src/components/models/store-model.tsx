import React from 'react';
import * as z from "zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";


import { Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";

import Model from "@/components/ui/model";
import { useModel } from "@/hooks/use-store-model";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



function StoreModel() {
  const {isOpen, onOpen, onClose} = useModel();
  const route = useRouter()
  const formSchema = z.object({
    name:z.string().min(1, {message:"Name is required."})
  })

  const form = useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      name:""
    }
  })

   const handleClose = () => {
    form.reset();
    onClose()
  }

  const onSubmit = async (values:z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/store/", values);
      
      if(response.status === 200){
        toast.success('Store has created successfully.');
        onClose
        window.location.assign(`/${response.data.id}`);
      }

    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error("[ERROR_CREATING_STORE]", error)
    }
  }
  const isLoading = form.formState.isSubmitting;

 
  return (
    <Model 
    title="Create store" 
    description="Add a new store to manage products and categories." 
    isOpen={isOpen} 
    onClose={handleClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <FormField 
          name="name"
          control={form.control}
          render={({field}) => (
            <FormItem>
              <FormLabel className="pb-1">Name</FormLabel>
              <FormControl>
                <Input 
                type="text" 
                className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0" 
                disabled={isLoading} 
                {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
          />
          <div className="mt-4 flex justify-end gap-3.5 ">
            <Button
            disabled={isLoading}
            type="button"
            variant="secondary"
            className="cursor-pointer"
            onClick={() => handleClose()}
            >
              Cancel
            </Button>
            <Button
            disabled={isLoading}
            type="submit"
            variant="default"
            className="cursor-pointer"
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </Model>
  )
}

export default StoreModel