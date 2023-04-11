import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import OrderRecord from './OrderRecord';
import { Link } from 'react-router-dom';


const PastOrders = () => {

    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [qtyPlain, setQtyPlain] = useState(0);
    const [qtyCW, setQtyCW] = useState(0);
    const [qtySpecial1, setQtySpecial1] = useState(0);
    const [qtySpecial2, setQtySpecial2] = useState(0); //NEW SPECIAL
    const [buildingAddress, setBuildingAddress] = useState('');
    const [roomNum, setRoomNum] = useState(0);
    const [deliveryTime, setDeliveryTime] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [total, setTotal] = useState(0.0);
    const [email, setEmail] = useState('');
    const [submissionTime, setSubmissionTime] = useState('');
    const [okayWithPhotos, setOkayWithPhotos] = useState(false);
    const [recordList2, setRecordList2] = useState([])
    const [idList2, setIdList2] = useState([])




    useEffect(() => {
        getOrderInfo()
    }, [])

    function checkPhotos(okayWithPhotos) {
        switch(okayWithPhotos){
            case true:
                return 'true'
            default:
                return 'false'
        }
    }

    const getOrderInfo = async () => {

        let { data: arrIds, error2 } = await supabase
            .from('pastOrders')
            .select('id')

        let idList = []
        let recordList = []
        for (let i = 0; i < arrIds.length; i++) {
            let { data: order, error } = await supabase
                .from('pastOrders')
                .select()
                .eq('id', arrIds[i].id)

            
            if (!idList2.includes(order[0].id)) {
                idList.push(order[0].id)
                recordList.push(
                    <OrderRecord name={order[0].name} qtyPlain={order[0].qty_plain} qtyCW={order[0].qty_cw}
                    qtySpecial1={order[0].qty_special1} qtySpecial2={order[0].qty_special2}
                    buildingAddress={order[0].building_address} roomNum={order[0].room_num}
                    deliveryTime={order[0].delivery_time} phoneNumber={order[0].phone_number}
                    total={order[0].total} email={order[0].email} submissionTime={order[0].submission_time}
                    okayWithPhotos={checkPhotos(order[0].okay_with_photos)} id={order[0].id}>fwe</OrderRecord>)
            }
            
        }
        setIdList2([...idList2, ...idList])
        setRecordList2([...recordList2, ...recordList])
    }

    return (
        <div className='w-full'>
            {<Link to='/OrderInfo'>View Current Orders</Link>}
            <h1>Orders</h1>
            <div className='place-content-center'>
                <div className='max-h-80 overflow-x-auto overflow-y-auto'>
                    <table>
                        <thead>
                            <tr>
                                <th className='p-2'>Name</th>
                                <th className='p-2'>Plain</th>
                                <th className='p-2'>CW</th>
                                <th className='p-2'>Special1</th>
                                <th className='p-2'>Special2</th>
                                <th className='p-2'>Building</th>
                                <th className='p-2 whitespace-nowrap'>Room #</th>
                                <th className='p-2 whitespace-nowrap'>Delivery Time</th>
                                <th className='p-2 whitespace-nowrap'>Okay with Photos</th>
                                <th className='p-2'>Phone #</th>
                                <th className='p-2'>Total</th>
                                <th className='p-2'>Email</th>
                                <th className='p-2 whitespace-nowrap'>Submission Time</th>
                                <th className='p-2'>Order ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const records = [];
                                for (let i = 0; i < idList2.length; i++) {
                                    records.push(
                                        <tr className='border-b bg-blue-500' key={idList2[i] + 14}>
                                            <td className='' key={idList2[i]}>{recordList2[i].props.name}</td>
                                            <td className='' key={idList2[i] + 1}>{recordList2[i].props.qtyPlain}</td>
                                            <td className='' key={idList2[i] + 2}>{recordList2[i].props.qtyCW}</td>
                                            <td className='' key={idList2[i] + 3}>{recordList2[i].props.qtySpecial1}</td>
                                            <td className='' key={idList2[i] + 4}>{recordList2[i].props.qtySpecial2}</td>
                                            <td className='' key={idList2[i] + 5}>{recordList2[i].props.buildingAddress}</td>
                                            <td className='' key={idList2[i] + 6}>{recordList2[i].props.roomNum}</td>
                                            <td className='' key={idList2[i] + 7}>{recordList2[i].props.deliveryTime}</td>
                                            <td className='' key={idList2[i] + 12}>{recordList2[i].props.okayWithPhotos}</td>
                                            <td className='p2 whitespace-nowrap' key={idList2[i] + 8}>{recordList2[i].props.phoneNumber}</td>
                                            <td className='' key={idList2[i] + 9}>{recordList2[i].props.total}</td>
                                            <td className='' key={idList2[i] + 10}>{recordList2[i].props.email}</td>
                                            <td className='' key={idList2[i] + 11}>{recordList2[i].props.submissionTime}</td>
                                            <td className='' key={idList2[i] + 13}>{recordList2[i].props.id}</td>
                                        </tr>);
                                }
                                return records;
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default PastOrders