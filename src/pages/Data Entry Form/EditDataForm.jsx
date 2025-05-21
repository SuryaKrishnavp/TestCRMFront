import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import styles from './DataEntry.module.css';
import StaffLayout from "../../components/Layouts/SalesMLayout";

const DataEditForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const databankId = location.state?.databankId || null;
  const accessToken = localStorage.getItem("access_token");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phonenumber: "",
    district: "",
    place: "",
    location_preferences: "",
    address: "",
    purpose: "",
    mode_of_property: "",
    demand_price: "",
    advance_price: "",
    area_in_sqft: "",
    area_in_cent: "",
    building_roof: "",
    number_of_floors: "",
    building_bhk: "",
    additional_note: "",
    location_link: "",
    lead_category: "",
    image_folder: "",
    care_of: "",
  });

  const predefinedCategories = [
    "General Lead",
    "Marketing data",
    "Social Media",
    "Main data"
  ];

  useEffect(() => {
    if (!databankId) return console.error("❌ Databank ID is missing.");

    axios.get(`https://testcrmback.up.railway.app/databank/detaildata/${databankId}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => {
      const rawData = response.data;
      const cleanedData = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value ?? ""])
      );
      setFormData((prev) => ({ ...prev, ...cleanedData }));
    })
    .catch((error) => {
      console.error("❌ Error fetching databank data:", error.response?.data || error.message);
      setErrorMessage("Failed to fetch databank data.");
    });
  }, [databankId, accessToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!databankId) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          formDataToSend.append(key, value);
        }
      });

      await axios.patch(
        `https://testcrmback.up.railway.app/databank/editdata_Databank/${databankId}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Data Edited successfully!");
      navigate(-1);
    } catch (error) {
      console.error("❌ Error submitting data:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || "Failed to submit data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StaffLayout>
      <div className={styles['form-container']}>
        <h2 className={styles.header}>
          Step {step}: {step === 1 ? "Personal Details" : "Property Details"}
        </h2>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className={styles['input-field']} />
              <input name="phonenumber" value={formData.phonenumber} onChange={handleChange} placeholder="Phone" className={styles['input-field']} />
              <input name="district" value={formData.district} onChange={handleChange} placeholder="District" className={styles['input-field']} />
              <input name="place" value={formData.place} onChange={handleChange} placeholder="Place" className={styles['input-field']} />
              <input name="location_preferences" value={formData.location_preferences} onChange={handleChange} placeholder="Location Preferences" className={styles['input-field']} />
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className={styles['input-field']} />
              <select
                              name="purpose"
                              value={formData.purpose}
                              onChange={handleChange}
                              required
                              className={styles['select-field']}
                            >
                              <option value="">Select Purpose</option>
                              <option value="For Selling a Property">For Selling a Property</option>
                              <option value="For Buying a Property">For Buying a Property</option>
                              <option value="For Rental or Lease">For Rental or Lease</option>
                              <option value="Looking to Rent or Lease Property">Looking to Rent or Lease Property</option>
                            </select>
              <input name="mode_of_property" value={formData.mode_of_property} onChange={handleChange} placeholder="Property Type" className={styles['input-field']} />
              <button type="button" onClick={() => setStep(2)} className={`${styles['button']} ${styles['button-next']}`}>Next</button>
            </>
          ) : (
            <>
              <input name="demand_price" value={formData.demand_price} onChange={handleChange} placeholder="Demand Price" className={styles['input-field']} />
              <input name="advance_price" value={formData.advance_price} onChange={handleChange} placeholder="Advance Price" className={styles['input-field']} />
              <input name="area_in_sqft" value={formData.area_in_sqft} onChange={handleChange} placeholder="Area in Sqft" className={styles['input-field']} />
              <input name="area_in_cent" value={formData.area_in_cent} onChange={handleChange} placeholder="Area in Cent" className={styles['input-field']} />
              <input name="building_roof" value={formData.building_roof} onChange={handleChange} placeholder="Building Roof" className={styles['input-field']} />
              <input name="number_of_floors" value={formData.number_of_floors} onChange={handleChange} placeholder="Number of Floors" className={styles['input-field']} />
              <input name="building_bhk" value={formData.building_bhk} onChange={handleChange} placeholder="BHK" className={styles['input-field']} />
              <textarea name="additional_note" value={formData.additional_note} onChange={handleChange} placeholder="Additional Notes" className={styles['textarea-field']} />
              <input name="location_link" value={formData.location_link} onChange={handleChange} placeholder="Google Maps Link" className={styles['input-field']} />

              <select name="lead_category" value={formData.lead_category} onChange={handleChange} className={styles['select-field']} required>
                <option value="">Choose Lead Category</option>
                {predefinedCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <input name="image_folder" value={formData.image_folder} onChange={handleChange} placeholder="Image Folder" className={styles['input-field']} />
              <input name="care_of" value={formData.care_of} onChange={handleChange} placeholder="Care Of" className={styles['input-field']} />

              <button type="button" onClick={() => setStep(1)} className={`${styles['button']} ${styles['button-back']}`}>Back</button>
              <button type="submit" className={`${styles['button']} ${styles['button-submit']}`} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Submit"}
              </button>
            </>
          )}
        </form>
      </div>
    </StaffLayout>
  );
};

export default DataEditForm;
