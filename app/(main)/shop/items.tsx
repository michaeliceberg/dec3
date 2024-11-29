'use client'

import { refillHearts } from "@/actions/user-progress"
import { createStripeUrl } from "@/actions/user-subscription"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useTransition } from "react"
import { toast } from "sonner"
import Lottie from "lottie-react"
import LottiePick from '@/public/Lottie/LottiePick.json'
import LottieCoins from '@/public/Lottie/LottieCoins.json'
import LottieGems from '@/public/Lottie/LottieGems.json'





const POINTS_TO_REFILL = 10

type Props = {
    hearts: number
    points: number
    hasActiveSubscription: boolean
}

export const Items = ({
    hearts,
    points,
    hasActiveSubscription
}: Props) => {

    const [pending, startTransition] = useTransition()

    const onRefillHearts = () => {
        if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
            return
        }

        startTransition(()=>{
            refillHearts()
            .catch(()=>toast.error('Что-то пошло не так'))
        })
    }

    const onUpgrade = () => {
        startTransition(()=>{
            createStripeUrl()
            .then((response)=> {
                if (response.data) {
                    window.location.href = response.data
                }
            })
            .catch(() => toast.error('Что-то пошло не так!')) 
        })
    }

    return (
        <ul className="w-full">
            <div className="flex w-full justify-between">


                
                <div className="flex items-center  p-4 gap-x-4 border-t-2">
                    <Image
                        src="/heart.svg"
                        alt='Heart'
                        height={60}
                        width={60}
                    />
                    <div className="flex-1">
                        <p className="text-neutral-700 text-base lg:text-xl font-bold">
                            Восстановить жизни
                        </p>
                    </div>
                </div>


                <Button
                    className="content-center"
                    onClick={onRefillHearts}
                    // size='buy'
                    disabled={
                        pending
                        || hearts === 5 
                        || points < POINTS_TO_REFILL
                    }>
                    {hearts === 5
                        ? "full"
                        : (
                            <div className="flex justify-center w-[80px] content-center">
                                <Lottie 
                                    className="h-16 w-16 pb-4 content-center" 
                                    animationData={LottieCoins}
                                    loop={false}
                                /> 

                                <p className="content-center">
                                    {POINTS_TO_REFILL}
                                </p>
                            </div>
                        )
                        }
                </Button>
            </div>



            {/* <div className="flex items-center w-full p-4 pt-8 gap-x-4 border-t-2">
                <Image 
                    src='/unlimited.svg'
                    alt='Unlimited'
                    height={60}
                    width={60}
                />
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold">
                        Неограниченные жизни
                    </p>
                </div>

                <Button
                    onClick={onUpgrade}
                    disabled={pending || hasActiveSubscription}
                >
                    {hasActiveSubscription ? "active" : "купить"}
                </Button>
            </div> */}




            <div className="flex items-center w-full p-4 gap-x-4 border-t-2" />
            {/* <BuyMine /> */}


            <div className="w-full flex justify-between">
             <Lottie 
                    className="h-20 w-20 pb-4" 
                    animationData={LottiePick}
                    // loop={false}
                /> 
				









                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold">
                        Построить рудник гемов 
                    </p>
                    <p className="text-neutral-700 text-sm lg:text-sm">
                        Каждый день будете получать +1 гем
                    </p>
                </div>
                <Button
                    // size='buy'
                    disabled={ 1===1
                    //     pending
                        
                    //     || points < 1290
                    }>
            
					<div className="flex items-center w-[80px]">

                    <Lottie 
                        className="h-16 w-16 pb-4" 
                        animationData={LottieCoins}
                        loop={false}
                    /> 

						<p>
							1990
						</p>
					</div>
              
                </Button>

                </div>








            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
                <Image
                    src="/dodoPizza.png"
                    alt='Pizza'
                    height={60}
                    width={60}
                />
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold">
                        Додо пицца (35см) с доставкой
                    </p>
                    <p className="text-neutral-700 text-sm lg:text-sm">
                        Заказ может сделать лидер этой недели
                    </p>
                </div>
                <Button
                    variant='buy'
                    size='buy'
                    onClick={onRefillHearts}
                    disabled={
                        pending
                        || hearts === 5 
                        || points < 1290}>

                            {/* <div className="flex justify-center w-[80px] content-center"> */}
                            <div className="flex items-center w-[80px]">
                                <Lottie 
                                    className="h-10 w-10 pb-1" 
                                    animationData={LottieGems}
                                    loop={false}
                                    
                                /> 

                                <p>
                                    10
                                </p>
                            </div>
                </Button>
            </div>

        </ul>
    )
}