import React, { useState } from 'react';
import { TableWrapper } from './style';
import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';

const Table = ({ tableData }) => {
  // Ensure filters and sorting are disabled for each column
  const [columnDefs] = useState(
    tableData.properties.map((col) => ({
      ...col,
      filter: false,  // Disable filtering on each column
      sortable: false // Disable sorting on each column
    }))
  );
  const [rowData] = useState(tableData.data);

  return (
    <TableWrapper>
      <div className="ag-theme-alpine" style={{ height: 285, width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: false,  // Disable sorting globally
            resizable: true   // Keep columns resizable
          }}
          pagination={false}
          paginationPageSize={5}
        />
      </div>
    </TableWrapper>
  );
};

export default Table;
