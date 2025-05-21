import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import styles from "./CreateFollowup.module.css"; // CSS Module

dayjs.extend(utc); // Enable UTC plugin

const FollowUpModal = ({ leadId, onClose, onFollowUpCreated }) => {
  const [followupDate, setFollowupDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Convert selected date/time to UTC format
    const utcFollowUpDate = dayjs(followupDate).utc().format(); // ISO string in UTC

    const followUpData = {
      followup_date: utcFollowUpDate,
      notes,
    };

    const accessToken = localStorage.getItem("access_token");

    try {
      await axios.post(
        `https://testcrmback.up.railway.app/followups/createfollowup/${leadId}/`,
        followUpData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      onFollowUpCreated(); // Refresh follow-ups or notify success
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating follow-up:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className={styles.followupModalOverlay}>
      <div className={styles.followupModalContent}>
        <h2>Create Follow-Up</h2>
        <form onSubmit={handleSubmit}>
          <label>Follow-Up Date & Time</label>
          <input
            type="datetime-local"
            value={followupDate}
            onChange={(e) => setFollowupDate(e.target.value)}
            required
          />

          <label>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />

          <div className={styles.followupButtonGroup}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </button>
            <button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FollowUpModal;
