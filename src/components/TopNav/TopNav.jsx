import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import styles from "./TopNav.module.css";
import { FaBolt } from "react-icons/fa";
// Global set to track seen messages
const seenMessages = new Set();

const TopNav = () => {
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const accessToken = localStorage.getItem("access_token");

  const addNotification = (message) => {
    if (typeof message !== "string" || seenMessages.has(message)) return;
    seenMessages.add(message);
    setNotifications((prev) => [message, ...prev]);
  };

  useEffect(() => {
    const notificationSocket = new WebSocket("wss://bussinesstoolcrm.up.railway.app/ws/notifications/");
    const leadNotificationSocket = new WebSocket("wss://bussinesstoolcrm.up.railway.app/ws/lead-notifications/");

    notificationSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const msg = data.message || data;
        addNotification(msg);
      } catch (err) {
        console.error("Notification parse error:", err);
      }
    };

    leadNotificationSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const msg = data.message || data.notification || "New lead notification";
        addNotification(msg);
      } catch (err) {
        console.error("Lead notification parse error:", err);
      }
    };

    notificationSocket.onerror = (error) => console.error("Notification WS error:", error);
    leadNotificationSocket.onerror = (error) => console.error("Lead WS error:", error);

    return () => {
      notificationSocket.close();
      leadNotificationSocket.close();
    };
  }, []);

  useEffect(() => {
    const fetchReminders = async () => {
      if (!accessToken) return;
      try {
        const res = await axios.get("https://testcrmback.up.railway.app/task/get_event_reminder/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const reminderMessages = (res.data.notifications || []).map((n) => n.message);
        reminderMessages.forEach(addNotification);
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };

    fetchReminders();
    const interval = setInterval(fetchReminders, 300000); // every 5 minutes
    return () => clearInterval(interval);
  }, [accessToken]);

  const handleProfileClick = () => navigate("/admin_profile");

  const handleSearch = async (searchTerm = query) => {
  if (!searchTerm.trim() || isSearching) return;

  setIsSearching(true);
  try {
    const response = await axios.get(
      `https://testcrmback.up.railway.app/databank/search_in_databank/?q=${encodeURIComponent(searchTerm)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const { results, source } = response.data;
    if (!results || results.length === 0) {
      alert("No results found.");
    } else {
      navigate("/admin_search_result", { state: { results, query: searchTerm, source } });
    }
  } catch (error) {
    console.error("Search error:", error);
    alert("Error occurred while searching.");
  } finally {
    setIsSearching(false);
  }
};


  const handleInputChange = (e) => {
  const value = e.target.value;
  setQuery(value);

  if (typingTimeout) clearTimeout(typingTimeout);

  const newTimeout = setTimeout(async () => {
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await axios.get(
        `https://testcrmback.up.railway.app/databank/auto_complete_search_admin/?q=${encodeURIComponent(value)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSuggestions(res.data.suggestions || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Suggestion fetch error:", err);
    }
  }, 300); // 300ms debounce

  setTypingTimeout(newTimeout);
};


  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <div className={styles.topnav}>
        <div className={styles.searchContainer}>
  <input
    type="text"
    value={query}
    onChange={handleInputChange}
    onKeyDown={handleKeyDown}
    className={styles.searchBar}
    placeholder="Search..."
    onFocus={() => setShowSuggestions(suggestions.length > 0)}
    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
  />

  {isSearching && <div className={styles.thunderSpinner}>
    <FaBolt />
  </div>} {/* Spinner here */}

  {showSuggestions && suggestions.length > 0 && (
    <ul className={styles.suggestionDropdown}>
      {suggestions.map((s, i) => (
        <li
          key={i}
          onClick={() => {
            setQuery(s);
            setSuggestions([]);
            setShowSuggestions(false);
            handleSearch(s);
          }}
        >
          {s}
        </li>
      ))}
    </ul>
  )}
</div>


        <div className={styles.topnavIcons}>
          <div className={styles.bellbox} onClick={() => setShowModal(true)}>
            <FaBell className={styles.bellicon} />
            {notifications.length > 0 && (
              <span className={styles.badge}>{notifications.length}</span>
            )}
          </div>

          <div className={styles.userInfo} onClick={handleProfileClick}>
            <FaUserCircle className={styles.icon} />
            <span className={styles.username}>Admin</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.notificationModal}>
          <div className={styles.modalContent}>
            <h3>Notifications</h3>
            <button
              className={styles.closeButton}
              onClick={() => {
                setShowModal(false);
                setNotifications([]);
              }}
            >
              Close
            </button>
            <ul className={styles.notificationList}>
              {notifications.length > 0 ? (
                notifications.map((msg, index) => (
                  <li key={index}>{typeof msg === "string" ? msg : JSON.stringify(msg)}</li>
                ))
              ) : (
                <li>No new notifications</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNav;
