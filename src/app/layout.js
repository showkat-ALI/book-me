import Footer from "./components/shared/Footer/Footer";
import "./globals.css";
import { Inter } from "next/font/google";
import { SearchProvider } from "@/SearchContext";
import { PaginationProvider } from "@/services/tour/usePagination";
import HeaderWrapper from "./components/HeadWrapper/HeaderWrapper";

// Font setup at module scope
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});
// This is the main layout of the website with all
export default function DashboardLayout({ children }) {
  

  return (
    <html lang="en" data-theme="white">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bookme</title>
        {/* <link
          rel="icon"
          href="assets/images/tangular-logo.svg"
          type="image/svg+xml"
        /> */}
      </head>
      <body className={inter.className}>
        {/*global search provider*/}
        <PaginationProvider>
        <SearchProvider>
          {" "}
          {/* Wrap children inside provider */}
          <div>
            <div className="bg-white">
              <main>
                <div className="">

            <HeaderWrapper/>
            </div>

                <div className="min-h-[100vh] py-[2
                0px]">{children}</div>

                <Footer />
              </main>
            </div>
          </div>
        </SearchProvider>
        </PaginationProvider>

      </body>
    </html>
  );
}
