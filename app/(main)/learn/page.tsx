import { FeedWrapper } from '@/components/feed-wrapper';
import { StickyWrapper } from '@/components/sticky-wrapper';
import { UserProgress } from '@/components/user-progress';
import { getChallengeProgress, getCourseProgress, getUnits, getUserProgress } from '@/db/queries';
import { redirect } from 'next/navigation';
import { Header } from './header';
import { Unit } from './unit';
import { userProgress as userProgressSchema, lessons, progressType, units as unitsSchema, SuperType } from '@/db/schema';

import { format } from 'date-fns';
import { Promo } from '@/components/promo';
import { Quests } from '@/components/quests';
import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { auth, currentUser } from "@clerk/nextjs/server"



const LearnPage = async () => {
	const { userId } = await auth();
	const user = await currentUser();

	if (!userId || !user) {
		throw new Error('Вы не авторизированны!');
	}

	const userProgressData = getUserProgress()
	// const lessonPercentageData = getLessonPercentage()
	const courseProgressData = getCourseProgress()
	const challengeProgressData = getChallengeProgress()

	const unitsData = getUnits()

	
	const [
		userProgress,
		units,
		courseProgress,
		// lessonPercentage,
		challengeProgress,

	] = await Promise.all([
		userProgressData,
		unitsData,
		courseProgressData,
		// lessonPercentageData,
		challengeProgressData,
	]);

	if (!userProgress || !userProgress.activeCourse) {
		redirect('/courses');
	}

	if (!courseProgress) {
		redirect('/courses')
	}

	if (!challengeProgress){
        redirect('/learn')
    }


	

	// TODO:   NEW NEW NEW NEW
	
	const challengesDoneWrong = challengeProgress.filter(function(v, i) {
        return (v.doneRight == false);
      })
    
	const challengesDone = challengeProgress.filter(function(v, i) {
	return (v.completed == true);
	})


	// console.log('------------------------------------------------------------------------')
	
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
				percentageDoneLesson: Math.round((doneRight+doneWrong)/numChallengesInLesson * 100) / 100 
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

	// Сортируем по убыванию Процента Решенных Лессонов
	//
	lessonStat.sort((a, b) => (a.percentageDoneLesson > b.percentageDoneLesson ? -1 : 1));

	// Убираем Lesson'ы , которые решены на 100%
	// Чтобы не давать Оттуда ДЗ
	//
	let lessonStat_NO_finished: Array<lessonDone> = lessonStat.filter(el => el.percentageDoneLesson != 1)


	let numWholeChallenge:number = lessonStat.reduce((total, lesson)=> total + lesson.done[0], 0 )
	let numDoneChallenge:number = lessonStat.reduce((total, lesson)=> total + lesson.done[1] + lesson.done[2], 0 )
	let numLeftChallenge:number = numWholeChallenge - numDoneChallenge

	var dateExam = new Date(2025, 4, 1);
	var dateNow = new Date()
	var diff = Math.abs(dateExam.getTime() - dateNow.getTime());
	var daysTillExam = Math.ceil(diff / (1000 * 3600 * 24)); 
	console.log("daysTillExam: " + daysTillExam);
	
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

	// console.log('RecomNumChallengesToday')
	// console.log(RecomNumChallengesToday)



	// let hw_num_1 = Math.round(RecomNumChallengesToday * 0.4)
	// let hw_num_2 = Math.round(RecomNumChallengesToday * 0.4)
	// let hw_num_3 = RecomNumChallengesToday - hw_num_1 - hw_num_2


	// console.log(hw_num_1)
	// console.log(hw_num_2)
	// console.log(hw_num_3)

	// const hw_nums_list = [hw_num_1, hw_num_2, hw_num_3]


	// const CountNumsLeft = (doneList:number[]) => {
	// 	return doneList[0]-doneList[1]-doneList[2]
	// }



	// interface Type_HwList {
	// 	lesson: number;
	// 	unitId: number;
	// 	numChallenges: number;
	// }


	// let HwList: Array<Type_HwList> = [];



	// let count = RecomNumChallengesToday
	// //
	// for (var i = 0; i < lessonStat_NO_finished.length; i++) {
	// 	if (CountNumsLeft(lessonStat_NO_finished[i].done) < hw_nums_list[i])
		
	// 	if (count == 0) {
	// 		break;
	// 	}
	// }



	// if (not_done_les_1 < hw_num_1) {
	// 	hw_num_2 = hw_num_2 + hw_num_1 - not_done_les_1
	// 	HwList.push({
	// 		lesson: lessonStat_NO_finished[0].lesson,
	// 		unitId: lessonStat_NO_finished[0].unitId,
	// 		numChallenges: not_done_les_1
	// 	})
	// } else {
	// 	HwList.push({
	// 		lesson: lessonStat_NO_finished[0].lesson,
	// 		unitId: lessonStat_NO_finished[0].unitId,
	// 		numChallenges: hw_num_1
	// 	})
	// }


	// if (not_done_les_2 < hw_num_2) {
	// 	hw_num_3 = hw_num_3 + hw_num_2 - not_done_les_2
	// 	HwList.push({
	// 		lesson: lessonStat_NO_finished[1].lesson,
	// 		unitId: lessonStat_NO_finished[1].unitId,
	// 		numChallenges: not_done_les_2
	// 	})
	// } else {
	// 	HwList.push({
	// 		lesson: lessonStat_NO_finished[1].lesson,
	// 		unitId: lessonStat_NO_finished[1].unitId,
	// 		numChallenges: hw_num_2
	// 	})
	// }


	// if (not_done_les_3 < hw_num_3) {
	// 	hw_num_4 = hw_num_4 + hw_num_3 - not_done_les_3
	// 	HwList.push({
	// 		lesson: lessonStat_NO_finished[1].lesson,
	// 		unitId: lessonStat_NO_finished[1].unitId,
	// 		numChallenges: not_done_les_2
	// 	})
	// } else {
	// 	HwList.push({
	// 		lesson: lessonStat_NO_finished[1].lesson,
	// 		unitId: lessonStat_NO_finished[1].unitId,
	// 		numChallenges: hw_num_2
	// 	})
	// }






	// HW HW HW HW HW HW HW HW 

	let Points:number = 0
	let Hearts:number = 0
	let Gems:number = 0

	let hwList:number[] = [RecomNumChallengesToday, 0, 0]

	var today = new Date();
    var dd:number = today.getDate();
    var mm:number = today.getMonth()+1; 
    var yyyy:number = today.getFullYear();
    var TodayStr = dd + "."  + mm + "." + yyyy
    

	let oldCourseProgress = userProgress.courseProgress



	// ОТКРЫЛИ ГЛАВНУЮ СТРАНИЦУ И ХОТИМ УВИДЕТЬ "СТАТУС" ДОМАШНЕГО ЗАДАНИЯ СПРАВА

	if (oldCourseProgress instanceof Array) {
        //
        // Ищем Индекс название книги:
        //        
        let indexCourse = oldCourseProgress.findIndex( el => el.course === userProgress.activeCourse?.title );
		//
        if (indexCourse > -1){
            //
            // Эта книга УЖЕ есть в прогрессе,
            // ищем индекс Сегодняшней ДАТЫ
            //
            let currentProgress:progressType = oldCourseProgress[indexCourse].progress
			//
            if (currentProgress instanceof Array) {
                let indexDate = currentProgress.findIndex( el => el.date === TodayStr );
                if (indexDate > -1){
					//
                    //
                    // Нашли ДАТУ
                    // Обновляем данные в найденной КНИГЕ найденной ДАТЕ
                    //
					hwList  = oldCourseProgress[indexCourse].progress[indexDate].hw
					Points = oldCourseProgress[indexCourse].progress[indexDate].pts
					Hearts = oldCourseProgress[indexCourse].progress[indexDate].hearts

                } else {
                    
					let lastProgress = oldCourseProgress[indexCourse].progress[oldCourseProgress[indexCourse].progress.length - 1]
                    //
                    // ДАТУ НЕ нашли. Создаем НОВОЕ ДЗ . Добавляем новое ДЗ с ДАТОЙ
                    //
					hwList = [RecomNumChallengesToday, 0, 
						lastProgress.hw[1] === lastProgress.hw[0]
                            ? lastProgress.hw[2] += 1
                            : 0
					]
					
					oldCourseProgress[indexCourse].progress.push({
                        date: TodayStr,
                        hw: hwList,
                        selfDoneRight: 0,
                        selfDoneWrong: 0,
                        dateReady: '01.01.2125',
                        hearts: 20,
                        pts: lastProgress.pts,
						gems: lastProgress.gems
                    })

					Points = lastProgress.pts
					Gems = lastProgress.gems
					Hearts = 20

                    await db.update(userProgressSchema).set({
						points: 0,
						courseProgress: oldCourseProgress
                    }).where(eq(userProgressSchema.userId, userId))
					
                }
            }

               
            } 
            
			//
            // Книги еще нет, ПЕРВЫЙ РАЗ пользователь открыл САЙТ еще БЕЗ ПРОГРЕССА
            // 
            //
            else {
                
				hwList = [RecomNumChallengesToday, 0, 0]

				let newCourseProgress:SuperType = [{
					course: userProgress.activeCourse.title,
				progress:[{
					date: TodayStr,
					hw: hwList,
					selfDoneRight: 0,
					selfDoneWrong: 0,
					dateReady: '01.01.2125',
					hearts: 20,
					pts: 0,
					gems: 0,
					}]
				}]

				oldCourseProgress.push(newCourseProgress[0])

                await db.update(userProgressSchema).set({
                    points: 0,
                    courseProgress: oldCourseProgress
            
                }).where(eq(userProgressSchema.userId, userId))
            }
        } 



	// const numbers = [1, 2, 3, 4];
	// const filteredNumbers = someData.map((num, index) => {
	// 	return {
	// 		el: index
	// 	}
	// });
	
	// const normalizedData = units[0].lessons
	// 	.map((lesson, ind_lesson)=>(lesson.challenges
	// 	.map((challenge, cha_ind)=>(challenge.challengeProgress[0])
	// )))
	  
	// console.log(normalizedData)
	// console.log('hello')

	// const bigState = normalizedData.map(el=> el)

	// const arr = [
	// 	{name: 'вася', age: 20, money: 500},
	// 	{name: 'коля', age: 17, money: 1500},
	// 	{name: 'вписка', age: 30, money: 2500},
	// 	{name: 'бум', age: 35, money: 50},
	// 	{name: 'хова', age: 15, money: 10},
	// 	{name: 'мел', age: 90, money: 5000},
	// ]
	
	// const new_arr = arr.filter(el =>  el.age>30)
	// const new_arr_2 = arr.filter(el =>  {
	// 	if (el.age>30) {
	// 		return el
	// 	}
	// })

	// const new_arr_reduce = arr.reduce((total, elem) => {
	// 	return (
	// 		total + elem.money
	// 	)
	// }, 0)

	// const hova = arr.find(elem=>elem.name==='хова')
	
	// const hovaIndex = arr.findIndex(elem => elem.name === 'хова')

	// console.log(new_arr_2)
	// console.log(new_arr_reduce)
	// console.log(hova)
	// console.log(hovaIndex)

	// const sumBudget = arr
	// 	.filter(elem => elem.age > 25)
	// 	.map(elem => {
	// 		return {
	// 			disco: elem.money,
	// 			facimilie: 'Mr. ' + elem.name,
	// 		}
	// 	})
	// 	.reduce((total, elem) => {
	// 		return (
	// 			total + elem.disco
	// 		)
	// 	}, 0)

	// console.log(sumBudget)

	
	// console.log(unitStat.filter(el=>el.unitId===1008))

	return (
		<div className='flex flex-row-reverse gap-[48px] px-6'>
			<StickyWrapper>
				<UserProgress 
					activeCourse={userProgress.activeCourse} 
					hearts={Hearts} 
					points={Points} 
					gems={Gems}
					
					hasActiveSubscription={false} 
				/>

			<Promo YourDaysLate={YourDaysLate} formattedDate={formattedDate}/>
			<Quests points={Points} hwList={hwList} />
				
			</StickyWrapper>


			<FeedWrapper>
				<Header title={userProgress.activeCourse.title} />
				{units.map((unit)=>(
				
					<div key={unit.id} className='mb-10'>
						<Unit 
							id={unit.id}
							order={unit.order}
							description={unit.description}
							title={unit.title}
							lessons={unit.lessons}
							activeLesson={courseProgress.activeLesson as typeof lessons.$inferSelect & {
								unit: typeof unitsSchema.$inferSelect
							} | undefined}
							// activeLessonPercentage={lessonPercentage}
							lessonStat={lessonStat}
							percentageDone={unitStat.filter(el=>el.unitId===unit.id)[0].percentageDone}
							imgSrc={unit.imageSrc}
							// challengesDoneWrong={challengesDoneWrong}
							// challengesDone={challengesDone}
							RecomNumChallengesToday={RecomNumChallengesToday}
						/>
					</div>
				))}

				
			
			</FeedWrapper>
		</div>
	);
};

export default LearnPage;
