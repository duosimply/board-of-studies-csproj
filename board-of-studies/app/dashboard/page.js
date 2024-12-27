import SemBox from "../components/SemBox"

const Dashboard = () => {

    return (
        <>
            <div className="w-[96vw] mx-auto h-min pb-6 bg-white rounded-md shadow-md">
                <h1 className="font-bold text-xl py-4 px-6">Semester Overview</h1>
                
                <div className="flex flex-row justify-center gap-4 flex-wrap">

                <SemBox sem={1} batch={2022}/>
                <SemBox sem={2} batch={2022}/>
                <SemBox sem={3} batch={2022}/>
                <SemBox sem={4} batch={2022}/>
                <SemBox sem={5} batch={2022}/>
                <SemBox sem={6} batch={2022}/>
                <SemBox sem={7} batch={2022}/>
                <SemBox sem={8} batch={2022}/> 
                </div>
                
            </div>
            
        </>
    )
}

export default Dashboard