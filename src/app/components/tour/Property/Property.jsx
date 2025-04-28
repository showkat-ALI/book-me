"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import propertySummary from "@/services/tour/propertySummary";
import IconShow from "@/services/tour/IconShow";
import { TailSpin } from "react-loader-spinner";
import { Roboto } from "next/font/google";
import { RangeSlider } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useSearch } from "@/SearchContext";
import getContactNumber from "@/services/tour/getContactNumber";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import Pagination from "../Pagination/Pagination";
import { usePagination } from "@/services/tour/usePagination";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export default function Property() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { currentPage, handlePageChange, setCurrentPage } = usePagination();
  const [data, setData] = useState([]);
  const [popularData, setPopularData] = useState([]);
  const [price, setPrice] = useState(10000);
  const [sortOption, setSortOption] = useState("1");
  const [contactNumber, setContactNumber] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    setSearchTerm(data.property);
  };

  // Fetch property data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const isSundarban = window.location.pathname.includes('sundarban');
    const locationId = isSundarban ? 2 : 1;
        const result = await propertySummary(locationId);
        setData(result);  
      } catch (error) {
        console.error("Error fetching property data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fetch popular property data
  useEffect(() => {
    async function fetchPopularData() {
      if (sortOption === "4") {
        try {
          setLoading(true);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/popularPropertySummary/1`
          );
          const result = await response.json();
          setPopularData(result);
        } catch (error) {
          console.error("Error fetching popular property data:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchPopularData();
  }, [sortOption]);

  // Fetch contact number
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getContactNumber();
        setContactNumber(result);
      } catch (error) {
        console.error("Error fetching contact number data:", error);
      }
    }
    fetchData();
  }, []);

  // Sorting logic
  const sortedData = useMemo(() => {
    const getMaxPrice = (property) => {
      const prices =
        property.property_uinit?.flatMap((unit) =>
          unit.price?.map((priceObj) => priceObj.price)
        ) || [];
      return prices.length > 0 ? Math.max(...prices) : -Infinity;
    };

    const sorted = [...data].sort((a, b) => {
      const priceA = getMaxPrice(a);
      const priceB = getMaxPrice(b);

      if (priceA === -Infinity && priceB === -Infinity) return 0;
      if (priceA === -Infinity) return 1;
      if (priceB === -Infinity) return -1;

      return sortOption === "2" ? priceA - priceB : priceB - priceA;
    });

    return sorted;
  }, [data, sortOption]);

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = sortedData;

    if (sortOption === "4") {
      filtered = popularData;
    }

    if (searchTerm) {
      filtered = filtered.filter((property) =>
        property.property_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (price <= 9500) {
      filtered = filtered.filter((property) => {
        if (!property.property_uinit || property.property_uinit.length === 0) {
          return true;
        }
        const prices = property.property_uinit.flatMap(
          (unit) => unit.price?.map((priceObj) => priceObj.price) || []
        );
        return prices.some((p) => p <= price);
      });
    }

    return filtered;
  }, [sortedData, popularData, searchTerm, price, sortOption]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  // Total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Save scroll position, card index, and current page
  const handleCardClick = (index) => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
    sessionStorage.setItem("lastViewedCardIndex", index);
    sessionStorage.setItem("currentPage", currentPage);
  };

  // Restore scroll position, card index, and current page
  useEffect(() => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    const lastViewedCardIndex = sessionStorage.getItem("lastViewedCardIndex");
    const savedCurrentPage = sessionStorage.getItem("currentPage");

    if (savedCurrentPage) {
      setCurrentPage(parseInt(savedCurrentPage, 10));
    }

    if (scrollPosition && lastViewedCardIndex) {
      // Wait for the page to fully render before restoring scroll position
      setTimeout(() => {
        window.scrollTo(0, parseInt(scrollPosition));
        const cardElement = document.querySelector(
          `[data-index="${lastViewedCardIndex}"]`
        );
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        sessionStorage.removeItem("scrollPosition");
        sessionStorage.removeItem("lastViewedCardIndex");
        sessionStorage.removeItem("currentPage");
      }, 1000); // Adjust the delay if needed
    } else {
      // Scroll to the top on page refresh
      window.scrollTo(0, 0);
    }
  }, [sortedData]);

  return (
    <div
      className={`${roboto.className} bg-white lg:container lg:w-full mx-auto px-4`}
    >
      {/* Filter & Sorting Section */}
      <div className="lg:hidden block mb-[15px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-[5px] border rounded-lg shadow-lg w-full lg:w-96 mx-auto"
        >
          <input
            {...register("property")}
            type="text"
            value={searchTerm}
            className="w-full p-2 border rounded-md text-black"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search property"
          />
        </form>
      </div>

      {/* Price Filter */}
      <div className="flex flex-wrap justify-start md:justify-between sm:justify-between items-center mb-5 w-[100%]">
        <div className="flex items-center gap-2 md:w-[50%] w-[100%]">
          <h4 className="text-[12px] sm:text-lg text-[#00026E] font-semibold w-[16%] md:w-[23%] xl:w-[18%]">
            Filter by :
          </h4>
          <h4 className="text-[12px] sm:text-sm hidden md:hidden xl:block font-medium text-[#00026E] w-[21%] xl:w-[16%]">
            Price Range
          </h4>
          <span className="text-[12px] sm:text-sm  text-blue-600 font-bold w-[21%] md:[33%] xl:w-[20%]">
            {parseInt(price).toLocaleString()}
            {parseInt(price) > 9500 ? "+" : ""} TK
          </span>
          <RangeSlider
            id="default-range"
            min={0}
            max={10000}
            step={500}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            tooltip="true"
            tooltipposition="top"
            className="xl:w-[40%] md:[20%] w-[53%] mt-[-18px] appearance-none h-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 justify-center mx-0 md:mx-auto lg:mx-0 sm:mt-[0px] mt-[20px]">
          <h4 className="text-[12px] sm:text-sm md:block hidden font-medium text-[#00026E]">
            Sort Listing:
          </h4>
          <select
            className="md:w-40 w-[8rem] border border-gray-300 rounded-md text-[#00026E] px-3 py-1.5 text-sm focus:ring-blue-400 focus:border-blue-400"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option className="hidden ">Sort By</option>
            <option value="2">Price - Low to High</option>
            <option value="3">Price - High to Low</option>
            <option value="4">Popular</option>
          </select>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <TailSpin height="80" width="80" color="#0678B4" />
        </div>
      ) : paginatedData && paginatedData.length > 0 ? (
        paginatedData.map((property, index) => (
          <div key={property.property_id} data-index={index} className="mb-5">
            {/* Property Card */}
            <div className="shadow-custom flex flex-col lg:flex-row gap-5 pt-5 pl-5 pr-5 pb-0 rounded bg-white">
              <div className="md:min-w-[400px] min-w-0 md:min-h-[300px] min-h-0">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${property.main_img}`}
                  alt={property.property_name}
                  width={500}
                  height={300}
                  className="object-cover w-full md:w-[300px] md:h-[230px] h-[200px] mx-auto"
                />
              </div>

              <div className="flex flex-col w-full pr-4">
                <Link
                  href={`/Property/${property.property_id}`}
                  className="cursor-pointer"
                  onClick={() => handleCardClick(index)}
                >
                  <h1 className="font-heading font-semibold text-lg text-[#00026E] mt-4">
                    {property.property_name}
                  </h1>
                </Link>

                <h1 className="font-normal text-sm text-[#00026E] text-right md:mb-0 mb-[20px]">
                  Starting from <br />
                  <span className="font-bold text-lg text-blue-900">
                    {(() => {
                      const prices =
                        property.property_uinit?.flatMap((unit) =>
                          unit.price?.map((priceObj) => priceObj.price)
                        ) || [];
                      return prices.length > 0
                        ? `${Math.min(...prices)} TK`
                        : "N/A";
                    })()}
                  </span>
                </h1>

                {property.property_summaries && (
                  <div className="flex flex-col gap-3 -mt-4">
                    {/* Property Summaries */}
                    <div className="flex flex-wrap gap-4">
                      {property.property_summaries
                        .slice(0, 1)
                        .map((summary) => (
                          <div
                            key={summary.id}
                            className="flex items-center text-blue-700"
                          >
                            <IconShow iconName={summary.icons.icon_name} />
                            <span className="ml-2 text-sm text-blue-900">
                              {summary.value}
                            </span>
                          </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div className="flex gap-4 w-full md:w-auto">
                        {property.property_summaries
                          .slice(1, 3)
                          .map((summary) => (
                            <div
                              key={summary.id}
                              className="flex items-center text-gray-700"
                            >
                              <IconShow iconName={summary.icons.icon_name} />
                              <span className="ml-2 text-sm text-gray-900">
                                {summary.value}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {property.property_summaries
                        .slice(3, 4)
                        .map((summary) => (
                          <div
                            key={summary.id}
                            className="flex items-center text-gray-700"
                          >
                            <div>
                              <IconShow iconName={summary.icons.icon_name} />
                            </div>
                            <span className="ml-2 text-sm text-blue-900">
                              {summary.value}
                            </span>
                          </div>
                        ))}
                    </div>
                    <div className="flex flex-row flex-wrap md:justify-between justify-start items-center gap-[5px] sm:gap-[25px] ">
                      {/* Buttons */}
                      <div className="flex">
                      <div className="mr-[6px]">
                        <Link
                          href={`/Property/${property.property_id}`}
                          style={{
                            background:
                              "linear-gradient(90deg, #313881, #0678B4)",
                          }}
                          className="text-[11px] md:text-[14px] xl:text-[16px] h-[40px] sm:px-4 px-[5px] py-2 text-white font-semibold rounded-md"
                          onClick={() => handleCardClick(index)}
                        >
                          See Details
                        </Link>
                      </div>

                      <div>
                        <Link
                          href={`/Property/${property.property_id}`}
                          style={{
                            background:
                              "linear-gradient(90deg, #313881, #0678B4)",
                          }}
                          className="text-[11px] md:text-[14px] xl:text-[16px] h-[40px] sm:px-4 py-2 px-[5px] text-white font-semibold rounded-md"
                          onClick={() => handleCardClick(index)}
                        >
                          Book Now
                        </Link>
                      </div>
                      </div>
                      <div className="md:hidden block mt-[10px]">
                        <a
                          href={`tel:${contactNumber?.Phone}`} // Use the `tel:` protocol
                          className="mr-[-1px] ml-0"
                         
                        >
                          
                          <div className="phone-call md:w-[50px] md:h-[50px] w-[37px] h-[37px] ml-[15px]">
                            <FaPhone className="i md:ml-[17px] md:mt-[17px] mt-[10px] ml-[10px]" />
                          </div>
                        </a>
                      </div>
                      <div className="md:hidden block mt-[10px]">
                        <Link
                          href={`https://wa.me/${contactNumber[0]?.Phone}`}
                          className="mx-[10px]"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="btn-whatsapp-pulse btn-whatsapp-pulse-border md:w-[50px] md:h-[50px] w-[36px] h-[36px] md:mt-[0px] mt-[-5px] ml-[15px]">
                            <FaWhatsapp className="w-[25px] h-[25px] text-white" />
                          </span>
                        </Link>
                      </div>
                      <div className="md:block hidden">
                      <div className="flex justify-start md:justify-start">
                        <div className="flex items-center">
                          <span className="text-black md:text-[16px] text-[14px] font-bold">
                            For instant service:{" "}
                          </span>
                          <div className="mr-[5px] mt-[10px]">
                            <a
                             href={`tel:${contactNumber?.Phone}`} 
                              className="mx-[10px]"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <div className="phone-call md:w-[50px] md:h-[50px] w-[36px] h-[36px] ml-[15px]">
                                <FaPhone className="i md:ml-[17px] md:mt-[17px] mt-[8px] ml-[11px]" />
                              </div>
                            </a>
                          </div>
                          <div>
                            <Link
                              href={`https://wa.me/${contactNumber?.Phone}`}
                              className="mx-[10px]"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="btn-whatsapp-pulse btn-whatsapp-pulse-border md:w-[50px] md:h-[50px] w-[36px] h-[36px] md:mt-[0px] mt-[-5px] ">
                                <FaWhatsapp className="w-[25px] h-[25px] text-white" />
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                   
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center mt-20">
          <TailSpin height="80" width="80" color="#0678B4" />
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
}
