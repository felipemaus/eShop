'use client'

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/input";
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form';
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SafeUser } from "@/types";
import { signIn } from "next-auth/react";

interface LoginFormProps{
  currentUser: SafeUser | null
}

const LoginForm:React.FC<LoginFormProps> = ({currentUser}) => {

    const [isLoading, setIsLoading] = useState(false)
    const {register, handleSubmit, formState:{errors}} = useForm<FieldValues>({
        defaultValues:{
            email:'',
            password: '',
        }
    });

    const router = useRouter();

    const onSubmit:SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        signIn('credentials', {
          ...data,
          redirect: false
        }).then((callback) => {
            setIsLoading(false);
            if (callback?.ok) {
              router.push('/cart');
              router.refresh();
              toast.success('Você está logado!');
          }
          if (callback?.error) {
              toast.error(callback.error)
          }
        })
    }
  
  useEffect(()=>{
    if (currentUser) {
      router.push('/cart');
      router.refresh();
    }
  },[]);

  if (currentUser) {
    return <p className="text-center">Você já está logado. Redirecionando...</p>
  }

  return (
    <>
        <Heading title="Login" />
        <Button outlined label="Continuar com o Google" icon={AiOutlineGoogle} onClick={()=> {signIn('google');}}  />
        <hr className="bg-slate-300 w-full h-px" />
          <Input 
            id="email"
            label="Email"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
        />
          <Input 
            id="password"
            label="Senha"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="password"
        />
        <Button label={isLoading ? "Loading" : "Login"}
            onClick={handleSubmit(onSubmit)}
        />
        <p className="text-sm"> Você não possue uma conta? <Link href='/register' 
            className="underline text-blue-500">
            Cadastre-se
            </Link>
        </p>
    </>
  )
}

export default LoginForm