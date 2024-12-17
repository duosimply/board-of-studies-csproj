import { signout } from "./actions"

const Dashboard = () => {
    return (
        <>
            <p>THis is the dashbaord</p>
            <form action={signout}><button type="submit">Sign Out</button></form>
        </>
    )
}

export default Dashboard