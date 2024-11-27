// styled.js (your styled-components file)
import styled from "styled-components";

export const TableWrapper = styled.div`
 .table-container {
  width: 100%;
  overflow: hidden; /* Ensure no extra scrollbars */
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* Ensure columns have a fixed width */
}

.custom-table th, 
.custom-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.custom-table th {
  position: sticky;
  top: 0; /* Sticky header at the top */
  background-color: #f1f1f1; /* Header background */
  z-index: 1;
}

.table-container {
  max-height: 516px; /* Set the maximum height of the table to enable scrolling */
  overflow-y: auto; /* Scrollable body */
}

.custom-table tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* Alternate row colors */
}


`;

