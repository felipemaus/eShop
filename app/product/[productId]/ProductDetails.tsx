'use client';
import Button from "@/app/components/Button";
import ProductImage from "@/app/components/products/ProductImage";
import SetColor from "@/app/components/products/SetColor";
import SetQuantity from "@/app/components/products/setQuantity";
import { useCart } from "@/hooks/useCart";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";

 interface ProductDetailsProps{
    product: any
 }

 export type CartProductType={
    id: string,
    name: string,
    description: string,
    category: string,
    brand:string,
    selectedImg: selectedImg
    quantity: number,
    price:number,
 }

 export type selectedImg = {
    color: string,
    colorCode: string,
    image: string
 }

 const Horizontal = () => {
    return <hr className="w-[30%] my-2" />
 }

 
 const ProductDetails:React.FC<ProductDetailsProps> = ({product}) => {
   
    const { handleAddProductToCart, cartProducts } = useCart();
    const [isProductInCart, setIsProductInCart] = useState(false);
    const [cartProduct, setCartProduct] = useState<CartProductType>({ 
        id:product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        brand:product.brand,
        selectedImg: {...product.images[0]},
        quantity: 1,
        price:product.price});


    const router = useRouter()    
    

    const productRating = product.reviews.reduce((acc:number, item: any)=> item.rating + acc, 0) / product.reviews.length

    const handleColorSelecte = useCallback((value: selectedImg)=> {
            setCartProduct((prev)=> {
                return {...prev, selectedImg: value}
            })
    },[cartProduct.selectedImg])

    const handleQtyIncrease = useCallback(()=>{
        if (cartProduct.quantity === 99) {
            return;
        }
        setCartProduct((prev)=> {
            return {...prev, quantity: ++prev.quantity}
        })
    } , [cartProduct])
    const handleQtyDecrease = useCallback(()=>{
        if (cartProduct.quantity === 1) {
            return;
        }
        setCartProduct((prev)=> {
            return {...prev, quantity: --prev.quantity}
        })
    } ,[cartProduct])

    useEffect(()=>{
        setIsProductInCart(false)

        if (cartProducts) {
            const existingIndex = cartProducts.findIndex((item)=> item.id == product.id )
        
            if (existingIndex > -1) {
                setIsProductInCart(true);
            }
        }
    },[cartProducts])

   return <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
       <ProductImage cartProduct={cartProduct} product={product} handleColorselect={handleColorSelecte} />
        <div className="flex flex-col gap-1 text-slate-500 text-sm">
            <h2 className="text-3xl font-medium text-slate-700">
                {product.name}
            </h2>
            <div className="flex items-center gap-2">
                <Rating value={productRating} readOnly />
                <div>
                    {product.reviews.length} Avaliações
                </div>
            </div>
            <Horizontal />
            <div className="text-justify">
                {product.description}
            </div>
            <Horizontal />
            <div>
                <span className="font-semibold">
                    Categorias:
                </span>
                {product.category}
            </div>
            <div>
                <span className="font-semibold">
                    Marca:
                </span>
                {product.brand}
            </div>
            <div className={product.inStock ? 'text-teal-400' : 'text-rose-400' }>{product.inStock ? 'Disponível no estoque' : "Sem unidades no estoque"}</div>
            <Horizontal />
            {isProductInCart ? (
                <>
                    <p className="mb-2 text-slate-500 flex items-center gap-1">
                        <MdCheckCircle size={20} className="text-teal-400" />
                        <span>Produto adicionado ao carrinho</span>
                    </p>
                    <div className="max-w-[300px]">
                        <Button label="Ver o carrinho" outlined onClick={()=> {
                            router.push("/cart")
                        } } />
                    </div>
                </>
                ) : ( 
                <>
                    <SetColor cartProduct={cartProduct} images={product.images} handleColorSelect={handleColorSelecte} />
                    <Horizontal />
                    <SetQuantity 
                        cartProduct={cartProduct} 
                        handleQtyIncrease={handleQtyIncrease}
                        handleQtyDecrease={handleQtyDecrease}
                        cartCounter
                    />
                    <Horizontal />
                    <div className="max-w-[300px]">
                        <Button         
                            label="Adicionar ao carrinho"
                            onClick={()=> handleAddProductToCart(cartProduct)} 
                        />
                    </div>
                </>
            )}
        </div>
    </div>
 }

 export default ProductDetails