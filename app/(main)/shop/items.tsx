'use client'

import { refillHearts } from "@/actions/user-progress"
import { createStripeUrl } from "@/actions/user-subscription"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useTransition } from "react"
import { start } from "repl"
import { toast } from "sonner"
import dodoPizza from '@/public/dodoPizza.png'

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
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
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
                <Button
                    onClick={onRefillHearts}
                    disabled={
                        pending
                        || hearts === 5 
                        || points < POINTS_TO_REFILL
                    }
                >
                    {hearts === 5
                        ? "full"
                        : (
                            <div className="flex items-center">
                                <Image 
                                    src='/points.svg'
                                    alt="Points"
                                    height={20}
                                    width={20}
                                />
                                <p>
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












            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
                <Image
                    src="/dodoPizza.png"
                    // src="/AchivementPng/AchivementBulbBW.png"
                    alt='Pizza'
                    height={60}
                    width={60}
                />
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold">
                        Додо пицца с доставкой (35 см)
                    </p>
                    <p className="text-neutral-700 text-sm lg:text-sm">
                        Заказ может сделать лидер этой недели
                    </p>
                </div>
                <Button
                    onClick={onRefillHearts}
                    disabled={
                        pending
                        || hearts === 5 
                        || points < 1290
                    }
                >
                    {hearts === 5
                        ? "full"
                        : (
                            <div className="flex items-center">
                                <Image 
                                    src='/points.svg'
                                    alt="Points"
                                    height={20}
                                    width={20}
                                />
                                <p>
                                    1290
                                    {/* {POINTS_TO_REFILL} */}
                                </p>
                            </div>
                        )
                        }
                </Button>
            </div>

        </ul>
    )
}