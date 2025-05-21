import React, { useState } from "react";
import styles from "./FilterModal.module.css";

const districts = [
  "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam",
  "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta",
  "Thiruvananthapuram", "Thrissur", "Wayanad"
];

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState({
    district: "",
    place: "",
    location_preferences: "",
    purpose: "",
    mode_of_property: "",
    demand_price_min: "",
    demand_price_max: "",
    advance_price_min: "",
    advance_price_max: "",
    area_in_sqft: "",
    area_in_cent: "",
    building_roof: "",
    number_of_floors: "",
    building_bhk: "",
    lead_category: "",
    distance_km: "",
    timestamp_after: "",
    timestamp_before: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      district: "",
      place: "",
      location_preferences: "",
      purpose: "",
      mode_of_property: "",
      demand_price_min: "",
      demand_price_max: "",
      advance_price_min: "",
      advance_price_max: "",
      area_in_sqft: "",
      area_in_cent: "",
      building_roof: "",
      number_of_floors: "",
      building_bhk: "",
      lead_category: "",
      distance_km: "",
      timestamp_after: "",
      timestamp_before: "",
    });
  };

  const handleApplyFilters = () => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    onApply(queryParams.toString());
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Filters</h2>
          <button className={styles.closeBtn} onClick={onClose}>✖</button>
        </div>

        <div className={styles.filtersContainer}>

          <div className={styles.filterGroup}>
            <label>District</label>
            <select name="district" value={filters.district} onChange={handleChange}>
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Place</label>
            <input type="text" name="place" value={filters.place} onChange={handleChange} />
          </div>

          <div className={styles.filterGroup}>
            <label>Preferred Locations</label>
            <input
              type="text"
              name="location_preferences"
              placeholder="e.g. Thrissur,Ollur"
              value={filters.location_preferences}
              onChange={handleChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Distance Within (km)</label>
            <input
              type="number"
              name="distance_km"
              placeholder="e.g. 5"
              min="0"
              value={filters.distance_km}
              onChange={handleChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Purpose</label>
            <select name="purpose" value={filters.purpose} onChange={handleChange}>
              <option value="">Select Purpose</option>
              <option value="For Selling a Property">For Selling a Property</option>
              <option value="For Buying a Property">For Buying a Property</option>
              <option value="For Rental or Lease">For Rental or Lease</option>
              <option value="Looking to Rent or Lease Property">Looking to Rent or Lease Property</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Type of Property</label>
            <input
              type="text"
              name="mode_of_property"
              placeholder="e.g., House, Land"
              value={filters.mode_of_property}
              onChange={handleChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Demand Price Min</label>
            <input type="number" name="demand_price_min" value={filters.demand_price_min} onChange={handleChange} />
          </div>

          <div className={styles.filterGroup}>
            <label>Demand Price Max</label>
            <input type="number" name="demand_price_max" value={filters.demand_price_max} onChange={handleChange} />
          </div>

          <div className={styles.filterGroup}>
            <label>Advance Price Min</label>
            <input type="number" name="advance_price_min" value={filters.advance_price_min} onChange={handleChange} />
          </div>

          <div className={styles.filterGroup}>
            <label>Advance Price Max</label>
            <input type="number" name="advance_price_max" value={filters.advance_price_max} onChange={handleChange} />
          </div>

          <div className={styles.filterGroup}>
            <label>Area (sqft)</label>
            <input type="text" name="area_in_sqft" value={filters.area_in_sqft} onChange={handleChange} />
          </div>

          <div className={styles.filterGroup}>
            <label>Area (cent)</label>
            <input type="text" name="area_in_cent" value={filters.area_in_cent} onChange={handleChange} />
          </div>

          <div className={styles.filterGroup}>
            <label>Building Roof</label>
            <input type="text" name="building_roof" value={filters.building_roof} onChange={handleChange} />
          </div>

          <div className={styles.filterGroup}>
            <label>Number of Floors</label>
            <input type="text" name="number_of_floors" value={filters.number_of_floors} onChange={handleChange} />
          </div>

          <div className={styles.filterGroup}>
            <label>Bedrooms (BHK)</label>
            <input type="text" name="building_bhk" value={filters.building_bhk} onChange={handleChange} />
          </div>

          <div className={styles.filterGroup}>
            <label>Lead Category</label>
            <input type="text" name="lead_category" value={filters.lead_category} onChange={handleChange} />
          </div>

          <div className={styles.filterGroup}>
            <label>Timestamp After</label>
            <input type="date" name="timestamp_after" value={filters.timestamp_after} onChange={handleChange} />
          </div>

          <div className={styles.filterGroup}>
            <label>Timestamp Before</label>
            <input type="date" name="timestamp_before" value={filters.timestamp_before} onChange={handleChange} />
          </div>

        </div>

        <div className={styles.modalFooter}>
          <button className={styles.resetBtn} onClick={resetFilters}>Reset All</button>
          <button className={styles.applyBtn} onClick={handleApplyFilters}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
