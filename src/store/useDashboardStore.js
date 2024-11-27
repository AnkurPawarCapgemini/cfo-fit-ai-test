import { create } from "zustand";
import axios from "axios";
import API_BASE_URL from '../endPoint';

const useDashboardStore = create((set) => ({
  dashboardData: [],

  fetchDashboardData: async () => {

    try {
      // Fetch the count of KPIs
      const token = localStorage.getItem('authToken');
      const countResponse = await axios.get(`${API_BASE_URL}/dashboard/kpi_count`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      const count = countResponse.data;
      set( {dashboardData: []} )
      // Initialize an array to hold KPI data
      const kpiData = await Promise.all(
        Array.from({ length: count }, (_, i) => axios.get(`${API_BASE_URL}/dashboard/kpi/${i}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        }))
      ).then(responses => responses.map(response => response.data));

      // Update the store with the fetched KPI data
      set({ dashboardData: kpiData });

    } catch (err) {
      console.error("Error fetching dashboard data", err);
    }
  },

}));

export default useDashboardStore;
