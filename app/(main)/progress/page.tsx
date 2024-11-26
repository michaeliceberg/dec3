import { FeedWrapper } from "@/components/feed-wrapper"
import { StickyWrapper } from "@/components/sticky-wrapper"
import { Progress } from "@/components/ui/progress"
import { UserProgress } from "@/components/user-progress"
import { getChallengeProgress, getUnits, getUserProgress, getUserSubscription } from "@/db/queries"
import Image from "next/image"
import { redirect } from "next/navigation"

import { format } from 'date-fns';
import { Button } from "@/components/ui/button"
import { getUserPointsHearts } from "@/usefulFunctions"
import { Achievement } from "@/components/achievments"
import { BuyMine } from "@/components/buy-mine"


const ProgressPage = async () => {

    const userProgressData = getUserProgress()
    const userSubscriptionData = getUserSubscription()
    
    const unitsData = getUnits()
    const challengeProgressData = getChallengeProgress()

    const [
        userProgress,
        userSubscription,

        units,
        challengeProgress,
    ] = await Promise.all([
        userProgressData,
        userSubscriptionData,

        unitsData,
        challengeProgressData,
    ])

    if (!userProgress || !userProgress.activeCourse) {
        redirect('/courses')
    }


	if (!challengeProgress) {
        redirect('/learn')
    }

    const isPro = !!userSubscription?.isActive











	const allChallengesInCourse:number[] = []

	const infoUnitsStat = units.map((unit, index) => {
				
		const doneRightInLesson = unit.lessons.map((lesson, lessonIndex) => {
			
			let doneRight = 0
			let doneWrong = 0
			let numChallengesInLesson = 0

			const doneRightChallenges = lesson.challenges.map((challenge) => {
				//
				allChallengesInCourse.push(challenge.id)
				//
				if (lesson.id === challenge.lessonId) {

					numChallengesInLesson += 1

					if (challenge.challengeProgress) {
						
						if (challenge.challengeProgress[0]?.completed) {
							if (challenge.challengeProgress[0].doneRight) {
								doneRight += 1
							} else {
								doneWrong += 1
							}
						}
					}
					}
				})

			

			return {
				lesson: lesson.id,
				unitId: unit.id,
				unitTitle: unit.title,
				done: [ numChallengesInLesson,  doneRight, doneWrong],
				// percentageDoneLesson: Math.round((doneRight+doneWrong)/numChallengesInLesson * 100) / 100 
				// percentageDoneLesson:(doneRight+doneWrong)/numChallengesInLesson 
				percentageDoneLesson: Math.round(100*(doneRight+doneWrong)/numChallengesInLesson)
			}
		})
		

		return {
			doneRightInLesson,
		}})


	interface lessonDone {
		lesson: number;
		done: number[];
		unitId: number;
		unitTitle: string;
		percentageDoneLesson: number;
	}





	// console.log(infoUnitsStat[1].doneRightInLesson)




	let lessonStat: Array<lessonDone> = [];

	const newList = infoUnitsStat.map(unit => {
		unit.doneRightInLesson.map(lesson => {
			lessonStat.push(lesson)
			return lesson
		})
	})


	const UniqueUnitIds = lessonStat.map(el => el.unitId)
	.filter(
		(value, index, current_value) => current_value.indexOf(value) === index
	);

	let UnitsLessonsPercentage = []

	

	const unitStat = UniqueUnitIds.map(unitId => {
		
		let toDone = 0
		let doneRight = 0
		let doneWrong = 0
		let percentageDoneLesson = 0
		let unitTitle = ''

		lessonStat.map(el => {
			if (el.unitId === unitId) {
				toDone = toDone + el.done[0]
				doneRight = doneRight + el.done[1]
				doneWrong = doneWrong + el.done[2]
				unitTitle = el.unitTitle
				percentageDoneLesson =  Math.round((doneRight + doneWrong) / toDone * 100) / 100 
			}
		})


		// console.log(lessonStat)


		return (
			{
				unitId: unitId,
				unitTitle: unitTitle,
				toDone: toDone,
				doneRight: doneRight,
				doneWrong: doneWrong,
				percentageDone: (doneRight+doneWrong)/toDone,
			}
		)
	})

	lessonStat.sort((a, b) => (a.percentageDoneLesson > b.percentageDoneLesson ? -1 : 1));


	let numWholeChallenge:number = lessonStat.reduce((total, lesson)=> total + lesson.done[0], 0 )
	let numDoneChallenge:number = lessonStat.reduce((total, lesson)=> total + lesson.done[1] + lesson.done[2], 0 )
	let numLeftChallenge:number = numWholeChallenge - numDoneChallenge

	var dateExam = new Date(2025, 4, 1);
	var dateNow = new Date()
	var diff = Math.abs(dateExam.getTime() - dateNow.getTime());
	var daysTillExam = Math.ceil(diff / (1000 * 3600 * 24)); 
	// console.log("daysTillExam: " + daysTillExam);
	
	const Recom_ChalPerDay = Math.round(numLeftChallenge / daysTillExam * 100) / 100
	const lastWeekChallenges = challengeProgress.filter(challenge => {
	
	var diff = Math.abs(challenge.dateDone.getTime() - dateNow.getTime());
	
	var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 

	if (allChallengesInCourse.includes(challenge.challengeId) && diffDays < 8)
			return true
	})

	
	const challengesInWeek:number = lastWeekChallenges.length
	let current_ChalPerDay = challengesInWeek > 0 
		? Math.round(challengesInWeek / 7 * 100) / 100 
		: 1
	
	let daysToFinishWYS = Math.round(numLeftChallenge / current_ChalPerDay)

	// console.log(daysToFinishWYS)

	const dateDone = new Date(dateNow.getTime() + daysToFinishWYS*(1000 * 60 * 60 * 24));
	const formattedDate: string = format(dateDone, 'dd.MM.yyyy');
	const YourDaysLate:number = daysToFinishWYS - daysTillExam





	const RecomNumChallengesToday:number = Math.round(Recom_ChalPerDay*4)





	let quests = [ 
		{
			title: 'Задание сегодня',
			value: [0, 0, 0]
		},
	]




	// ГРУЗИМ HW
	//
	let hwList = [0, 0, 0]
	//
	let oldCourseProgress = userProgress.courseProgress
	if (oldCourseProgress instanceof Array) {
        let indexCourse = oldCourseProgress.findIndex( el => el.course === userProgress.activeCourse?.title );
        //
		let lastProgress = oldCourseProgress[indexCourse].progress[oldCourseProgress[indexCourse].progress.length - 1]
        if (indexCourse > -1){
            //
            // Эта книга УЖЕ есть в прогрессе,
            // ищем индекс Сегодняшней ДАТЫ
            //
			let lastProgress = oldCourseProgress[indexCourse].progress[oldCourseProgress[indexCourse].progress.length - 1]
			let hwList = lastProgress.hw
			quests[0].value = hwList
        }
    }












	const [Points, Hearts, Gems] = getUserPointsHearts(userProgress)


    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress 
                    activeCourse={userProgress.activeCourse}
                    hearts={Hearts}
                    points={Points}
					gems={Gems}
                    hasActiveSubscription={isPro}
                />

			<Achievement />
            </StickyWrapper>
            
            <FeedWrapper>
                    
                <div className="w-full flex flex-col items-center mb-10">
                    <Image
                        src='/quests.svg'
                        alt='Quests'
                        height={90}
                        width={90}
                    />   
                    <h1 className="text-center font-bold text-neural-800 text-2xl my-6">
                        Прогресс
                    </h1>
                    <p className="text-muted-foreground text-center text-lg mb-6">
                        Выполняйте квесты и зарабатывайте очки
                    </p>



				
					



				<div className="flex items-center w-full p-4 gap-x-4 border-t-2">
				
				
				
				{/* <BuyMine /> */}










            </div>







                    <ul className="w-full pt-5">
						{/* 
						//
						// Прогрес КВЕСТОВ
						//
						*/}
                        {quests.map((quest)=>{
                            const progress = (quest.value[1] / quest.value[0]) * 100

                            return (

									<div key={quest.title}>

                                    <Image 
                                        src = '/points.svg'
                                        alt = 'Points'
                                        width={60}
                                        height={60}
                                    />
                                    <div className="flex flex-col gap-y-2 w-full">




									<div className="flex flex-1 justify-between">
										<p className="text-text-neutral-700 text-m font-bold">
											{quest.title}
											: реши любые {quest.value[0]} номеров
										</p>

										<p className="text-text-neutral-700 text-sm font-bold">
											{ (quest.value[1] === quest.value[0]) 
											? "готово" 
											: quest.value[1] + "/" + quest.value[0]}
										</p>
									</div>




                                        {/* <p className="text-text-neutral-700 text-xl font-bold">
                                            {quest.title}
                                        </p> */}
                                        <Progress 
                                            value={progress}
                                            className="h-3"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </ul>
                    
                </div>

            

                <div className="border-2 rounded-xl p-4 space-y-2">

				<div className="mb-7 mt-5">
					

                        <h3 className="font-bold text-lg text-center">
                            Процент решения задачника {userProgress.activeCourse.title} по разделам:
                        </h3>
						
						<div className="mt-5 flex flex-1 justify-center">
							<h3 className="mr-4">
								Всего задач: 
							</h3>
							<h3>
								{numWholeChallenge}
							</h3>
						</div>

						<div className="mt-1 flex flex-1 justify-center">
							<h3 className="mr-4">
								Вами решено: 
							</h3>
							<h3>
								{numDoneChallenge} ({Math.round(numDoneChallenge / numWholeChallenge * 100)}%) 
							</h3>
						</div>

						<div className="mt-1 flex flex-1 justify-center">
							<h3 className="mr-4">
								Ваша скорость: 
							</h3>
							<h3>
								{Math.round(current_ChalPerDay*10)/10} задач/день
							</h3>
						</div>

						<div className="mt-1 flex flex-1 justify-center">
							<h3 className="mr-4">
								С этой скоростью вы завершите задачник: 
							</h3>
							<h3>
								{formattedDate}
							</h3>
						</div>




                    </div>
                    <div className="grid grid-cols-9 auto-rows-auto gap-1">
                            {infoUnitsStat.map((unit, index) => 
                                <div key={index} className="p-2 flex flex-col items-center">
                                    {unit.doneRightInLesson[0].unitTitle.slice(0, 5)}
                                </div>
                            )}
                    </div>


                    <div className="grid grid-cols-9 auto-rows-auto gap-1">
                        
                        {infoUnitsStat.map((unit, index) => 
                            
                            <div key={index*123} className="p-2 flex flex-col items-center">
                                
                                {unit.doneRightInLesson.map((lessonStat,index) => 
									// 
                                    <Button key={index*203} className=
									{
										lessonStat.percentageDoneLesson === 0 
										? "w-full mb-3 bg-white border-slate-200 border-2 hover:bg-slate-100 text-slate-500"
                                    	: lessonStat.percentageDoneLesson < 20
										? "w-full mb-3 bg-green-500/5 text-green-500 border-green-300 border-2 hover:bg-sky-500/20 transition-none"
                                    	: lessonStat.percentageDoneLesson < 40
										? "w-full mb-3 bg-green-500/10 text-green-500 border-green-300 border-2 hover:bg-sky-500/20 transition-none"
                                    	: lessonStat.percentageDoneLesson < 80
										? "w-full mb-3 bg-green-500/20 text-green-500 border-green-300 border-2 hover:bg-sky-500/20 transition-none"
										: "w-full mb-3 bg-green-500/30 text-green-500 border-green-300 border-2 hover:bg-sky-500/20 transition-none"
									}>
									    {/* {(lessonStat.percentageDoneLesson * 100)} */}
									    {(lessonStat.percentageDoneLesson)}

                                    </Button>

                                )}                        

                            </div>
                        )}
                    </div>
                
                </div>
     



            </FeedWrapper>

            
        </div>
    )
}

export default ProgressPage


