import getAllCountry from '@/services/visa/getAllCountry';
import getAllVisa from '@/services/visa/getAllVisa';
import VisaSearchForm from '../components/visa/visaSearchForm';
import Image from 'next/image';
import Link from 'next/link';
import getContactNumber from '@/services/tour/getContactNumber';
import { TbCurrentLocation } from 'react-icons/tb';
import { IoTime } from 'react-icons/io5';
import { Roboto } from 'next/font/google';
const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export default async function Home() {
  let countryData = [];
  let visaData = [];
  let contactNumber = [];
  let loading = false;

  try {
    loading = true;
    const countryResult = await getAllCountry();
    const visaResult = await getAllVisa();
    const contactnumber = await getContactNumber();
  
    countryData = countryResult;
    visaData = visaResult;
    contactNumber = contactnumber;
    loading = false;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    loading = false;
  }

  if (loading) {
    return (
      <div className="min-h-screen font-sans bg-gray-50">
        {/* Background skeleton */}
        <div className="h-[50vh] bg-gray-200 animate-pulse w-full" />
  
        {/* Search Form Skeleton */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="w-40 h-12 bg-blue-100 rounded-lg animate-pulse mx-auto mt-6" />
          </div>
        </div>
  
        {/* Grid Skeleton */}
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mx-auto mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse h-[500px]"
              >
                <div className="h-60 bg-gray-200 w-full" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                  <div className="flex space-x-4 pt-2">
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-1/3 mt-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${roboto.className} min-h-screen bg-gray-50`}>
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Book Me</h1>
          <p className="text-xl md:text-2xl max-w-2xl">Find Flights, Hotels, Visa & Holidays Worldwide</p>
        </div>
      </section>

      {/* Search Form Section */}
      <section className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-4 max-w-6xl">
          <VisaSearchForm countryData={countryData} />
        </div>
      </section>

      {/* Visa Countries Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Popular Visa Destinations
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {visaData.map((country, ind) => (
              <Link 
                key={ind}  
                href={`/visa/${country?.id}`}
                className="group block text-gray-800 hover:text-gray-900 transition-colors"
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-lg">
                  {/* Image Container */}
                  <div className="relative h-[180px] md:h-[200px] w-full bg-gray-100">
                    {country?.image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${country.image}`}
                        alt={country?.name || "Country image"}
                        fill
                        className="object-fill"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content Container */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-blue-800 mb-3 line-clamp-2">
                      {country?.name || "Country Name"}
                    </h3>

                    <div className="flex-1 space-y-3">
                      {country?.properties?.map((property, idx) => (
                        <div key={idx}>
                          <p className="text-gray-900 font-semibold line-clamp-2 mb-3">
                            {property?.property_summaries[2]?.value || "Visa Description not available"}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <TbCurrentLocation className="w-5 h-5 mr-2 text-black" />
                              <span className="">
                                <span className="text-gray-600 font-semibold">Currency : </span>
                                <span className="font-bold text-gray-900">
                                  {property?.property_summaries[0]?.value || "N/A"}
                                </span>
                              </span>
                            </div>
                            
                            <div className="flex items-center">
                              <IoTime className="w-5 h-5 mr-2 text-black" />
                              <span className="">
                                <span className="text-gray-600 font-semibold">Local time : </span>
                                <span className="font-bold text-gray-900">
                                  {property?.property_summaries[1]?.value || "N/A"}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {country?.properties?.[0]?.property_uinit?.[0]?.price?.[0]?.price ? (
                        <p className="text-lg font-semibold text-blue-600">
                          BDT {Math.ceil(country.properties[0]?.property_uinit[0]?.price[0]?.price)}
                          <span className="text-sm font-normal text-gray-500 ml-1">/person</span>
                        </p>
                      ) : (
                        <p className="text-red-500 font-semibold">Price not available</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}