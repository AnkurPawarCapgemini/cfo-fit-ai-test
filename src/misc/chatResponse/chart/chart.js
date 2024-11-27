import React from "react";
import Plot from "react-plotly.js";

export default function Chart({ chartData }) {
  return (
    <Plot
      data={chartData.data}
      layout={chartData.layout}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "15px",
        overflow: "hidden",
      }}
    />
  );
}
