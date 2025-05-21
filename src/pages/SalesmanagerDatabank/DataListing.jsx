import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./DataListing.module.css";
import StaffLayout from "../../components/Layouts/SalesMLayout";
import UploadImageModal from "../../components/Modals/AddImageModal";
import UpdateStageModal from "../../components/Modals/UpdateStage";
import { AlignJustify } from "lucide-react";
import { MessageCircle } from "lucide-react"; // or use a WhatsApp SVG/icon
import { ReactComponent as WhatsAppIcon } from "../../assets/WhatsApp.svg";

const DataDisplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const databankId = location.state?.databankId || null;
  const accessToken = localStorage.getItem("access_token");

  const [data, setData] = useState(null);
  const [images, setImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isStageModalOpen, setStageModalOpen] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!databankId) {
      setErrorMessage("Invalid request: No databank ID provided.");
      return;
    }

    axios
      .get(`https://testcrmback.up.railway.app/databank/detaildata/${databankId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        if (res.data && Object.keys(res.data).length > 0) {
          setData(res.data);
          setLeadId(databankId || null);  // or res.data.lead_id depending on your field
        } else {
          setErrorMessage("No data found for this record.");
        }
      })

      .catch(() => setErrorMessage("Failed to load data."));

    fetchImages();
  }, [databankId]);

  const fetchImages = () => {
    axios
      .get(`https://testcrmback.up.railway.app/databank/view_images/${databankId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setImages(res.data))
      .catch(() => setImages([]));
  };

  const handleDeleteImage = (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      axios
        .delete(`https://testcrmback.up.railway.app/databank/delete_image/${databankId}/${imageId}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then(() => setImages((prev) => prev.filter((img) => img.id !== imageId)))
        .catch(() => alert("Failed to delete image."));
    }
  };

  const renderField = (label, value, isCurrency = false) => {
    if (!value) return null;
    return (
      <p>
        <strong>{label}:</strong> {isCurrency ? `₹${value}` : value}
      </p>
    );
  };

  return (
    <StaffLayout>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <button className={styles.editformBtn} onClick={() => navigate("/data_edit_form", { state: { databankId } })}>
            Edit
          </button>
          <div className={styles.menuWrapper}>
            <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
              <AlignJustify size={20} />
            </button>
            {menuOpen && (
              <div className={styles.menuDropdown}>
                <button onClick={() => navigate("/follwup_list", { state: { leadId } })}>Followups</button>
                <button onClick={() => setStageModalOpen(true)}>Update Stage</button>
              </div>
            )}
          </div>
        </div>

        <h1 className={styles.header}>Databank Details</h1>

        {errorMessage ? (
          <p className={styles.error}>{errorMessage}</p>
        ) : data ? (
          <div className={styles.card}>
            {renderField("Name", data.name)}
            {data.phonenumber && (
              <p>
                <strong>Phone:</strong> {data.phonenumber}{" "}
                <a
                  href={`https://wa.me/91${data.phonenumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                  style={{ marginLeft: "8px", display: "inline-flex", alignItems: "center" }}
                >
                  <WhatsAppIcon style={{ width: 20, height: 20 }} />
                </a>
              </p>
            )}


            {renderField("District", data.district)}
            {renderField("Place", data.place)}
            {renderField("Address", data.address)}
            {renderField("Location Preferences", data.location_preferences)}
            {renderField("Purpose", data.purpose)}
            {renderField("Property Type", data.mode_of_property)}
            {renderField("Demand Price", data.demand_price, true)}
            {renderField("Advance Price", data.advance_price, true)}
            {renderField("Area (sqft)", data.area_in_sqft)}
            {renderField("Area (cent)", data.area_in_cent)}
            {renderField("Building Roof", data.building_roof)}
            {renderField("Floors", data.number_of_floors)}
            {renderField("BHK", data.building_bhk)}
            {renderField("Lead Category", data.lead_category)}
            {renderField("Stage", data.stage)}
            {renderField("Image Folder", data.image_folder)}
            {renderField("Additional Notes", data.additional_note)}

            {data.location_link && (
              <div className={styles.mapBox}>
                <iframe
                  title="Map"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${data.location_link}&output=embed`}
                  allowFullScreen
                />
              </div>
            )}

            {images.length > 0 && (
              <>
                <h3 className={styles.imageHeading}>Property Images</h3>
                <div className={styles.imageGrid}>
                  {images.map((img) => (
                    <div key={img.id} className={styles.imageWrapper}>
                      <img src={`https://testcrmback.up.railway.app${img.image}`} alt="Property" className={styles.image} />
                      <span className={styles.deleteIcon} onClick={() => handleDeleteImage(img.id)}>❌</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <button className={styles.addImageBtn} onClick={() => setModalOpen(true)}>➕ Add Image</button>
          </div>
        ) : (
          <p className={styles.loading}>Loading data...</p>
        )}

        <div className={styles.backButtonWrapper}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>← Back</button>
        </div>

        {modalOpen && (
          <UploadImageModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            databankId={databankId}
            onUploadSuccess={fetchImages}
          />
        )}

        {isStageModalOpen && leadId && (
          <UpdateStageModal
            isOpen={isStageModalOpen}
            onClose={() => setStageModalOpen(false)}
            leadId={leadId}
            accessToken={accessToken}
          />
        )}
      </div>
    </StaffLayout>
  );
};

export default DataDisplay;
