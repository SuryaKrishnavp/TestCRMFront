import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./FilterResult.module.css";
import StaffLayout from "../../components/Layouts/SalesMLayout";
import FancySpinner from "../../components/Loader/Loader";
const FilteredResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const queryParams = new URLSearchParams(location.search);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Authorization token is missing. Please login.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get("https://testcrmback.up.railway.app/databank/filter/", {
        params: Object.fromEntries(queryParams.entries()),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching filtered results:", error);
      setError("Failed to fetch filtered results.");
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [location.search]);



  return (
    <StaffLayout>
      <div className={styles.container}>
        <h2 className={styles.title}>🔍 Filtered Results</h2>
        <button className={styles.backButton} onClick={() => navigate(-1)}>Back</button>

        {isLoading ? (
  <div className={styles.loaderWrapper}><FancySpinner /></div>
) : error ? (
  <p className={styles.error}>{error}</p>
) : data.length === 0 ? (
  <p className={styles.noData}>No matching results found.</p>
) : (
          <div className={styles.resultsContainer}>
            {data.map((item) => (
            <div key={item.id} className={styles.resultCard}>
              <h3>{item.name}</h3>

              {/* Followers if available */}
              {item.followers && item.followers.length > 0 && (
                <p>
                  <strong>Followers:</strong>{" "}
                  {item.followers.map((follower, index) => (
                    <span key={index}>
                      {follower.follower.username}
                      {index < item.followers.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              )}

              {/* Conditionally render each field */}
              {item.phonenumber && <p><strong>Phone:</strong> {item.phonenumber}</p>}
              {item.district && <p><strong>District:</strong> {item.district}</p>}
              {item.place && <p><strong>Place:</strong> {item.place}</p>}
              {item.location_preferences && <p><strong>Location Preferences:</strong> {item.location_preferences}</p>}
              {item.address && <p><strong>Address:</strong> {item.address}</p>}
              {item.purpose && <p><strong>Purpose:</strong> {item.purpose}</p>}
              {item.mode_of_property && <p><strong>Property Type:</strong> {item.mode_of_property}</p>}
              {item.demand_price !== null && item.demand_price !== "" && (
                <p><strong>Demand Price:</strong> ₹{item.demand_price}</p>
              )}
              {item.advance_price !== null && item.advance_price !== "" && (
                <p><strong>Advance Price:</strong> ₹{item.advance_price}</p>
              )}
              {item.area_in_sqft && <p><strong>Area (sqft):</strong> {item.area_in_sqft}</p>}
              {item.area_in_cent && <p><strong>Area (cent):</strong> {item.area_in_cent}</p>}
              {item.building_roof && <p><strong>Roof Type:</strong> {item.building_roof}</p>}
              {item.number_of_floors && <p><strong>Floors:</strong> {item.number_of_floors}</p>}
              {item.building_bhk && <p><strong>BHK:</strong> {item.building_bhk}</p>}
              {item.additional_note && <p><strong>Additional Note:</strong> {item.additional_note}</p>}
              {item.lead_category && <p><strong>Lead Category:</strong> {item.lead_category}</p>}
              {item.status && <p><strong>Status:</strong> {item.status}</p>}
              {item.stage && <p><strong>Stage:</strong> {item.stage}</p>}
              {item.closed_date && <p><strong>Closed Date:</strong> {item.closed_date}</p>}
              {item.care_of && <p><strong>Care Of:</strong> {item.care_of}</p>}
              {item.image_folder && <p><strong>Image Folder:</strong> {item.image_folder}</p>}

              {/* Map iframe only if location_link exists */}
              {item.location_link && (
                <div className={styles.imageWrapper}>
                  <div className={styles.mapBox}>
                    <iframe
                      title="Google Map"
                      width="100%"
                      height="300"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(item.location_link)}&output=embed`}
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          ))}


          </div>
        )}
      </div>
    </StaffLayout>
  );
};

export default FilteredResults;