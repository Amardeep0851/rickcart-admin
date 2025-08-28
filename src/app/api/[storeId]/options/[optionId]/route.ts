import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { getStoreByUserId } from "@/lib/services/store/store-services";
import {
  deleteOptionWithId,
  fetchOptionWithIdAndName,
  fetchOptionWithName,
  updateOptionsWithValues,
} from "@/lib/services/options/options-services";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; optionId: string }> }
) {
  try {
    const { storeId, optionId } = await params;
    const { userId } = await auth();
    const { name, values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("StoreId is required.", { status: 400 });
    }

    if (!optionId) {
      return new NextResponse("optionId is required.", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required.", { status: 400 });
    }

    if (values.length === 0) {
      return new NextResponse("At least one value is required.", {
        status: 400,
      });
    }

    const store = await getStoreByUserId(storeId, userId);
    const isOptionExist = await fetchOptionWithName(storeId, name);
    const fetchExistingOption = await fetchOptionWithIdAndName(optionId);
    
    if (!store) {
      return new NextResponse("Store does not found.", { status: 404 });
    }

    if ((fetchExistingOption?.name !== name) && isOptionExist?.name ) {
      return new NextResponse("Name is already exist.", { status: 400 });
    }

    const createdOptions = await updateOptionsWithValues(storeId, optionId, name, values);

    return NextResponse.json({createdOptions}, {status:200});
  } catch (error) {
    console.error("[UPADING_OPTIONS_ERROR]", error);
    return new NextResponse("Internal Server Error",{status:500});
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; optionId: string }> }
) {
  try {
    const { storeId, optionId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("StoreId is required.", { status: 400 });
    }

    if (!optionId) {
      return new NextResponse("optionId is required.", { status: 400 });
    }

    const store = await getStoreByUserId(storeId, userId);
    const fetchExistingOption = await fetchOptionWithIdAndName(optionId);
    
    if (!store) {
      return new NextResponse("Store does not found.", { status: 404 });
    }

    if (!fetchExistingOption?.name) {
      return new NextResponse("Name does not exist.", { status: 400 });
    }

    const deletedOptions = await deleteOptionWithId(storeId, optionId);

    return NextResponse.json({deletedOptions}, {status:200});
  } catch (error) {
    console.error("[DELETING_OPTIONS_ERROR]", error);
    
    return new NextResponse("Internal Server Error",{status:500});
  }
}