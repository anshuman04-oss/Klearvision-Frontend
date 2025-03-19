import { motion } from "framer-motion";

function Home() {
    return (
        <>
            <div className="relative h-screen items-center text-gray-50 mt-5 rounded rounded-sm w-full">
                {/* Content that appears behind the "fog" */}
                <div className="text-4xl font-bold">This is Home Page</div>
            </div>
        </>
    );
}

export default Home;




// function Home() {

//     return (
//         <>
//             <div>
//                 <div className="bg-gray-900 text-gray-50 text-4xl m-4 p-4 ">
//                     This is Home Page
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Home