import Image from "next/image"
import { Button } from "./ui/button"
import Link from "next/link"
// import { quests } from "@/constants"
import { Progress } from "./ui/progress"


type Props = {
    points: number
    hwList: number[]
}



export const Quests = ({ points, hwList } : Props) => {

    const quests = [
        {
            title: 'Реши ' +  hwList[0] + ' задач',
            value: hwList,
        },
    ]   


  return (
    <div className="border-2 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between w-full space-y-2">
            <h3 className="font-bold text-lg">
                Квесты
            </h3>
            <Link href='/progress'>
                <Button
                    size='sm'
                    variant='primaryOutline'
                >
                    Подробнее
                </Button>
            </Link>
        </div>

        <ul className="w-full space-y-4">
            
                {quests.map((quest)=>{
                    // const progress = (points / quest.value) * 100
                    const progress = (quest.value[1] / quest.value[0]) * 100

                            return (
                                <div
                                    className="flex items-center w-full pb-4 gap-x-3"    // border-t-2
                                    key = {quest.title}
                                >
                                    <Image 
                                        src = '/points.svg'
                                        alt = 'Points'
                                        width={40}
                                        height={40}
                                    />
                                    <div className="flex flex-col gap-y-2 w-full">
                                        
                                        <div className="flex flex-1 justify-between">
                                            <p className="text-text-neutral-700 text-sm font-bold">
                                                {quest.title}
                                            </p>

                                            <p className="text-text-neutral-700 text-sm font-bold">
                                            {hwList[1]}/{hwList[0]}
                                            </p>
                                        </div>

                                        <Progress 
                                            value={progress}
                                            className="h-2"
                                        />
                                    </div>
                                </div>
                            )
                })}
            

        </ul>

    </div>
  )
}
