import { QRCodeCanvas } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { CopyLink } from '../CopyLink/CopyLink';

import './Plan.css';

export const Plan = ({ data }) => {


    const saveData = () => {
        localStorage.setItem('plan-selected', JSON.stringify(data))
    }

    return (
        <div className='plan'>
            <div>
                <div title={data.reason}>
                    <h3>{data.reason}</h3>
                    <p>{data.auto_recurring.frequency !== 1 ? `Se debitará cada ${data.auto_recurring.frequency} meses` : `Se debitará cada ${data.auto_recurring.frequency} mes`}</p>
                    <p>Monto: {data.auto_recurring.transaction_amount ? '$' + data.auto_recurring.transaction_amount : 'Definido por los socios'}</p>
                    <p>Cantidad de socios: {data.subscribed}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <CopyLink link={data.init_point} reason={data.reason} />
                    <Link className='btn' to={'/debito-automatico/' + data.id} onClick={saveData}> Ver socios </Link>
                </div>
            </div>
            <div className="containter-QR">
                <QRCodeCanvas
                    value={data.init_point}
                    size={174}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                />
            </div>
        </div >
    )
}

