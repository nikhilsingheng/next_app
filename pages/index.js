import React, { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";

export default function Home({ homePage }) {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState("");

  useEffect(() => {
    setData(homePage);
  }, [homePage]);

  const fetchData = async (page, search = "") => {
    try {
      const response = await fetchAPI(
        `/adm/get_product?page=${page}&search_text=${search}`
      );
      setCount(response?.count);
      const newData = response && response.data ? response.data : [];
      setData(newData);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchChange = async (event) => {
    const newSearchText = event.target.value;
    setSearchText(newSearchText);
    await fetchData(1, newSearchText);
  };
  const productsCount = count;
  const pageSize = 8;
  const numberofpage = Math.ceil(productsCount / pageSize);

  console.log("numberofpage", numberofpage);
  const handleNextPage = async () => {
    await fetchData(currentPage + 1, searchText);
  };

  const handlePrevPage = async () => {
    await fetchData(currentPage - 1, searchText);
  };

  return (
    <div className="container">
      <div style={{ marginTop: 120, marginBottom: 100 }}>
        <div className="col-lg-3">
          <input
            type="text"
            placeholder="Search..."
            className="form-control"
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>

        <div className="row">
          {data && data.length > 0 ? (
            <>
              {data.map((res, i) => (
                <div className="col-lg-3" key={i}>
                  <div className="card mt-5 custom-card">
                    {res.image_url ? (
                      <img
                        src={res.image_url}
                        className="card-img-top card_heigth"
                        alt="Sample"
                      />
                    ) : (
                      <img
                        src="https://mmh-production.s3.ap-south-1.amazonaws.com/uploads/updated_partner_image_web_new/1680850870-492e27bd-c3b4-469c-ab73-c1691827fecb.webp"
                        className="card-img-top h-50"
                        alt="Sample"
                      />
                    )}

                    <div className="card-body">
                      <p className="card-text">@{res?.slug}</p>
                      <p className="card-text">{res?.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div>
              <p className="text-center mt-5">Data Not Found</p>
            </div>
          )}
          {numberofpage > 1 ? (
            <div className="col-lg-12 mt-3 btn_div">
              <button
                className="btn btn-primary mr-2"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              <div style={{ marginRight: "10px" }}></div>
              <button
                className="btn btn-primary btn_next"
                onClick={handleNextPage}
                disabled={data.length === numberofpage}
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const response = await fetchAPI(`/adm/get_product?page=1`);
    const homePageData = response && response.data ? response.data : [];
    return {
      props: {
        homePage: homePageData,
      },
      revalidate: 1,
    };
  } catch (error) {
    console.error("error:", error);
    return {
      props: {
        homePage: [],
      },
      revalidate: 1,
    };
  }
}
