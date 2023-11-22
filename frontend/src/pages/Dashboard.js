import React, { useContext, useEffect, useState } from 'react'
import PageHeader from "../components/PageHeader";
import { getDashboardData } from '../services/dashboardService';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const isAuthenticated = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData()
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  return (
    <>
      <PageHeader text="Dashboard" />
      <p>{data}</p>
    </>
  )
}

export default Dashboard