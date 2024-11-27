import styled from "styled-components";

export const DashboardWrapper = styled.div`
  && {
    padding: 1em;
  }
  .search-bar {
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-end;
  }
  .search-bar .search.selection {
    width: 100%;
  }
`;

export const DataGridWrpper = styled.div`
  .ag-theme-alpine {
    padding: 16px;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 15px;
    box-shadow: 0px 4px 31px 0px #2c323f1a;
  }
  .ag-header,
  .ag-root-wrapper {
    border: none;
  }
  .plot-container {
    width: 100%;
    max-width: 1200px;
    min-width: 300px;
    margin: 0 auto;

    box-sizing: border-box; /* Include padding and border in the element's total width */
  }
  .js-plotly-plot .plotly .main-svg {
    width: 100%;
  }
`;


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

