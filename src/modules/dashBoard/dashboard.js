import React from "react";
import { DashboardWrapper } from "./style";
import DashboardGrid from "./dashboardGrid";

export default function Dashboard() {


  return (
    <DashboardWrapper>
      <div>
        <DashboardGrid />
      </div>
    </DashboardWrapper>
  );
}
