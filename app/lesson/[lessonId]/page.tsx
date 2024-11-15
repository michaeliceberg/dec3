import { getChallengeProgress, getLesson, getUserProgress } from "@/db/queries"
import { redirect } from "next/navigation"
import { Quiz } from "../quiz"
import { getUserPointsHearts } from "@/usefulFunctions"

type Props = {
    params: {
        lessonId: number
    }
}

const LessonIdPage =  async ({
    params,
}: Props) => {
    const lessonData = getLesson(params.lessonId)
    const userProgressData = getUserProgress()
    const challengeProgressData = getChallengeProgress()

    const [
        lesson,
        userProgress,
        challengeProgress,
    ] = await Promise.all([
        lessonData,
        userProgressData,
        challengeProgressData,
    ])

    if (!lesson || !userProgress || !challengeProgress){
        redirect('/learn')
    }


    // const activeCourseTitle = !!userProgress.activeCourse 
    //     ? userProgress.activeCourse.title 
    //     : ''



    const activeCourseTitle = !!userProgress.activeCourse 
    ? userProgress.activeCourse.title 
    : ''


    const oldCourseProgress = userProgress.courseProgress
    
    
    

    const initialPercentage = lesson.challenges
    .filter((challenge)=>challenge.completed)
    .length / lesson.challenges.length * 100



    const [initialPoints, initialHearts] = getUserPointsHearts(userProgress)


    console.log('-----in [] ----')
    console.log(initialHearts)



    return(
        <Quiz 
            initialLessonId={lesson.id}
            initialLessonChallenges={lesson.challenges}
            // initialHearts={userProgress.hearts}
            initialHearts={initialHearts}

            
            initialPercentage={initialPercentage}
            userSubscription={null} //TODO:
            challengeProgress={challengeProgress}        
            lessonTitle={lesson.title}    
            oldCourseProgress={oldCourseProgress}
            activeCourseTitle={activeCourseTitle}
        />
    )
}

export default LessonIdPage