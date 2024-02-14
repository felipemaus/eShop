import Container from "@/app/components/Container"
import ProductDetails from "./ProductDetails"
import { products } from "@/utils/products"
import ListRating from "./ListRating"
import getProductById from "@/actions/getProductById"
import NullData from "@/app/components/NullData"
import AddRating from "./AddRating"
import { getCurrentUser } from "@/actions/getCurrentUser"

interface IParams {
    productId?: string
}

const Product = async ({params}: {params: IParams})=> {

  const product= await getProductById(params);
  const user = await getCurrentUser();

  if (!product) {
    return <NullData title="Nenhum produto encontrado!" />
  }

  return (
    <div className="p-8">
        <Container>
            <ProductDetails product={product} />
            <div className="flex flex-col mt-20 gap-4">
              <div>
                Add Rating
              </div>
              <AddRating product={product} user={user} />
              <ListRating product={product} />
            </div>
        </Container>
    </div>
  )
}

export default Product