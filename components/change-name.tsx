'use client'

import {useState, useTransition} from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { upsertUserName } from '@/actions/user-progress';
import { toast } from 'sonner';
import { NewSelect } from './new-select'


type Props= {
    placeholder: string
    imageSrc: string
}


const options = [
    { label: "cats/cat1.jpg", value: 1 },
    { label: "cats/cat2.jpg", value: 2 },
    { label: "cats/cat3.jpg", value: 3 },
    { label: "cats/cat4.jpg", value: 4 },
    { label: "cats/cat5.jpg", value: 5 },
    { label: "cats/cat6.jpg", value: 6 },
    { label: "cats/cat7.jpg", value: 7 },
    { label: "cats/cat8.jpg", value: 8 },
    { label: "cats/cat9.jpg", value: 9 },
    { label: "cats/cat10.jpg", value: 10 },
    { label: "cats/cat11.jpg", value: 11 },
    { label: "cats/cat12.jpg", value: 12 },
    { label: "cats/cat13.jpg", value: 13 },
    { label: "cats/cat14.jpg", value: 14 },
    { label: "cats/cat15.jpg", value: 15 },
]



export const ChangeNameInput = ({
    placeholder, imageSrc
}: Props) => {


    const [pending, startTransition] = useTransition()

    const onButtonPress = () => {
        startTransition(()=> {
            if (pending) return;
            
            upsertUserName(newName)
            .catch(()=>toast.error('Что-то пошло не так! Попробуйте ещё раз'))
        })
        
    }


    const [newName, setNewName] = useState(placeholder);
    const handleChangeName = (event:any) => {
        setNewName(event.target.value);
    }



    


    // const [value, setValue] = useState<typeof options[0] | undefined>(options[0])
    const [value, setValue] = useState<typeof options[0] | undefined>({label: imageSrc, value: 1} || options[0])

    return (
        <>



            <NewSelect 
                options={options} 
                value={value} 
                onChange={o => setValue(o)} 
            />



            <Input 
                placeholder={placeholder}
                type="text"
                value={newName}
                onChange={handleChangeName} 
            />

            <Button 
                onClick={onButtonPress}
                type="submit"
            >
                Поменять имя
            </Button> 
        </>
    )
}