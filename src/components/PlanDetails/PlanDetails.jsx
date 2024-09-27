import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Loading } from "../Loading/Loading"
import { formatDate } from "../../functions/formatDate"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { CopyLink } from "../CopyLink/CopyLink"

import './PlanDetails.css'

export const PlanDetails = () => {

    const planSelected = JSON.parse(localStorage.getItem('plan-selected'))

    const { id } = useParams()

    const [subscribers, setSubscribers] = useState(null)

    const getSubscribers = async (e) => {
        try {
            const result = await window.electronAPI.getSubscribers(e)
            setSubscribers(result)
        } catch (error) {
            console.log(error)
        }
    }

    const openViewSubscriberDetail = (e) => window.electronAPI.openViewSubscribedDetail(e)

    useEffect(() => {
        getSubscribers(id) // si quisiera agreagar mas filtros deberia pasar un objeto como parametro
        // como status

        // return () => localStorage.clear()
    }, [id])

    return (
        <div>
            <div className="header-plan">
                <Link className="btn" to={'/debito-automatico'}><FontAwesomeIcon icon={faArrowLeft} size="sm" />  Volver a los planes</Link>
                <div>
                    <div>
                    <h3>{planSelected.reason}</h3>
                    <p>{planSelected.auto_recurring.frequency !== 1 ? `Se debitará cada ${planSelected.auto_recurring.frequency} meses` : `Se debitará cada ${planSelected.auto_recurring.frequency} mes`}</p>
                    </div>
                    <CopyLink link={planSelected.init_point} reason={planSelected.reason}/>
                </div>
            </div>
            {subscribers == null ?
                <Loading /> :
                subscribers.length !== 0 ?
                    <table className="table-subscribers" cellSpacing={0}>
                        <thead>
                            <tr>
                                <td>Nombre/Referencia</td>
                                <td>Próximo cobro</td>
                                <td>Monto</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map(e =>
                                <tr key={e.id}>
                                    <td>{e.payer_first_name} {e.payer_last_name}</td>
                                    <td>{formatDate(e.next_payment_date)}</td>
                                    <td>${e.auto_recurring.transaction_amount}</td>
                                    <td><button className="btn" onClick={() => openViewSubscriberDetail(e)}>Ver detalles</button></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    :
                    <p>No hay socios</p>
            }

        </div>
    )
}