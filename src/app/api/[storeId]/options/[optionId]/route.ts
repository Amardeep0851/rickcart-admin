import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { getStoreByUserId } from "@/lib/services/store/store-services";
import {
  fetchOptionWithName,
  updateOptionsWithValues,
} from "@/lib/services/options/options-services";

export async function POST(
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

    if (!store) {
      return new NextResponse("Store does not found.", { status: 404 });
    }

    if (isOptionExist) {
      return new NextResponse("Name is already exist.", { status: 400 });
    }

    const createdOptions = await updateOptionsWithValues(storeId, optionId, name, values);

    return NextResponse.json(createdOptions);
  } catch (error) {
    console.error("", error);
    return new NextResponse();
  }
}
