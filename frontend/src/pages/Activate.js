import { useEffect, useState } from "react";

import axiosInstance from "../axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

function Activate() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("token");

  useEffect(() => {
    async function active() {
      try {
        const response = await axiosInstance.get(`/api/v1/auth/confirm?token=${search}`);
        navigate("/login")
      } catch (err) {

      }
      return;
    }
    active();
  }, []);


  return (
    <>

    </>
  );
}

export default Activate;