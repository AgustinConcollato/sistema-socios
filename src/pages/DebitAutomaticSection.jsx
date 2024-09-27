import { useEffect, useState } from "react"
import { Loading } from "../components/Loading/Loading";
import { Plan } from "../components/Plan/Plan";
import { Route, Routes } from "react-router-dom";
import { PlanDetails } from "../components/PlanDetails/PlanDetails";

export const DebitAutomaticSection = () => {

    const [plans, setPlans] = useState(null)

    const getPlans = async () => {
        try {
            const result = await window.electronAPI.getPlans()
            setPlans(result)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPlans()
    }, [])

    return (
        <section>
            <Routes>
                <Route path="/" element={
                    <>
                        <h1>Débito automático</h1>
                        <div className="container-plans">
                            {plans == null ?
                                <Loading /> :
                                plans.length !== 0 ?
                                    plans.map(e => <Plan key={e.id} data={e} />) :
                                    <p>No hay planes</p>
                            }
                        </div>
                    </>
                } />
                <Route path="/:id" element={<PlanDetails />} />
            </Routes>
        </section>
    )
}