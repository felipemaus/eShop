import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function POST(request: Request){

    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'ADMIN') {
        return NextResponse.error()
    }

    const body = await request.json();
    const { name, description, price , brand, category, inShock, images } = body;


    const product = await prisma.product.create({
        data:{
            name,
            brand,
            category,
            description,
            inShock,
            price: parseFloat(price),
            images,
        }
    });

    return NextResponse.json(product);
}