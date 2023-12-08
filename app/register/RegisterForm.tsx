'use client'

import { useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/input";
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form';
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";


const RegisterForm=()=> {

    const [isLoading, setIsLoading] = useState(false)
    const {register, handleSubmit, formState:{errors}} = useForm<FieldValues>({
        defaultValues:{
            name: '',
            email:'',
            password: '',
        }
    })

    const onSubmit:SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

         
    }


  return (
    <>
        <Heading title="Faça seu cadastro" />
        <Button outlined label="Sign up with Google" icon={AiOutlineGoogle} onClick={()=>{}} />
        <hr className="bg-slate-300 w-full h-px" />
        <Input 
            id="name"
            label="Nome"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
        />
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
        <Button label={isLoading ? "Loading" : "Cadastrar-se"}
            onClick={handleSubmit(onSubmit)}
        />
        <p className="text-sm"> Você possue um cadastro? <Link href='/login' 
            className="underline text-blue-500">
            Login
            </Link>
        </p>
    </>
  )
}

export default RegisterForm