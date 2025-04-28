'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  const [visiblePages, setVisiblePages] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, isClient]);

  useEffect(() => {
    if (!isClient) return;

    const calculateVisiblePages = () => {
      const maxVisiblePages = window.innerWidth < 768 ? 3 : 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      setVisiblePages(Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
    };

    calculateVisiblePages();
    window.addEventListener("resize", calculateVisiblePages);
    return () => window.removeEventListener("resize", calculateVisiblePages);
  }, [currentPage, totalPages, isClient]);

  useEffect(() => {
    if (!isClient || !router.events) return;

    const handleRouteChange = (url) => {
      if (url === "/") {
        handlePageChange(1);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, handlePageChange, isClient]);

  if (!isClient) {
    return (
      <div className="flex justify-center items-center my-10">
        <button
          disabled
          className="px-4 py-2 mx-1 text-sm font-medium text-white border border-gray-300 rounded-lg opacity-50"
          style={{
            background: "linear-gradient(90deg, #313881, #0678B4)",
          }}
        >
          Previous
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
          <button
            key={i + 1}
            className={`px-4 py-2 mx-1 text-sm font-medium ${
              currentPage === i + 1 ? "text-black bg-blue-500" : "text-gray-700 bg-white"
            } border border-gray-300 rounded-lg`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled
          className="px-4 py-2 mx-1 text-sm font-medium text-white border border-gray-300 rounded-lg opacity-50"
          style={{
            background: "linear-gradient(90deg, #313881, #0678B4)",
          }}
        >
          Next
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center my-10">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 text-sm font-medium text-white border border-gray-300 rounded-lg disabled:opacity-50"
        style={{
          background: "linear-gradient(90deg, #313881, #0678B4)",
        }}
      >
        Previous
      </button>

      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className={`px-4 py-2 mx-1 text-sm font-medium ${
              currentPage === 1
                ? "text-white bg-blue-500"
                : "text-gray-700 bg-white"
            } border border-gray-300 rounded-lg`}
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="px-4 py-2 mx-1 text-sm text-gray-700">...</span>
          )}
        </>
      )}

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 mx-1 text-sm font-medium ${
            currentPage === page ? "text-black bg-blue-500" : "text-gray-700 bg-white"
          } border border-gray-300 rounded-lg`}
        >
          {page}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="mx-1">...</span>
          )}
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`px-4 py-2 mx-1 text-sm font-medium ${
              currentPage === totalPages ? "text-black bg-blue-500" : "text-gray-700 bg-white"
            } border border-gray-300 rounded-lg`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 text-sm font-medium text-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(90deg, #313881, #0678B4)",
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;