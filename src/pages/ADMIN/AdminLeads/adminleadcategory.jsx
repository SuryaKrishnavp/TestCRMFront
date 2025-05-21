import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./leadcategory.module.css";
import AdminLayout from "../../../components/Layouts/AdminLayout";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminLeadCategoryGraph = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [activeTab, setActiveTab] = useState("Category graph");
  const [selectedGraph, setSelectedGraph] = useState("Total");
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");

  const tabPaths = {
    "Analytics": "/admin_lead_analytics",
    "New": "/admin_new_leads",
    "Followed": "/admin_followed_leads",
    "Closed": "/admin_closed_leads",
    "Unsuccessfully": "/admin_unsuccess_lead",
    "Pending": "/admin_pending_leads",
    "Category": "/adminleadcategorygraph",
  };

  useEffect(() => {
    const matchedTab = Object.keys(tabPaths).find(
      (tab) => tabPaths[tab] === location.pathname
    );
    setActiveTab(matchedTab || "Analytics");
  }, [location.pathname]);

  const predefinedCategories = [
    "General Lead",
    "Marketing data",
    "Social Media",
    "Main data",
  ];

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }
    fetchLeadCategoryGraph();
  }, [selectedGraph]);

  const fetchLeadCategoryGraph = async () => {
    const baseURL = "https://testcrmback.up.railway.app/databank";
    const endpoint =
      selectedGraph === "Monthly"
        ? "/lead_category_current_month/"
        : "/lead_category_graph/";
  
    try {
      const res = await axios.get(`${baseURL}${endpoint}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      const apiData = selectedGraph === "Monthly" ? res.data.data : res.data;
      const categoryMap = {};
      apiData.forEach((item) => {
        categoryMap[item.lead_category] = item.count;
      });
  
      const fullData = predefinedCategories.map((lead_category) => ({
        lead_category,
        count: categoryMap[lead_category] || 0,
      }));
  
      setCategoryData(fullData);
    } catch (error) {
      console.error("Error fetching lead category graph:", error);
    }
  };
  

  const chartData = {
    labels: categoryData.map((item) => item.lead_category),
    datasets: [
      {
        label: selectedGraph === "Total" ? "Total Leads" : "Monthly Leads",
        data: categoryData.map((item) => item.count),
        backgroundColor: [
          "#007bff",
          "#28a745",
          "#dc3545",
          "#ffc107",
          "#6f42c1",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: `Lead Categories Overview - ${selectedGraph}` },
    },
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    navigate(tabPaths[tabName]);
  };

  const handleGraphSelect = (event) => {
    setSelectedGraph(event.target.value);
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerTop}>
          <h2 className={styles.title}>Lead Category Graph</h2>
          
        </div>

        {/* Tabs */}
        <div className={styles.tabContainer}>
          {Object.keys(tabPaths).map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Graph Container */}
        <div className={styles.graphsContainer}>
          <div className={styles.graphCard}>
          <div className={styles.graphSelectContainer}>
      <select
        value={selectedGraph}
        onChange={handleGraphSelect}
        className={styles.graphSelect}
      >
        <option value="Total">Total</option>
        <option value="Monthly">Monthly</option>
      </select>
    </div>
            <div className={styles.graphWrapper}>
              <Bar data={chartData} options={options} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLeadCategoryGraph;
