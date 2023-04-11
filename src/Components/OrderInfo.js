import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import OrderRecord from './OrderRecord';
import { Link } from 'react-router-dom';



const OrderInfo = () => {

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

    const [rowSelection, setRowSelection] = useState([])

    useEffect(() => {
        console.log("CALLING from Database")
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

    /* Takes index, which is the position of the record (as it shows on the screen), and changes that value */
    function selectingRow(rowIdx){
        let value = rowSelection[rowIdx]
        if(rowIdx === 0){
            setRowSelection([!value, ...rowSelection.slice(1, rowSelection.length)])
        }else if(rowIdx === rowSelection.length - 1){
            setRowSelection([...rowSelection.slice(0, rowSelection.length - 1), !value])
        }else{
            setRowSelection([...rowSelection.slice(0,rowIdx), !value, ...rowSelection.slice(rowIdx + 1, rowSelection.length)])
        }
    }


    function deletingRecords(){
        for(let i = 0; i < rowSelection.length; i++){
            if(rowSelection[i]){
                console.log(`Idx ${i} is true`)
                // let x = recordList2.props.submissionTime.toISOString()
                // console.log(x)
                let record = {
                    id: recordList2[i].props.id,
                    qty_plain: recordList2[i].props.qtyPlain,
                    qty_cw: recordList2[i].props.qtyCW,
                    qty_special1: recordList2[i].props.qtySpecial1,
                    qty_special2: recordList2[i].props.qtySpecial2,
                    delivery_time: recordList2[i].props.deliveryTime,
                    building_address: recordList2[i].props.buildingAddress,
                    room_num: recordList2[i].props.roomNum,
                    name: recordList2[i].props.name,
                    phone_number: recordList2[i].props.phoneNumber,
                    email: recordList2[i].props.email,
                    total: recordList2[i].props.total,
                    okay_with_photos: recordList2[i].props.okayWithPhotos,
                    submission_time: recordList2[i].props.submissionTime
                }
                movingRecord(record)
                deleteRow(recordList2[i].props.id)
            }
        }
    }

    /* Moves the record to the pastOrders table in the database */
    const movingRecord = async (record) => {
        console.log(JSON.stringify(record))

        const { error } = await supabase.from('pastOrders').insert(record)

        console.log(error)
        if(error != null){
            movingRecord(record)
            console.log('Error')
        }
        console.log("Success!")
    }

    const deleteRow = async (rowId) => {
        try {
          // Call the `delete` method on the Supabase client instance
          const { data, error } = await supabase
            .from('orders')
            .delete()
            .eq('id', rowId); // Use the appropriate column name and value for identifying the row to be deleted
      
          if (error) {
            throw new Error(error.message);
          }
      
          // Handle the deletion success
          console.log(`Row deleted successfully.`);
        } catch (error) {
          // Handle the deletion error
          console.error('Failed to delete row:', error);
          deleteRow(rowId)
        }
      }

    /* Gets the infomation from the database */
    const getOrderInfo = async () => {
        let { data: arrIds, error2 } = await supabase
            .from('orders')
            .select('id')

        let idList = []
        let recordList = []
        let rowSelect = []
        for (let i = 0; i < arrIds.length; i++) {
            let { data: order, error } = await supabase
                .from('orders')
                .select()
                .eq('id', arrIds[i].id)

            
            if (!idList2.includes(order[0].id)) {
                rowSelect.push(false)
                idList.push(order[0].id)
                recordList.push(
                    <OrderRecord name={order[0].name} qtyPlain={order[0].qty_plain} qtyCW={order[0].qty_cw}
                    qtySpecial1={order[0].qty_special1} qtySpecial2={order[0].qty_special2}
                    buildingAddress={order[0].building_address} roomNum={order[0].room_num}
                    deliveryTime={order[0].delivery_time} phoneNumber={order[0].phone_number}
                    total={order[0].total} email={order[0].email} submissionTime={order[0].submission_time}
                    okayWithPhotos={checkPhotos(order[0].okay_with_photos)} id={order[0].id}></OrderRecord>)
            }
            
        }
        setRowSelection([...rowSelection, ...rowSelect])
        setIdList2([...idList2, ...idList])
        setRecordList2([...recordList2, ...recordList])
    }

    return (
        <div className='w-full'>
            {<Link to='/PastOrders'>Checkout Past Orders</Link>}
            <h1>Orders</h1>
            <div className='place-content-center'>
                <div className='max-h-80 overflow-x-auto overflow-y-auto'>
                    <table>
                        <thead>
                            <tr>
                                <th className='p-2'>Select</th>
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
                                            <td className='' key={idList2[i] - 1}><input type='checkbox' value={false} onChange={() => selectingRow(i)}/></td>
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
            <button className='bg-white text-black pl-2 pr-2 mt-1' onClick={() => deletingRecords()}>Move to trash</button>
        </div>
    )
}

export default OrderInfo