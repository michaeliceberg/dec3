import { SuperType, progressType } from './db/schema';

type Props = {
    hearts: number;
    userId: string;
    userName: string;
    userImageSrc: string;
    activeCourseId: number | null;
    points: number;
    courseProgress: SuperType;
    activeCourse: {
        id: number;
        title: string;
        imageSrc: string;
    } | null;}


export const getUserPointsHearts = (userProgress: Props) => {

  
	var today = new Date();
    var dd:number = today.getDate();
    var mm:number = today.getMonth()+1; 
    var yyyy:number = today.getFullYear();
    var TodayStr = dd + "."  + mm + "." + yyyy
    let Points = 0
    let Hearts = 0
    let Gems = 0
    let oldCourseProgress = userProgress.courseProgress
	if (oldCourseProgress instanceof Array) {
        let indexCourse = oldCourseProgress.findIndex( el => el.course === userProgress.activeCourse?.title );
        //
        if (indexCourse > -1){
            //
            // Эта книга УЖЕ есть в прогрессе,
            // ищем индекс Сегодняшней ДАТЫ
            //
            let currentProgress:progressType = oldCourseProgress[indexCourse].progress
            if (currentProgress instanceof Array) {
                let indexDate = currentProgress.findIndex( el => el.date === TodayStr );
                if (indexDate > -1){
					//
					Points = oldCourseProgress[indexCourse].progress[indexDate].pts
					Hearts = oldCourseProgress[indexCourse].progress[indexDate].hearts
					Gems = oldCourseProgress[indexCourse].progress[indexDate].gems
                }
            }
        }
    }
  
  
    return [Points, Hearts, Gems]
}





