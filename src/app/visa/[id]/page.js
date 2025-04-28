"use client";

import { useEffect, useState } from "react";
import getVisaDetails from "@/services/visa/getVisaDeatails";
import getContactNumber from "@/services/tour/getContactNumber";
import { TbCurrentLocation } from "react-icons/tb";
import { IoTime } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { ToastContainer } from "react-toastify";
import ContactForm from "@/app/components/tour/ContactForm/ContactForm";
export default function VisaDetailsPage({ params }) {
  const { id } = use(params);

  const [visaDetails, setVisaDetails] = useState(null);
  const [contactNumber, setContactNumber] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchData() {
      try {
        const [details, contact] = await Promise.all([
          getVisaDetails(id),
          getContactNumber()
        ]);
        setVisaDetails(details);
        setContactNumber(contact);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#FAFAFA] text-[#333] ">
        {/* Skeleton for Hero Image */}
        <div className="h-[550px] bg-gray-200 animate-pulse" />
  
        <div className="max-w-[75%] mx-auto px-4 py-[4.5rem] grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Skeleton for Main Content */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="h-6 bg-gray-300 rounded w-2/3 animate-pulse" />
            <div className="h-10 bg-gray-300 rounded w-1/2 animate-pulse" />
            <div className="flex space-x-3 mt-3">
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="bg-white rounded-lg p-4 mt-6 shadow-md space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="w-1/3 h-6 bg-gray-300 rounded animate-pulse" />
                  <div className="h-20 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
  
          {/* Sidebar Skeletons */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-6">
            <div className="bg-[#ffeedb] border p-5 rounded-lg space-y-4 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-10 bg-orange-300 rounded" />
            </div>
  
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white border rounded shadow-md p-4 space-y-4 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-2/3" />
                <div className="flex gap-4">
                  <div className="flex-1 h-6 bg-gray-200 rounded" />
                  <div className="flex-1 h-6 bg-gray-200 rounded" />
                </div>
                <div className="h-6 bg-yellow-300 rounded w-1/2" />
              </div>
            ))}
  
            <div className="hidden md:block h-40 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="bg-[#FAFAFA] text-[#333] ">
      {/* Hero Image */}
      <div className=" h-[550px] relative ">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${visaDetails?.main_img}`}
          alt={visaDetails?.property_name}
          fill
          className="object-fill"

          
        />
      </div>

      <div className="max-w-[75%] mx-auto px-4 py-[4.5rem] grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 xl:col-span-8">
         
          <h2 className="text-xl text-gray-600 font-normal">{visaDetails?.property_name}</h2>
          <h1 className="text-4xl font-normal mt-1">{visaDetails?.property_name}</h1>

          <div className="flex flex-wrap items-center text-[20px] text-[#4C4C4C] gap-2 mt-3">
          {visaDetails?.property_summaries?.slice().reverse().map((details, index) => (
  <div key={details?.id || index} className="flex items-center">
    <span className="mr-2">
      {index === 2 ? <TbCurrentLocation className="w-5 h-5" /> : ""}
      {index === 1 ? <IoTime className="w-5 h-5" /> : ""}
    </span>
    <span className="">
      {
        index===1 ? "Local time " : index===2 ? "Currency " : null
      }
      <span className="font-bold">
        {
          details?.value 
        }
      </span>
    </span>
  </div>
))}
          </div>

          
          <div className="bg-white  rounded-lg p-4 mt-6 shadow-md">
            {visaDetails?.facilities?.map((facility,index) => (
              <div key={facility?.id||index} className="mb-6">
                <h3 className="text-3xl font-semibold mb-3">{facility?.facilty_name}</h3>
                <div
                  className="max-w-none"
                  dangerouslySetInnerHTML={{ __html: facility?.value }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-6">
          {/* Contact Card */}
          <div className="bg-[#ffeedb] border p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-black mb-2">Looking for Expert Visa Guidance?</h3>
            <p className="text-base text-black mb-4">Don&apos;t know where to begin? Share your details, and our consultants will assist you.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button style={{
                    background:
                      "linear-gradient(90deg, #313881, #0678B4)",
                  }} className=" text-white px-[12px] py-2 rounded hover:bg-[#D46B08]">
                <Link
                  href={`https://wa.me/${contactNumber?.Phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-bold"
                  
                >
                  REQUEST NOW
                </Link>
              </button>
              <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`tel:${contactNumber?.Phone}`}
                    className="text-[#f59d3f] font-medium flex items-center"
                  >
             
                <FaPhone className="mr-2 w-4 h-4" />
                {contactNumber?.Phone?.slice(3)}
              </Link>
            </div>
          </div>

          {/* Unit Cards */}
          {visaDetails?.property_uinit?.map((unit,index) => (
            <div key={unit?.id||index}>

            <div  className="bg-white border rounded shadow-md p-4">
              <h1 className="font-medium text-lg mb-1">
                {unit?.unit_name}
                <span className="ml-2 text-gray-600">Type: {unit?.unit_type}</span>
              </h1>
              <div className="text-sm space-y-1 my-2">
                <div className="flex mb-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">Validity</div>
                    <div className="text-base font-bold">{unit?.Validity} Days</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">Max Stay</div>
                    <div className="text-base font-bold">{unit?.Max_Stay} Days</div>
                  </div>
                </div>
                <p className="text-lg font-semibold">BDT {Math.ceil(unit?.price[0]?.price)} <span className="text-base font-light">/person</span></p>
              </div>
              <p className="text-[#f59d3f]  text-sm mt-2">
                ⚠️ Please contact Visa department for Document processing.
              </p>
             
            </div>
             <button
              style={{
                background:
                  "linear-gradient(90deg, #313881, #0678B4)",
              }}
             
             className="mt-[-5px] w-full font-semibold bg-[#3a8ff0] text-white text-sm py-2 rounded hover:bg-blue-700"
           >
             SELECT OFFER
           </button>
           </div>
          ))}

<ToastContainer/>
          {/* Modal */}
          <div className="fixed md:hidden bottom-6 right-6 z-50">
  <button 
  onClick={() => setShowForm(true)}
    className="
      flex items-center justify-center
      bg-blue-600 hover:bg-blue-700 
      text-white font-medium 
      rounded-full 
      shadow-lg shadow-blue-500/50
      px-6 py-4
      transition-all duration-300
      hover:shadow-xl hover:shadow-blue-600/50
      active:scale-95
    "
    style={{
      background:
        "linear-gradient(90deg, #313881, #0678B4)",
    }}
  >
    <svg 
      className="w-5 h-5 mr-2" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 5l7 7-7 7" 
      />
    </svg>
    Request Visa Assistance
  </button>
</div>
<div className="hidden md:block shadow-md">
          <ContactForm category={"visa"} propertyDetails={visaDetails?.property_name} headline={"Request Visa Assistance"}/>
  </div>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Visa Application Form</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                      ✕
                    </button>
                  </div>
                  {/* <VisaInfoSubmitForm property_name={visaDetails?.property_name} /> */}
          <ContactForm category={"visa"} propertyDetails={visaDetails?.property_name} headline={"Request Visa Assistance"}/>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
