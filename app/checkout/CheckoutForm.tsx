'use client';

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Heading from "../components/Heading";
import Button from "../components/Button";

interface CheckoutFormProps{
    clientSecret: string,
    handleSetPaymentSuccess: (value: boolean) => void; 
}
const CheckoutForm:React.FC<CheckoutFormProps> = ({
    clientSecret,
    handleSetPaymentSuccess
}) => {

    const { cartTotalAmount, handleClearCart, handleSetPaymentIntent } = useCart()
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsloading] = useState(false);
    const formattedPrice = formatPrice(cartTotalAmount);

    useEffect(()=> {
        if (!stripe) {
            return; 
        }
        if (!clientSecret) {
            return;
        }
        handleSetPaymentSuccess(false);

    },[stripe]);

    const handleSubmit = async(e:React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        setIsloading(true);

        stripe.confirmPayment({
            elements, redirect: 'if_required'
        }).then(result => {
            if (!result.error) {
                toast.success('Pagamento Realizado com sucesso!');
            
                handleClearCart();
                handleSetPaymentSuccess(true);
                handleSetPaymentIntent(null);
            }

            setIsloading(false);
        })
    }

  return (
    <form onSubmit={handleSubmit} id="payment-form">
        <div className="mb-6">
            <Heading title="Complete os dados para a conclusão do pagamento" />
        </div>
        <h2 className="font-semibold mb-2">
            Endereço
        </h2>
        <AddressElement options={{
            mode:'shipping',
            allowedCountries: ['BR']
        }} />
        <h2 className="font-semibold mt-4 mb-2">
            Informações do pagamento
        </h2>
        <PaymentElement id="payment-element" options={{
            layout: 'tabs'
        }}/>
        <div className="py-4 text-center text-slate-700 text-xl font-bold">
            Total: {formattedPrice}
        </div>
        <Button label={isLoading ? 'Processando' : 'Finalizar compra'} disabled={isLoading || ! stripe || !elements} onClick={()=>{}} />
    </form>
  )
}

export default CheckoutForm;