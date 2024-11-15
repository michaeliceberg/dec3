// import { Button } from "@/components/ui/button"

// type Props = {
//     numSelect: number
//     onClick: (n:) => void
// }



// export const TaskSelector = ({
//     onClick,
//     numSelect,
// }: Props) => {
    
    

// const justNumbers = [
//     {
//         id: 1,
//         value: 1,
//         variant: 1,
//     },
//     {
//         id: 2,
//         value: 2,
//         variant: 1,
//     },
//     {
//         id: 3,
//         value: 3,
//         variant: 2,
//     },
//     {
//         id: 4,
//         value: 4,
//         variant: 2,
//     },
//     {
//         id: 5,
//         value: 5,
//         variant: 1,
//     },
// ]

//     // TODO:
//     const [currentNumber, setCurrentNumber] = useState(1)
//     const onClickNumber = (num: number) => {        
//         setCurrentNumber(num)
//         setActiveIndex(currentNumber)
//     }
    

//     return (
//         <div className="flex flex-1 justify-center mt-20">
//             <div className='pt-2 grid grid-cols-8 gap-4 justify-between mb-10'>
//             {justNumbers.map((n)=>(
//                 <div key={n.id}>
//                     <Button 
//                         variant={Number(numSelect) === (n.id) ? 'danger' : 'default'}
//                         onClick={()=>onClick(n.id)}>
//                         {n.value}
//                     </Button>
//                 </div>
//                 ))}
//             </div>
//         </div>
//     )
// }

