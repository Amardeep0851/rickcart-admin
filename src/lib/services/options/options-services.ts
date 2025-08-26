import { db } from "@/lib/db";

export async function fetchAllOptionsWithValue(
  storeId: string,
  userId: string
) {
  const options = await db.productOption.findMany({
    where: {
      store: {
        id: storeId,
        userId,
      },
    },
    include: {
      values: true,
    },
  });
  const formattedData = options?.map((option) => ({
    id:option.id,
    name:option.name,
    values:option.values.map((value) => value.value)

  }))

  return formattedData
}

export async function createOptionsWithValues(
  storeId: string,
  name: string,
  values: { value: string }[]
) {
  const result = await db.productOption.create({
    data: {
      name,
      storeId,
      values: {
        create: values,
      },
    },
    include: {
      values: true,
    },
  });

  return result
}

export async function updateOptionsWithValues(
  storeId: string,
  optionId:string,
  name: string,
  values: { value: string }[]
) {
  return db.productOption.update({
    where:{
      storeId, 
      id:optionId
    },
    data:{
      name,
      values:{ 
        updateMany:values
      }
    }
  })
}

export async function fetchOptionWithName(storeId:string, name:string){
  const option = await db.productOption.findFirst({
    where:{
      name,
    storeId,
    }
  });
  return option
}

export async function fetchOptionWithId(storeId:string, id:string){
  const option = await db.productOption.findFirst({
    where:{
      id,
    storeId,
    },
    include:{
      values:true
    }
  });
  return option
}

export const bulkDeleteOptions = (storeId:string, ids:string[]) => {
  return db.productOption.deleteMany({
    where:{
      storeId,
      id:{
        in:ids
      }
    }
  })
}