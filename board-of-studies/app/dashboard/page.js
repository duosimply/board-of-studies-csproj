import SemBox from "../components/SemBox"

const Dashboard = () => {

    return (
        <>
            <div className="w-[96vw] mx-auto h-min pb-6 bg-white rounded-md shadow-md">
                <h1 className="font-bold text-xl py-4 px-6">Semester Overview</h1>
                
                <div className="flex flex-row justify-center gap-4 flex-wrap">

                <SemBox sem={1}/>
                <SemBox sem={2}/>
                <SemBox sem={3}/>
                <SemBox sem={4}/>
                <SemBox sem={5}/>
                <SemBox sem={6}/>
                <SemBox sem={7}/>
                <SemBox sem={8}/>
                </div>
                
            </div>
            
        </>
    )
}

export default Dashboard