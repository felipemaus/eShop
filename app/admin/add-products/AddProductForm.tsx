'use client';

import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CustomCheckbox from "@/app/components/inputs/CustomCheckbox";
import SelectColor from "@/app/components/inputs/SelectColor";
import TextArea from "@/app/components/inputs/TextArea";
import Input from "@/app/components/inputs/input";
import firebaseApp from "@/libs/firebase";
import { categories } from "@/utils/categories";
import { colors } from "@/utils/colors";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import axios from "axios";
import { useRouter } from "next/navigation";

export type ImageType = {
  color: string;
  colorCode: string;
  image: File | null
}

export type UploadedImageType = {
  color: string;
  colorCode: string;
  image: string
}

const AddProductForm = ()=> {

  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>();
  const [isProductCreated, setIsProductCreated] = useState(false);
  const router = useRouter();

  const {register, handleSubmit, setValue, watch, reset,getValues, formState:{errors}} = useForm<FieldValues>({
    defaultValues:{
      name:'',
      brand:'',
      category:'',
      description: '',
      inStock: false,
      price: "",
      images: [],
    }
  })

  useEffect(()=>{
    setCustomValue("images", images)
  },[images]);

  useEffect(()=>{
    if (isProductCreated) {
      reset();
      setIsProductCreated(false);
    }
  },[isProductCreated]);

  const onSubmit:SubmitHandler<FieldValues> = async(data) =>{
    console.log('data', data);

    setIsLoading(true);
    let uploadedImages: UploadedImageType[] = [];

    if (!data.category) {
      setIsLoading(false);
      return toast.error('Category is not selected');
    }
    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      return toast.error('No selected image');
    }

    const handleImageUploads = async () =>{
      toast('Creating product, please wait..');
      try {
        for(const item of data.images){
          if (item.image) {
            const fileName = new Date().getTime() + '-' + item.image.name;
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item.image);

            await new Promise<void>((resolve, reject)=>{
              uploadTask.on(
                'state_changed',
                (snapshot)=>{
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log('Upload is ' + progress + '% done');
                  switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused');
                      break;
                    case 'running':
                      console.log('Upload is running');
                      break;
                  }
                },
                (error) => {
                  console.log('error uploading image', error)
                  reject(error);
                }, 
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then(
                    (downloadURL) => {
                      uploadedImages.push({
                        ...item,
                        image: downloadURL
                      })
                    console.log('File available at', downloadURL);
                    resolve()
                  }).catch((error)=>{
                    console.log('Error getting the dowload URL', error);
                    reject(error);
                  });
                }
              )
            });
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.log('Error handling image uploads', error);
        return toast.error('Error handling image uploads')
      };
    };

    await handleImageUploads();
    const productData = {...data, images: uploadedImages};
    console.log('productData', productData);

    axios.post('/api/product', productData).then(()=>
    {
      toast.success("Produto criado com sucesso!");
      setIsProductCreated(true);
      router.refresh();
    }).catch((error)=> {
        toast.error("Erro ao cadastrar o produto!");
    }).finally(()=> {
      setIsLoading(false);
    })
    
  }; 

  const category = watch("category");

  const setCustomValue = (id:string, value:any) =>{
    setValue(id,value,{
      shouldValidate:true,
      shouldDirty:true,
      shouldTouch:true 
    })
  };

  const addImageToState = useCallback((value: ImageType)=>{
    setImages((prev)=>{
      if (!prev) {
        return [value];
      }
      return [...prev, value];
    });
  },[]);

  const removeImageFromState = useCallback((value: ImageType)=>{
    setImages((prev)=>{
      if (prev) {
        const filterImages = prev.filter((item)=> item.color !== value.color)
        
        return filterImages;
      }
      
      return prev;
    })
  },[])

  console.log('images', images)

  return (
    <>
      <Heading title="Adicionar produto" center/>
      <Input
        id="name"
        label="Name"
        disabled={isLoading} 
        errors={errors}
        required
        register={register}
      />
      <Input
        id="price"
        label="Preço"
        disabled={isLoading} 
        errors={errors}
        required
        register={register}
        type="number"
      />
       <Input
        id="brand"
        label="Marca"
        disabled={isLoading} 
        errors={errors}
        required
        register={register}
      />
      <TextArea
        id="description"
        label="Descrição"
        disabled={isLoading} 
        errors={errors}
        required
        register={register}
      />
      <CustomCheckbox id="inStock" register={register} label="Produto em estoque" />
      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Selecione uma categoria</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">
          {categories.map((item)=> {
            if (item.label === 'All') {       
              return null;
            }
            return <div key={item.label} className="col-span ">
              <CategoryInput 
                onClick={(category)=> setCustomValue('category', category)}
                selected={category === item.label}
                label={item.label}
                icon={item.icon}
              />
            </div>
          })}
        </div>
      </div>
      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-bold">
              Selecione a cor do produto e sua imagem
          </div>
          <div className="text-sm">
              Você deve selecionar uma imagem para cada cor, se não o cor sem imagem não será adicionada!
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 ">
            {colors.map((item,index)=> {
              return (
              <SelectColor 
                key={index}
                item={item} 
                addImageToState={addImageToState}
                removeImageFromState={removeImageFromState}
                isProductCreated={isProductCreated}
              />
              )
            })}
        </div>
      </div>
      <Button label={isLoading ? 'Loading...' : "Adicionar o Produto"} onClick={handleSubmit(onSubmit)} />
    </>
  )
}

export default AddProductForm;