'use client'

import { useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/input";
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form';
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";


const LoginForm=()=> {

    const [isLoading, setIsLoading] = useState(false)
    const {register, handleSubmit, formState:{errors}} = useForm<FieldValues>({
        defaultValues:{
            email:'',
            password: '',
        }
    })

    const onSubmit:SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
      
    }

  return (
    <>
        <Heading title="Login" />
        <Button outlined label="Continuar com o Google" icon={AiOutlineGoogle} onClick={()=>{}} />
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