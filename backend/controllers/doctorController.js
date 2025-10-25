import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import AppointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req,res)=>{
    
    try{
        const {docId}=req.body
        const docData=await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available});
        res.json({success:true,message:'Availablity Changed'})

    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message})

    }
}

const doctorList = async (req,res) =>{
    try{
        const doctors=await doctorModel.find({}).select(['-password','-email']);
        res.json({success:true,doctors})
    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message})
    }
}

//api for doctor login
const loginDoctor = async (req,res) => {
    try {
        
        const {email,password}=req.body;
        const doctor= await doctorModel.findOne({email})

        if(!doctor){
            return res.json({success:false,message:'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password,doctor.password)
        if(isMatch){
            const token=jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else {
            return res.json({success:false,message:'Invalid credentials'})
        }

    } catch (err) {
        console.log(err);
        res.json({success:false,message:err.message})
    }
}

//api to get doctor appointments for doctor panel

const appointmentsDoctor = async (req,res)=>{

    try {
        const {docId}=req.body
        const appointments=await AppointmentModel.find({docId})
        res.json({success:true,appointments})

    } catch (err) {
        console.log(err);
        res.json({success:false,message:err.message})
    }
}


// api to mark appointment complete

const appointmentComplete = async (req,res)=>{
    try {
        const {docId,appointmentId}=req.body

        const appointmentData= await AppointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId==docId){
            await AppointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
            return res.json({success:true,message:'Appointment Completed'})
        }else{
            return res.json({success:false,message:'Mark Failed'})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}


//  api to cancel appointment by doctor
const appointmentCancel = async (req,res)=>{
    try {
        const {docId,appointmentId}=req.body

        const appointmentData= await AppointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId==docId){
            await AppointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
            return res.json({success:true,message:'Appointment cancelled'})
        }else{
            return res.json({success:false,message:'Cancellation Failed'})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//api to get doctor data  for doctor panel
const  doctorDashboard = async (req,res)=>{
    try {
        
        const {docId}=req.body

        const appointments= await AppointmentModel.find({docId})

        let earning =0;
        appointments.map((item)=>{
            if(item.isCompleted||item.payment){
                earning+=item.amount
            }
        })

        let patients = [];
        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData={
            earning,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// api to get doctor profile for doctor panel
const doctorProfile = async (req,res) => {
    try {
        
        const {docId}=req.body
        const profileData= await doctorModel.findById(docId).select('-password')

        res.json({success:true,profileData})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// api to update doctor profile data from doctor panel
const updateDoctorProfile = async (req,res) => {
    try {
        
        const {docId,fees,address,available}=req.body
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
        res.json({success:true,message:'Profile updated successfully'})

    }catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


export {changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
}