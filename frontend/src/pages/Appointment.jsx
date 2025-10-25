import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from './RelatedDoctors';
import { toast } from 'react-toastify'
import axios from '../axiosConfig';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const navigate = useNavigate()

  const [doc, setDoc] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const fetchDoc = async () => {
    const doc = doctors.find(doctor => doctor._id === docId);
    setDoc(doc);
  }

  const getAvailableSlots = async () => {
    setDocSlots([]);
    //get current date
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      //setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0)

      //setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + '_' + month + '_' + year
        const slotTime = formattedTime

        const isSlotAvailable = doc.slots_booked[slotDate] && doc.slots_booked[slotDate].includes(slotTime) ? false : true
        // add slot to array
        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime
          });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const bookApponement = async () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }
    try {

      const date = docSlots[slotIndex][0].dateTime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + '_' + month + '_' + year;
      console.log(slotDate);
      console.log(slotTime);
      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }


  useEffect(() => {
    fetchDoc();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [doc])

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots])

  return doc && (
    <div>
      {/* docter details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={doc.image} alt="" />
        </div>
        {/* doctor info */}
        <div className='flex-l border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {doc.name} <img className='w-3 mt-1.5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex flex-center gap-2 text-sm mt-l text-gray-600'>
            <p>{doc.degree}-{doc.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{doc.experience}</button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{doc.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee <span className='text-gray-700'>{currencySymbol}{doc.fees}</span>
          </p>
        </div>
      </div>

      {/* booking slots*/}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item, index) => (
              <div onClick={() => { setSlotIndex(index) }} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white ' : 'border border-gray-400'}`} key={index}>
                <p>{item[0] && days[item[0].dateTime.getDay()]}</p>
                <p>{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            ))
          }
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4 '>
          {
            docSlots.length && docSlots[slotIndex].map((item, index) => (
              <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
                {item.time.toLowerCase()}
              </p>
            ))
          }
        </div>
        <button onClick={bookApponement} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an Appointment</button>
      </div>
      {/* realted doctors */}
      <RelatedDoctors docId={docId} speciality={doc.speciality} />
    </div>
  )
}

export default Appointment;