// import { neon } from '@neondatabase/serverless';
// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/neon-http';
// import * as schema from '../db/schema';

// const sql = neon(process.env.DATABASE_URL!);
// // @ts-ignore
// const db = drizzle(sql, { schema });
// const main = async () => {
// 	try {
// 		console.log('Seeding DB');
// 		await db.delete(schema.courses);
// 		await db.delete(schema.userProgress);
// 		await db.delete(schema.units);
// 		await db.delete(schema.lessons);
// 		await db.delete(schema.challenges);
// 		await db.delete(schema.challengeOptions);
// 		await db.delete(schema.challengeProgress);



// 		// ADD COURSES
// 		//
// 		await db.insert(schema.courses).values([{id:1,title:'ЛНИП Математика 7',imageSrc:'lnip_mat_7.svg'},
// 		{id:2,title:'ЛНИП Физика 7',imageSrc:'lnip_phy_7.svg'},
// 		{id:3,title:'ЛНИП Математика 6',imageSrc:'lnip_mat_6.svg'},]);
// 		// await db.insert(schema.courses).values([
// 		// 	{
// 		// 		id: 1,
// 		// 		title: 'Spanish',
// 		// 		imageSrc: '/es.svg',
// 		// 	},
// 		// 	{
// 		// 		id: 2,
// 		// 		title: 'Italian',
// 		// 		imageSrc: '/it.svg',
// 		// 	},
// 		// 	{
// 		// 		id: 3,
// 		// 		title: 'French',
// 		// 		imageSrc: '/fr.svg',
// 		// 	},
// 		// 	// {
// 		// 	// 	id: 4,
// 		// 	// 	title: 'Croatian',
// 		// 	// 	imageSrc: '/hr.svg',
// 		// 	// },
// 		// ]);



// 		// ADD UNITS
// 		//
// 		await db.insert(schema.units).values([
// 			{
// 				id: 1,
// 				courseId: 1, // Spanish
// 				title: 'Unit 1',
// 				description: 'Learn the basics of Spanish',
// 				order: 1,

// 			}
// 		])

// 		await db.insert(schema.units).values([
// 			{
// 				id: 2,
// 				courseId: 1, // Spanish
// 				title: 'Unit 2',
// 				description: 'Learn the basics of French',
// 				order: 2,

// 			}
// 		])



// 		// ADD LESSONS TO UNIT 1
// 		//
// 		await db.insert(schema.lessons).values([
// 			{
// 				id: 1,
// 				unitId: 1, // Unit 1 (learn the basics)
// 				order: 1,
// 				title: 'Lesson 1',

// 			},
// 			{
// 				id: 2,
// 				unitId: 1, // Unit 1 (learn the basics)
// 				order: 2,
// 				title: 'Lesson 2',

// 			},

// 			{
// 				id: 3,
// 				unitId: 1, // Unit 1 (learn the basics)
// 				order: 3,
// 				title: 'Lesson 3',

// 			},
// 			{
// 				id: 4,
// 				unitId: 1, // Unit 1 (learn the basics)
// 				order: 4,
// 				title: 'Lesson 4',

// 			},
// 			{
// 				id: 5,
// 				unitId: 1, // Unit 1 (learn the basics)
// 				order: 5,
// 				title: 'Lesson 5',

// 			},
// 		])



// 		// ADD LESSONS TO UNIT 2
// 		//
// 		await db.insert(schema.lessons).values([
// 			{
// 				id: 21,
// 				unitId: 2, // Unit 1 (learn the basics)
// 				order: 1,
// 				title: 'Lesson 21',

// 			},
// 			{
// 				id: 22,
// 				unitId: 2, // Unit 1 (learn the basics)
// 				order: 2,
// 				title: 'Lesson 22',

// 			},

// 			{
// 				id: 23,
// 				unitId: 2, // Unit 1 (learn the basics)
// 				order: 3,
// 				title: 'Lesson 23',

// 			},
			
// 		])




// 		// ADD CHALLENGES TO UNIT 1 LESSON 1
// 		//
// 		await db.insert(schema.challenges).values([
// 			{
// 				id: 1,
// 				lessonId: 1, // Nouns
// 				type: "SELECT",
// 				order: 1,
// 				question: 'Q1 Which one of these is the "man"?',
// 				points: 10,
// 			},

// 			{
// 				id: 2,
// 				lessonId: 1, // Nouns
// 				type: "ASSIST",
// 				order: 2,
// 				question: 'Q12 The "man"',
// 				points: 10,
// 			},

// 			{
// 				id: 3,
// 				lessonId: 1, // Nouns
// 				type: "SELECT",
// 				order: 3,
// 				question: 'Q13 Which one of these is the "robot"?',
// 				points: 10,
// 			},

// 			{
// 				id: 4,
// 				lessonId: 1, // Nouns
// 				type: "SELECT",
// 				order: 4,
// 				question: 'Q14 Which one of these is the "robot"?',
// 				points: 10,
// 			},

// 			{
// 				id: 5,
// 				lessonId: 1, // Nouns
// 				type: "SELECT",
// 				order: 5,
// 				question: 'Q15 Which one of these is the "robot"?',
// 				points: 10,
// 			},
			
// 		])



// 		// ADD CHALLENGES TO LESSON 2
// 		//
// 		await db.insert(schema.challenges).values([
// 			{
// 				id: 21,
// 				lessonId: 2, // Nouns
// 				type: "SELECT",
// 				order: 1,
// 				question: '2 Which one of these is the "man"?',
// 				points: 10,
// 			},

// 			{
// 				id: 22,
// 				lessonId: 2, // Nouns
// 				type: "ASSIST",
// 				order: 2,
// 				question: '2 The "man"',
// 				points: 10,
// 			},

// 			{
// 				id: 23,
// 				lessonId: 2, // Nouns
// 				type: "SELECT",
// 				order: 3,
// 				question: '2 Which one of these is the "robot"?',
// 				points: 10,
// 			},
			
// 		])


// 		// ADD CHALLENGES TO LESSON 3
// 		//
// 		await db.insert(schema.challenges).values([
// 			{
// 				id: 31,
// 				lessonId: 3, // Nouns
// 				type: "SELECT",
// 				order: 1,
// 				question: '3 Which one of these is the "man"?',
// 				points: 10,
// 			},

// 			{
// 				id: 32,
// 				lessonId: 3, // Nouns
// 				type: "ASSIST",
// 				order: 2,
// 				question: '3 The "man"',
// 				points: 10,
// 			},

// 			{
// 				id: 33,
// 				lessonId: 3, // Nouns
// 				type: "SELECT",
// 				order: 3,
// 				question: '3 Which one of these is the "robot"?',
// 				points: 10,
// 			},
			
// 		])



// 		// ADD CHALLENGES TO LESSON 4
// 		//
// 		await db.insert(schema.challenges).values([
// 			{
// 				id: 41,
// 				lessonId: 4, // Nouns
// 				type: "SELECT",
// 				order: 1,
// 				question: '4 Which one of these is the "man"?',
// 				points: 10,
// 			},

// 			{
// 				id: 42,
// 				lessonId: 4, // Nouns
// 				type: "ASSIST",
// 				order: 2,
// 				question: '4 The "man"',
// 				points: 10,
// 			},


			
// 		])


// 		// ADD CHALLENGES TO UNIT 2 LESSON 21
// 		//
// 		await db.insert(schema.challenges).values([
// 			{
// 				id: 201,
// 				lessonId: 21, // Nouns
// 				type: "SELECT",
// 				order: 1,
// 				question: 'Q1 Which one of these is the "man"?',
// 				points: 10,
// 			},

// 			{
// 				id: 202,
// 				lessonId: 21, // Nouns
// 				type: "ASSIST",
// 				order: 2,
// 				question: 'Q12 The "man"',
// 				points: 10,
// 			},
			
// 		])




// 		// ADD CHALLENGES OPTIONS TO Challenge 1
// 		//
// 		await db.insert(schema.challengeOptions).values([
// 			{
// 				challengeId: 1, // which is the man
// 				imageSrc: "/man.svg",
// 				correct: true,
// 				text: 'el hombre',
// 				audioSrc: '/es_man.mp3'
// 			},
// 			{
// 				challengeId: 1, 
// 				imageSrc: "/woman.svg",
// 				correct: false,
// 				text: 'la mujer',
// 				audioSrc: '/es_woman.mp3'
// 			},
// 			{
// 				challengeId: 1, 
// 				imageSrc: "/robot.svg",
// 				correct: false,
// 				text: 'el robot',
// 				audioSrc: '/es_robot.mp3'
// 			},
			
			
// 		])




	
// 		// ADD CHALLENGES OPTIONS TO Challenge 2
// 		//
// 		await db.insert(schema.challengeOptions).values([
// 			{
// 				challengeId: 2, // which is the man
// 				correct: true,
// 				text: 'el hombre',
// 				audioSrc: '/es_man.mp3'
// 			},
// 			{
// 				challengeId: 2, 
// 				correct: false,
// 				text: 'la mujer',
// 				audioSrc: '/es_woman.mp3'
// 			},
// 			{
// 				challengeId: 2, 
// 				correct: false,
// 				text: 'el robot',
// 				audioSrc: '/es_robot.mp3'
// 			},
			
			
// 		])


// 		// ADD CHALLENGES OPTIONS TO Challenge 3
// 		//
// 		await db.insert(schema.challengeOptions).values([
// 			{
// 				challengeId: 3, // which is the robot
// 				imageSrc: "/man.svg",
// 				correct: false,
// 				text: 'el hombre',
// 				audioSrc: '/es_man.mp3'
// 			},
// 			{
// 				challengeId: 3, 
// 				imageSrc: "/woman.svg",
// 				correct: false,
// 				text: 'la mujer',
// 				audioSrc: '/es_woman.mp3'
// 			},
// 			{
// 				challengeId: 3, 
// 				imageSrc: "/robot.svg",
// 				correct: true,
// 				text: 'el robot',
// 				audioSrc: '/es_robot.mp3'
// 			},
			
			
// 		])


// 		// ADD CHALLENGES OPTIONS TO Challenge 4
// 		//
// 		await db.insert(schema.challengeOptions).values([
// 			{
// 				challengeId: 4, // which is the robot
// 				imageSrc: "/man.svg",
// 				correct: false,
// 				text: 'el hombre',
// 				audioSrc: '/es_man.mp3'
// 			},
// 			{
// 				challengeId: 4, 
// 				imageSrc: "/woman.svg",
// 				correct: false,
// 				text: 'la mujer',
// 				audioSrc: '/es_woman.mp3'
// 			},
// 			{
// 				challengeId: 4, 
// 				imageSrc: "/robot.svg",
// 				correct: true,
// 				text: 'el robot',
// 				audioSrc: '/es_robot.mp3'
// 			},
			
			
// 		])


// 		// ADD CHALLENGES OPTIONS TO Challenge 5
// 		//
// 		await db.insert(schema.challengeOptions).values([
// 			{
// 				challengeId: 5, // which is the robot
// 				imageSrc: "/man.svg",
// 				correct: false,
// 				text: 'el hombre',
// 				audioSrc: '/es_man.mp3'
// 			},
// 			{
// 				challengeId: 5, 
// 				imageSrc: "/woman.svg",
// 				correct: false,
// 				text: 'la mujer',
// 				audioSrc: '/es_woman.mp3'
// 			},
// 			{
// 				challengeId: 5, 
// 				imageSrc: "/robot.svg",
// 				correct: true,
// 				text: 'el robot',
// 				audioSrc: '/es_robot.mp3'
// 			},




			
			
// 		])



// 		// ADD CHALLENGES OPTIONS TO Challenge 201
// 		//
// 		await db.insert(schema.challengeOptions).values([
// 			{
// 				challengeId: 201, // which is the man
// 				imageSrc: "/man.svg",
// 				correct: true,
// 				text: 'el hombre',
// 				audioSrc: '/es_man.mp3'
// 			},
// 			{
// 				challengeId: 201, 
// 				imageSrc: "/woman.svg",
// 				correct: false,
// 				text: 'la mujer',
// 				audioSrc: '/es_woman.mp3'
// 			},
// 			{
// 				challengeId: 201, 
// 				imageSrc: "/robot.svg",
// 				correct: false,
// 				text: 'el robot',
// 				audioSrc: '/es_robot.mp3'
// 			},
			
			
// 		])
		
// 		// await db.insert(schema.challenges).values([
// 		// 	{
// 		// 		id: 4,
// 		// 		lessonId: 2, // Verbs
// 		// 		type: "SELECT",
// 		// 		order: 1,
// 		// 		question: 'Which one of these is the "man"?',
// 		// 	},

// 		// 	{
// 		// 		id: 5,
// 		// 		lessonId: 2, // Verbs
// 		// 		type: "ASSIST",
// 		// 		order: 2,
// 		// 		question: 'The "man"',
// 		// 	},

// 		// 	{
// 		// 		id: 6,
// 		// 		lessonId: 2, // Verbs
// 		// 		type: "SELECT",
// 		// 		order: 3,
// 		// 		question: 'Which one of these is the "robot"?',
// 		// 	},
			
// 		// ])

// 		// await db.insert(schema.challengeOptions).values([
// 		// 	{
// 		// 		challengeId: 4, // which is the man
// 		// 		imageSrc: "/man.svg",
// 		// 		correct: true,
// 		// 		text: 'el hombre',
// 		// 		audioSrc: '/es_man.mp3'
// 		// 	},
// 		// 	{
// 		// 		challengeId: 4, 
// 		// 		imageSrc: "/woman.svg",
// 		// 		correct: false,
// 		// 		text: 'la mujer',
// 		// 		audioSrc: '/es_woman.mp3'
// 		// 	},
// 		// 	{
// 		// 		challengeId: 4, 
// 		// 		imageSrc: "/robot.svg",
// 		// 		correct: false,
// 		// 		text: 'el robot',
// 		// 		audioSrc: '/es_robot.mp3'
// 		// 	},
			
			
// 		// ])


// 		// await db.insert(schema.challengeOptions).values([
// 		// 	{
// 		// 		challengeId: 5, // which is the man
// 		// 		correct: true,
// 		// 		text: 'el hombre',
// 		// 		audioSrc: '/es_man.mp3'
// 		// 	},
// 		// 	{
// 		// 		challengeId: 5, 
// 		// 		correct: false,
// 		// 		text: 'la mujer',
// 		// 		audioSrc: '/es_woman.mp3'
// 		// 	},
// 		// 	{
// 		// 		challengeId: 5, 
// 		// 		correct: false,
// 		// 		text: 'el robot',
// 		// 		audioSrc: '/es_robot.mp3'
// 		// 	},
			
			
// 		// ])


// 		// await db.insert(schema.challengeOptions).values([
// 		// 	{
// 		// 		challengeId: 6, // which is the robot
// 		// 		imageSrc: "/man.svg",
// 		// 		correct: false,
// 		// 		text: 'el hombre',
// 		// 		audioSrc: '/es_man.mp3'
// 		// 	},
// 		// 	{
// 		// 		challengeId: 6, 
// 		// 		imageSrc: "/woman.svg",
// 		// 		correct: false,
// 		// 		text: 'la mujer',
// 		// 		audioSrc: '/es_woman.mp3'
// 		// 	},
// 		// 	{
// 		// 		challengeId: 6, 
// 		// 		imageSrc: "/robot.svg",
// 		// 		correct: true,
// 		// 		text: 'el robot',
// 		// 		audioSrc: '/es_robot.mp3'
// 		// 	},
			
			
// 		// ])

// 		console.log('Seeding Finished');
// 	} catch (error) {
// 		console.error(error);
// 		throw new Error('Не получилось получить БД');
// 	}
// };

// main();
