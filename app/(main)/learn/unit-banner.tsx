'use client'

import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import { Check, CircleCheckBig, NotebookText } from "lucide-react";
import Link from "next/link";

// import LottieAnimation1 from '@/public/LottieUnit1.json'
import LottieAnimation1 from '@/public/LottieBreadAverage.json'

// /Users/mac/Downloads/LottieBreadAverage.json

// import LottieAnimation2 from '@/public/LottieUnit2.json'
import LottieAnimation2 from '@/public/LottieSharkMass.json'

// import LottieAnimation3 from '@/public/LottieUnit3.json'
import LottieAnimation3 from '@/public/LottieDeathMeanRho.json'

// import LottieAnimation4 from '@/public/LottieUnit4.json'
import LottieAnimation4 from '@/public/LottieFoogooPressure.json'

// import LottieAnimation5 from '@/public/LottieUnit5.json'
import LottieAnimation5 from '@/public/LottieArchimed.json'

// import LottieAnimation6 from '@/public/LottieUnit6.json'
import LottieAnimation6 from '@/public/LottieWatermelonDrink.json'

// import LottieAnimation7 from '@/public/LottieUnit7.json'
import LottieAnimation7 from '@/public/LottieGameU.json'

// import LottieAnimation8 from '@/public/LottieUnit8.json'
import LottieAnimation8 from '@/public/LottieJolesWatts.json'


import LottieAnimation9 from '@/public/LottieUnit9.json'

import { cn } from "@/lib/utils";

type Props = {
    title: string;
    description: string;
    imgSrc: string;
    id: number;
    percentageDone: number;
}

export const UnitBanner = ({
    title,
    description,
    imgSrc,
    id,
    percentageDone,
}: Props)=>{

    const LottieData = [
        LottieAnimation1,
        LottieAnimation2,
        LottieAnimation3,
        LottieAnimation4,
        LottieAnimation5,
        LottieAnimation6,
        LottieAnimation7,
        LottieAnimation8,
        LottieAnimation9,
    ]

    // console.log(imgSrc)
    // console.log(LottieAnimation)
    // "flex items-center justify-between",
    return(
        <div className="w-full rounded-xl  bg-green-500 p-5 text-white flex items-center justify-between">





        <div className="flex flex-1 items-center justify-between">

            <div className="space-y-2.5">
                <h3 className="text-2xl font-bold">
                    {title}
                </h3>

                <p className="text-lg">
                    {description}
                </p>

                <div className="flex flex-1 gap-2">
                    <CircleCheckBig className="h-6 w-6"
                                    // className={cn(
                                    //     "h-10 w-10",
                                    //     2==1
                                    //     ? "fill-neutral-400 text-neutral-400 stroke-neutral-400"
                                    //     : "fill-primary-foreground text-primary-foreground",
                                    //     1==1 && "fill-none stroke-[4]"
                                    // )}
                                />
                    {Math.round(percentageDone*100)}%
                </div>

            </div>  

            <div className='size-40'> 
                {/* <Lottie animationData={LottieAnimation} />            */}
                <Lottie 
                    animationData={LottieData[id%1000-1]} 
                    loop={false}
                />           
            </div>


            </div>


            <Link href='/lesson'>
                <Button 
                    size='lg' 
                    variant='secondary'
                    className="hidden xl:flex border-2 border-b-4 active:border-b-2"
                    >
                    <NotebookText className="mr-2"/>
                    Продолжить
                    
                </Button>
            </Link>

        </div> 
    )
}