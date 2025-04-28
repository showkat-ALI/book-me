import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { FreeMode, Navigation, Thumbs, Autoplay, Pagination } from "swiper";

const PackageCarousel = ({
  propertyPackages,
  loading,
  contactNumber,
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate the maximum width based on the number of packages
  const maxWidthClass = propertyPackages?.length === 1 ? 'max-w-md' : 'max-w-full';

  return (
    <div className={`relative mx-auto ${maxWidthClass}`}>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation={propertyPackages?.length > 1} // Only show navigation if more than 1 package
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          500: {
            slidesPerView: propertyPackages?.length >= 2 ? 2 : 1,
          },
          1024: {
            slidesPerView: propertyPackages?.length >= 3 ? 3 : propertyPackages?.length,
          },
          1280: {
            slidesPerView: propertyPackages?.length < 4 ? propertyPackages.length : 4,
          },
        }}
        className="package-swiper"
      >
        {propertyPackages?.map((pkg) => (
          <SwiperSlide key={pkg.unit_id}>
            <div className="relative z-10 bg-white shadow-xl rounded-lg overflow-visible h-[395px] w-full">
              {(pkg?.discount?.discount_percent > 0 || pkg?.discount?.discount_amount > 0) && (
                <div className="flex flex-col bg-red-700 h-14 justify-center rounded-full shadow-md text-white text-xs w-14 -right-[0.07rem] top-[0rem] absolute font-semibold items-center py-2 z-40">
                  <span>
                    {pkg.discount.discount_percent > 0 
                      ? `${Math.floor(pkg.discount.discount_percent)}%`
                      : `${Math.floor(pkg.discount.discount_amount)} TK`}
                  </span>
                  <span className="text-[10px]">OFF</span>
                </div>
              )}
              <div className="flex flex-col h-full items-center mx-auto">
                <div className="relative w-full h-[180px]">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${pkg.mainimg}`}
                    alt={pkg.unit_id}
                    fill
                    className="rounded-t-lg object-cover"
                  />
                </div>
                <div className="flex font-semibold flex-1 flex-col p-[12px] shadow-lg w-full">
                  <h2 className={`font-heading text-[18px] font-bold text-blue-900 pb-2`}>
                    {pkg.unit_name}
                  </h2>
                  <p className={`text-gray-800 text-[16px]`}>
                    Unit Type: {pkg.unit_type} | Person Allowed:{" "}
                    {pkg.person_allowed} 
                    {pkg?.additionalbed === 1
                      ? " | Additional Bed: Available"
                      : pkg?.additionalbed === 0
                      ? ""
                      : ""}
                  </p>
                  <div className="flex justify-start items-center">
                    <div className={`flex gap-2 mt-3 mb-4`}>
                      <Link href={`tel:${contactNumber?.Phone}`} target="_blank" rel="noopener noreferrer">
                        <div className="flex border border-blue-950 justify-center rounded-full text-black text-center text-sm font-heading items-center px-3 py-1 sm:w-[90px]">
                          Call Now
                        </div>
                      </Link>
                      <Link href={`https://wa.me/${contactNumber?.Phone}`} target="_blank" rel="noopener noreferrer">
                        <div className="flex border border-blue-950 justify-center rounded-full text-black text-sm font-heading gap-2 items-center px-3 py-1 sm:w-[120px]">
                          <FaWhatsapp className="text-[16px] text-green-500" />
                          Book Now
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div>
                    {pkg.price?.length > 0 ? (
                      <p className="text-[16px] text-blue-950 font-semibold">
                        <span>Price: </span>
                        {pkg?.discount ? (
                          (() => {
                            const discount = pkg.discount;
                            const hasAmountDiscount = discount?.discount_amount > 0;
                            const hasPercentDiscount = discount?.discount_percent > 0;
                            const hasAnyDiscount = hasAmountDiscount || hasPercentDiscount;
                            
                            let discountedPrice = pkg.price[0].price;
                            
                            if (hasAmountDiscount) {
                              discountedPrice = Math.floor(pkg.price[0].price - discount.discount_amount);
                            } 
                            else if (hasPercentDiscount) {
                              discountedPrice = Math.floor(pkg.price[0].price * (1 - (discount.discount_percent / 100)));
                            }
                            
                            return (
                              <>
                                {hasAnyDiscount ? (
                                  <>
                                    <span className="line-through text-red-500 mr-1">
                                      {Math.floor(pkg.price[0].price)} TK
                                    </span>
                                    <span className="">
                                      {discountedPrice} TK
                                      <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                        {hasAmountDiscount 
                                          ? `${discount.discount_amount} TK OFF`
                                          : `${discount.discount_percent}% OFF`}
                                      </span>
                                    </span>
                                  </>
                                ) : (
                                  <span>
                                    {Math.floor(pkg.price[0].price)} TK
                                  </span>
                                )}
                              </>
                            );
                          })()
                        ) : (
                          <span>
                            {Math.floor(pkg.price[0].price)} TK
                          </span>
                        )}
                        <span className="text-gray-500 text-[14px] ml-1">(Per person)</span>
                      </p>
                    ) : (
                      <p className="text-[15px] text-red-500">
                        Price: Not Available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .package-swiper .swiper-button-next,
        .package-swiper .swiper-button-prev {
          color: white;
          background: linear-gradient(90deg, #313881, #0678B4);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .package-swiper .swiper-button-next:after,
        .package-swiper .swiper-button-prev:after {
          font-size: 20px;
        }

        .package-swiper .swiper-button-disabled {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default PackageCarousel;