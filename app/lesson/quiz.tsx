'use client';

import { SuperType, challengeOptions, challengeProgress, challenges, userProgress } from "@/db/schema";
import { CloudCog, Crown, Heart, Library, LibraryBig, SquareLibrary } from "lucide-react";
import { headers } from "next/headers";
import { useEffect, useState, useTransition } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";
import { useAudio, useWindowSize, useMount } from "react-use";

import Image from "next/image";
import { ResultCard } from "./result-card";
import { useRouter } from "next/navigation";
import Confetti from 'react-confetti'
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import LottieSelectRainbow from '@/public/LottieSelectRainbow.json'
import LottieSelectCrown from '@/public/LottieSelectCrown.json'
import LottieSelectDiamond from '@/public/LottieSelectDiamond.json'
import LottieSelectSparks from '@/public/LottieSelectSparks.json'
import LottieSelectStars from '@/public/LottieSelectStars.json'
import LottieSelectButterfly from '@/public/LottieSelectButterfly.json'
import Lottie from "lottie-react";
import { useWrongAnswerModal } from "@/store/use-wronganswer-modal";

type Props= {
    initialPercentage: number
    initialHearts: number
    initialLessonId: number
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean
        challengeOptions: typeof challengeOptions.$inferSelect[]
    })[]
    userSubscription: any // TODO: REPLACE
    challengeProgress: typeof challengeProgress.$inferSelect[] 
    lessonTitle: string

    oldCourseProgress: SuperType
    activeCourseTitle: string
}


const LottieData = [
    LottieSelectRainbow,
    LottieSelectCrown,
    LottieSelectDiamond,
    LottieSelectSparks,
    LottieSelectStars,
    LottieSelectButterfly,
]

var randomLottieSelect = LottieData[Math.floor(Math.random()*LottieData.length)];


export const Quiz = ({
    initialPercentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubscription,
    challengeProgress,
    lessonTitle,
    oldCourseProgress,
    activeCourseTitle,
}: Props) => {


    const { open: openHeartsModal } = useHeartsModal()
    const { open: openPracticeModal } = usePracticeModal()

    useMount(() => {
        if (initialPercentage === 100) {
            openPracticeModal()
        }
    })

    const { width, height } = useWindowSize()

    const router = useRouter()

    const [finishAudio] = useAudio({src:'/finish.mp3', autoPlay: true})
    const [
        correctAudio,
        _c,
        correctControls,
    ] = useAudio({ src: '/correct.wav' })

    const [
        incorrectAudio,
        _i,
        incorrectControls,
    ] = useAudio({ src: '/incorrect.wav' })

    const [pending, startTransition] = useTransition()

    const [lessonId, setLessonId] = useState(initialLessonId)

    const [hearts, setHearts] = useState(initialHearts)


    console.log('QUIZZZZZZ')
    console.log(hearts)

    
    const [percentage, setPercentage] = useState(()=>{
        return initialPercentage === 100 ? 0 : initialPercentage
    })
    const [challenges] = useState(initialLessonChallenges)

    

    const challengesDoneWrong = challengeProgress.filter((el) => el.doneRight === false)



    const challengesIds = challenges.map(el => el.id)
    const challengesDone = challengeProgress.filter((el) => challengesIds.includes(el.challengeId))
   
    const wrongChallengesId = challengesDoneWrong.map(a => a.challengeId);
    const doneChallengesId = challengesDone.map(a => a.challengeId);

    const challengesInLessonThatIsNOTDone = challenges.filter((el) => !doneChallengesId.includes(el.id))


    const [activeIndex, setActiveIndex] = useState( 
        undefined === challengesInLessonThatIsNOTDone[0] 
        ? challenges[0].id 
        : challengesInLessonThatIsNOTDone[0].id
    )

    const [isDoneWrongChallenge, setIsDoneWrongChallenge] = useState(false)
    const [isDoneChallenge, setIsDoneChallenge] = useState(false)
      
    const onClickNumber = (num: number) => {   
      
        setActiveIndex(num - 1)
         
        setSelectedOption(undefined)
        setStatus('none')

        setIsDoneWrongChallenge(wrongChallengesId.includes(num-1))
        setIsDoneChallenge(doneChallengesId.includes(num-1))
    }


    const [selectedOption, setSelectedOption] = useState<number>()
    const [status, setStatus] = useState<"correct" | "wrong" | "none">('none')

    
    let [challenge] = challenges.filter(el => el.id == activeIndex)


    const {open} = useWrongAnswerModal()

    // // SHUFFLE FUNCTION
    // //
    // function Shuffle(array: any) {
    //         let currentIndex = array.length;
      
    //     while (currentIndex != 0) {
      
    //       let randomIndex = Math.floor(Math.random() * currentIndex);
    //       currentIndex--;
      
    //       [array[currentIndex], array[randomIndex]] = [
    //         array[randomIndex], array[currentIndex]];
    //     }
    //   }
      
    
    // const options = challenge?.challengeOptions ?? []

    // useEffect(()=>{
    //     Shuffle(options)
    // },[activeIndex])










       // SHUFFLE FUNCTION
    //
    
  

const options = challenge?.challengeOptions ?? []



useEffect(()=>{

    const Shuffle = (array: any) => {
        let currentIndex = array.length;
    
        while (currentIndex != 0) {
    
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    }

    Shuffle(options)

},[activeIndex])









    const onNext = () => {
        setActiveIndex((current) => current + 1)
    }

    const onSelect = (id:number) => {
        if (status !== "none") return
        // TODO:
        setSelectedOption(id)
    }

    const onContinue = () => {
        if (!selectedOption) return

        if (status==='wrong') {
            onNext()
            setStatus('none')
            setSelectedOption(undefined)
            return
        }

        if (status==='correct') {
            onNext()
            setStatus('none')
            setSelectedOption(undefined)
            return
        }

        const correctOption = options.find((option)=>option.correct)

        if (!correctOption) {
            return
        }

        if(correctOption && correctOption.id === selectedOption) {
            
            startTransition(()=> {

                //TODO: ADD DONE RIGHT
                const TrueValue = true
                
                // close()

                upsertChallengeProgress(challenge.id, TrueValue, oldCourseProgress, activeCourseTitle, challenge.points)
                // .then(() => {close()})
                // const {openWrongAnswerModal} = useWrongAnswerModal()
                .then((response)=>{
                    if (response?.error === 'hearts') {
                        openHeartsModal()
                        return
                    }

                    correctControls.play()
                    setStatus('correct')
                    setPercentage((prev)=> prev + 100/challenges.length)

                    // TODO: This is a practice
                    if (initialPercentage===100){
                        setHearts((prev) => Math.min(prev + 1, 5))
                    }
                })
                .catch(()=>toast.error('Что-то пошло не так! Попробуйте ещё раз'))
            })
        } else {

            //TODO: ADD DONE WRONG
            const FalseValue = false

            // open()

            startTransition(()=>{
                reduceHearts(challenge.id)

                open()

                upsertChallengeProgress(challenge.id, FalseValue, oldCourseProgress, activeCourseTitle, challenge.points)
                
                .then((response)=>{
                    if(response?.error === 'hearts') {
                        openHeartsModal()
                        return 
                    }

                    incorrectControls.play()
                    setStatus('wrong')

                    setPercentage((prev)=> prev + 100/challenges.length)

                    if (!response?.error) {
                        setHearts((prev) => Math.max(prev - 1, 0))
                    }
                })
                .catch(()=>toast.error('Что-то пошло не так! Попробуйте ещё раз'))
            })

        }
    }
    
    if(!challenge) {
        challenge = challenges[0]
    }
    //TODO: РЕШИЛИ ВСЕ ЧЕЛЕНДЖИ В ЭТО ЛЕССОНЕ
    //

    if(challenges.length === challengesDone.length) {
        // console.log('WE HERE')
        // console.log(challenge)
        return(
            <>
                {finishAudio}
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    tweenDuration={10000}
                />
                <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                    <Image
                        src='/finish.svg'
                        alt="Finish"
                        className="hidden lg:block"
                        height={100}
                        width={100}
                    />
                    <Image
                        src='/finish.svg'
                        alt="Finish"
                        className="block lg:hidden"
                        height={50}
                        width={50}
                    />
                    <h1 className="text-xl lg:text-xl font-bold text-neutral-700">
                        Great job <br /> Вы завершили урок!
                    </h1>
                    <div className="flex items-center gap-x-4 w-full">
                        <ResultCard 
                            variant='points'
                            value={challenges.length * 10}
                        />
                        <ResultCard 
                            variant='hearts'
                            value={hearts}
                        />
                    </div>
                </div>
                <Footer 
                    lessonId={lessonId}
                    status='completed'
                    onCheck={()=>router.push('/learn')}
                />
            </>
            )
        }



    const title = challenge.type === "ASSIST" 
    // ? "Select the correct meaning"
    ?  lessonTitle
    : challenge.question


    return(
    <>

        {incorrectAudio}
        {correctAudio}
        <Header 
            hearts={hearts}
            percentage={percentage}
            hasActiveSubscription={!!userSubscription?.isActive}
        />

         {/* TODO: SELECT numbers */}
         
        
        <div className="flex justify-center mt-10">
            
            <Lottie className="h-20 w-20 pr-5"
                    animationData={ randomLottieSelect } 
            />

            {/* <SquareLibrary className={cn(
                                "h-20 w-20",
                                "text-neutral-400 stroke-neutral-400 pr-4")}
                        /> */}
        
            <div className="flex justify-center">
                
                <div className='pt-2 grid grid-cols-6 gap-2 justify-between'>
                    
                {challenges.map((challenge)=>(
                    <div key={challenge.id}>
                        <Button 
                            variant={
                                
                                wrongChallengesId.includes(challenge.id) ? 'danger' 
                                : doneChallengesId.includes(challenge.id) ? 'secondary' 
                                : 'default'
                                }

                            onClick={()=>onClickNumber(challenge.id + 1)}>
                            
                            <h1 className=
                                {Number(activeIndex) === (challenge.id) ? "overline" : ""}
                                >
                                {challenge.id % 1000}
                                {/* {challenge.id} */}
                            </h1>
                        </Button>
                    </div>
                    ))}
                </div>
            </div>
        </div>


        <div className="flex-1 mb-10">
            
            <div className="h-full flex items-center justify-center">
                <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-2">
                        
                {isDoneWrongChallenge 
                            && (
                                <h1 className="text-sm lg:text-lg text-center lg:text-start font-bold text-rose-500">
                                Задание выполнено неверно 😢
                                </h1>
                            )
                }

                {isDoneChallenge  
                    && !isDoneWrongChallenge && (
                        <h1 className="text-xs lg:text-sm text-center lg:text-start font-bold text-green-500">
                        Задание выполнено верно 👍
                        </h1>
                        )
                }

                    <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                        {title}
                    </h1>


                    <div>
                        {challenge.type === "ASSIST" && (
                            <QuestionBubble question={challenge.question}/>
                        )}

                        
                        <Challenge 
                            options={options}
                            onSelect={onSelect}
                            status={status}
                            selectedOption={selectedOption}
                            disabled={pending}
                            type={challenge.type}
                            isDoneWrongChallenge={isDoneWrongChallenge}
                            isDoneChallenge={isDoneChallenge}
                        />
                    </div>
                </div>
            </div>
        </div>

        <Footer 
            disabled={isDoneChallenge || pending || !selectedOption}
            status={status}
            onCheck={onContinue}
        />
    </>
    )
}







