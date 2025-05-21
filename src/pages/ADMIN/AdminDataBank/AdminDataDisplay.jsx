import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./AdminDataDisplay.module.css";
import AdminLayout from "../../../components/Layouts/AdminLayout";
import { MdLocationOn } from "react-icons/md";

const AdminDataDisplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const databankId = location.state?.databankId || null;
  const accessToken = localStorage.getItem("access_token");

  const [data, setData] = useState(null);
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [addProjectError, setAddProjectError] = useState("");
  const [addingProjectId, setAddingProjectId] = useState(null); // for per-button loading

  useEffect(() => {
    if (!databankId) {
      setErrorMessage("Invalid request: No databank ID provided.");
      return;
    }

    axios
      .get(`https://testcrmback.up.railway.app/databank/admin_single_databank/${databankId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setData(response.data[0]);
        } else {
          setErrorMessage("No data found.");
        }
      })
      .catch(() => setErrorMessage("Failed to load data."));

    fetchImages();
  }, [databankId, accessToken]);

  const fetchImages = () => {
    axios
      .get(`https://testcrmback.up.railway.app/databank/admin_view_images/${databankId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => setImages(response.data))
      .catch(() => setImages([]));
  };

  const openProjectModal = () => {
    setShowProjectModal(true);
    setAddProjectError("");

    axios
      .get("https://testcrmback.up.railway.app/project/list_projects/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const projects = res.data?.projects || [];
        setProjectList(projects);
      })
      .catch(() => setAddProjectError("Failed to load projects."));
  };

  const addToProject = (projectId) => {
    setAddingProjectId(projectId);
    setAddProjectError("");

    axios
      .post(
        `https://testcrmback.up.railway.app/project/add_data_into_project/${projectId}/`,
        { data_bank_ids: [databankId] },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then(() => {
        setShowProjectModal(false);
        navigate("/admin_projects"); // ✅ redirect after successful add
      })
      .catch(() => {
        setAddProjectError("Failed to add to project.");
      })
      .finally(() => {
        setAddingProjectId(null);
      });
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h1 className={styles.header}>Databank Details</h1>

        {errorMessage ? (
          <p className={styles.error}>{errorMessage}</p>
        ) : data ? (
          <div className={styles.card}>
  {data.name && <p><strong>Name:</strong> {data.name}</p>}
  {data.phonenumber && <p><strong>Phone:</strong> {data.phonenumber}</p>}
  {data.district && <p><strong>District:</strong> {data.district}</p>}
  {data.place && <p><strong>Place:</strong> {data.place}</p>}
  {data.address && <p><strong>Address:</strong> {data.address}</p>}
  {data.purpose && <p><strong>Purpose:</strong> {data.purpose}</p>}
  {data.mode_of_property && <p><strong>Property Type:</strong> {data.mode_of_property}</p>}
  {data.demand_price && <p><strong>Demand Price:</strong> ₹{data.demand_price}</p>}
  {data.advance_price && <p><strong>Advance Price:</strong> ₹{data.advance_price}</p>}
  {data.area_in_sqft && <p><strong>Area (sqft):</strong> {data.area_in_sqft}</p>}
  {data.area_in_cent && <p><strong>Area (cent):</strong> {data.area_in_cent}</p>}
  {data.location_preferences && <p><strong>Location Preferences:</strong> {data.location_preferences}</p>}
  {data.building_roof && <p><strong>Building Roof:</strong> {data.building_roof}</p>}
  {data.number_of_floors && <p><strong>Number of Floors:</strong> {data.number_of_floors}</p>}
  {data.building_bhk && <p><strong>BHK:</strong> {data.building_bhk}</p>}
  {data.additional_note && <p><strong>Additional Note:</strong> {data.additional_note}</p>}
  {data.care_of && <p><strong>Care Of:</strong> {data.care_of}</p>}
  {data.lead_category && <p><strong>Lead Category:</strong> {data.lead_category}</p>}

  {data.is_in_project ? (
    <p>
      <strong>Project:</strong>{" "}
      <span className={styles.projectName}>{data.project_name}</span>
    </p>
  ) : (
    <p>
      <strong>Project:</strong>{" "}
      <button className={styles.addProjectBtn} onClick={openProjectModal}>
        + Add to Project
      </button>
    </p>
  )}

  {data.location_link && (
    <div className={styles.imageWrapper}>
      <div className={styles.mapBox}>
        <iframe
          title="Google Map"
          width="100%"
          height="300"
          frameBorder="0"
          style={{ border: 0 }}
          src={`https://www.google.com/maps?q=${data.location_link}&output=embed`}
          allowFullScreen
        />
      </div>
    </div>
  )}
</div>

        ) : (
          <p className={styles.loading}>Loading data...</p>
        )}

        <div className={styles.backButtonWrapper}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>← Back</button>
        </div>

        {/* Modal */}
        {showProjectModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Select a Project</h3>
              {addProjectError && <p className={styles.error}>{addProjectError}</p>}
              <ul className={styles.projectList}>
                {projectList.length === 0 ? (
                  <p>No projects available.</p>
                ) : (
                  projectList.map((proj) => (
                    <li key={proj.id} className={styles.projectItem}>
                      <div>
                        <strong>{proj.project_name}</strong><br />
                        <small>{proj.description}</small><br />
                        <small><strong>Start:</strong> {proj.start_date}</small><br />
                        <small><strong>Deadline:</strong> {proj.deadline}</small>
                      </div>
                      <button
                        className={styles.selectBtn}
                        onClick={() => addToProject(proj.id)}
                        disabled={addingProjectId !== null}
                      >
                        {addingProjectId === proj.id ? "Adding..." : "Add"}
                      </button>
                    </li>
                  ))
                )}
              </ul>
              <button className={styles.closeBtn} onClick={() => setShowProjectModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDataDisplay;
