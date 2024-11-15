// 'use client'

import { FeedWrapper } from "@/components/feed-wrapper"
import { StickyWrapper } from "@/components/sticky-wrapper"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { UserProgress } from "@/components/user-progress"
import { getTopTenUsers, getUserProgress, getUserSubscription } from "@/db/queries"
import { progressType } from "@/db/schema"
import { getUserPointsHearts } from "@/usefulFunctions"
import Image from "next/image"
import { redirect } from "next/navigation"



// import LottieAnimation5 from '@/public/LottieUnit5.json'
// import LottieAnimation5 from '@/public/LottieArchimed.json'
// import Lottie from "lottie-react"

const LeaderboardPage = async () => {

    const userProgressData = getUserProgress()
    const userSubscriptionData = getUserSubscription()
    const leaderboardData = getTopTenUsers()


    const [
        userProgress,
        userSubscription,
        leaderboard,
    ] = await Promise.all([
        userProgressData,
        userSubscriptionData,
        leaderboardData,
    ])

    if (!userProgress || !userProgress.activeCourse) {
        redirect('/courses')
    }

    const isPro = !!userSubscription?.isActive



    
    const [Points, Hearts] = getUserPointsHearts(userProgress)


    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress 
                    activeCourse={userProgress.activeCourse}
                    // hearts={userProgress.hearts}
                    hearts={Hearts}
                    // points={userProgress.points}
                    points={Points}
                    
                    hasActiveSubscription={isPro}
                />
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    
                    {/* <Lottie animationData={LottieAnimation5} />   */}
                    <Image
                        src='/leaderboard.svg'
                        alt='Leaderboard'
                        height={90}
                        width={90}
                    />   
                    <h1 className="text-center font-bold text-neural-800 text-2xl my-6">
                        Таблица лидеров
                    </h1>
                    <p className="text-muted-foreground text-center text-lg mb-6">
                        Узнай свое положение среди остальных
                    </p>

                    <Separator className="mb-4 h-0.5 rounded-full" />
                    {leaderboard.map((userProgress, index)=>(
                        <div 
                            key={userProgress.userId}
                            className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50"
                        >
                            <p className="font-bold text-lime-700">{ index + 1 }</p> 
                            <Avatar
                                className="border bg-green-500 h-12 w-12 ml-3 mr-6"
                            >
                                <AvatarImage 
                                    className="object-cover"
                                    src={userProgress.userImageSrc}
                                />
                            </Avatar>  
                            <p className="font-bold text-neural-800 flex-1">
                                {userProgress.userName}
                            </p>
                            <p className="text-muted-foreground">
                                {userProgress.points} XP
                            </p>
                        </div>
                    ))}

                    {/* {leaderboard.map((userProgress, index)=>{
                        <div key={userProgress.userId}>

                        </div>
                    })} */}
                </div>
            </FeedWrapper>
            
        </div>
    )
}

export default LeaderboardPage