import Container from "@/app/components/Container";
import OrdersClient from "./OrderClient";
import NullData from "@/app/components/NullData";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getOrdersByUserId from "@/actions/getOrdersByUserId";

const Orders = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <NullData title="Oops Acesso negado!" />
  }  

  const orders = await getOrdersByUserId(currentUser.id)

  if (!orders) {
    return <NullData title="No orders yet..." />
  }  
  return (
    <div className="p-8">
        <Container>
          <OrdersClient orders = {orders} />
        </Container>
    </div>
  )
}

export default Orders