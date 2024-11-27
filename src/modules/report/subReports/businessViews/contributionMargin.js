import React, { useState, useEffect, useCallback, useRef } from "react";
import { Dropdown, Button, Loader } from "semantic-ui-react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import API_BASE_URL from '../../../../endPoint';

import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { CsvExportModule } from "@ag-grid-community/csv-export";

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

const ContributionMargin = () => {
  const gridRef1 = useRef(null);
  const gridRef2 = useRef(null);

  const [forecastOptions, setForecastOptions] = useState([]);
  const [workingForecastOptions, setWorkingForecastOptions] = useState([]);
  const [budgetedOptions, setBudgetedOptions] = useState([]);
  const [realOptions, setRealOptions] = useState([]);
  const [forecastVersion, setForecastVersion] = useState("");
  const [workingForecastVersion, setWorkingForecastVersion] = useState("");
  const [budgetedVersion, setBudgetedVersion] = useState("");
  const [realVersion, setRealVersion] = useState("");
  const [qRowData, setQRowData] = useState([]);
  const [qColumnDefs, setQColumnDefs] = useState([]);
  const [hRowData, setHRowData] = useState([]);
  const [hColumnDefs, setHColumnDefs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDropdownOptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/contributionMargin/get_options`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setForecastOptions(response.data.forecastOptions);
      setWorkingForecastOptions(response.data.workingForecastOptions);
      setBudgetedOptions(response.data.budgetedOptions);
      setRealOptions(response.data.realOptions);

      if (response.data.forecastOptions.length > 0) {
        setForecastVersion(response.data.forecastOptions[0].value);
      }
      if (response.data.workingForecastOptions.length > 0) {
        setWorkingForecastVersion(response.data.workingForecastOptions[0].value);
      }
      if (response.data.budgetedOptions.length > 0) {
        setBudgetedVersion(response.data.budgetedOptions[0].value);
      }
      if (response.data.realOptions.length > 0) {
        setRealVersion(response.data.realOptions[0].value);
      }
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyColumnStyle = (columnDefs) => {
    return columnDefs.map(col => {
      const style = params => {
        if (typeof params.value === 'string') {
          return params.value.includes('-') ? { color: 'red', fontSize: '14px', fontWeight: '600' } : { color: 'green', fontSize: '14px', fontWeight: '600' };
        } else if (typeof params.value === 'number') {
          return params.value < 0 ? { color: 'red', fontSize: '14px', fontWeight: '600' } : { color: 'green', fontSize: '14px', fontWeight: '600' };
        }
        return { fontSize: '14px', fontWeight: '600' };
      };

      if (col.children) {
        return {
          ...col,
          headerClass: 'header-cell',
          children: col.children.map(childCol => ({
            ...childCol,
            headerClass: 'header-cell',
            cellStyle: style
          }))
        };
      } else {
        return {
          ...col,
          headerClass: 'header-cell',
          cellStyle: style
        };
      }
    });
  };

  const fetchGridData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/contributionMargin/get_cm_tables`, {
        params: {
          forecastVersion,
          workingForecastVersion,
          budgetedVersion,
          realVersion,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setQRowData(response.data.qRowData);
      setQColumnDefs(applyColumnStyle(response.data.qColumnDefs));
      setHRowData(response.data.hRowData);
      setHColumnDefs(applyColumnStyle(response.data.hColumnDefs));
    } catch (error) {
      console.error("Error fetching grid data:", error);
    } finally {
      setLoading(false);
    }
  }, [forecastVersion, workingForecastVersion, budgetedVersion, realVersion]);

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    if (forecastVersion && workingForecastVersion && budgetedVersion && realVersion) {
      fetchGridData();
    }
  }, [forecastVersion, workingForecastVersion, budgetedVersion, realVersion, fetchGridData]);

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
    window.addEventListener("resize", () => params.api.sizeColumnsToFit());
  };

  const getRowStyle = params => {
    return { background: params.node.rowIndex % 2 === 0 ? '#F0FAFF' : '#E0F5FF', fontSize: '14px', fontWeight: '600' };
  };

  const exportToCsv = (gridRef) => {
    gridRef.current.api.exportDataAsCsv();
  };

  const renderGrid = (rowData, columnDefs, gridRef) => (
    <div
      className="ag-theme-quartz w-full shadow-lg h-fit p-2 rounded-xl"
      style={{ 
        height: '420px', 
        border: '1px solid #00539f', 
        backgroundColor: '#f0f8ff',
        '--ag-header-background-color': '#0070ad', 
        '--ag-cell-horizontal-border': 'solid',
        '--ag-cell-vertical-border': 'solid',
        '--ag-header-cell-text-color': 'white',
        '--ag-header-foreground-color': 'white',
        '--ag-border-color': '#d3d3d3',
        '--ag-border-width': '1px',
        '--ag-header-cell-font-weight': 'bold',
        '--ag-header-cell-border-right': '1px solid #d3d3d3',
        '--ag-header-cell-border-bottom': '1px solid #d3d3d3',
        '--ag-cell-text-align': 'center',
      }}
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Loader active inline="centered" />
        </div>
      ) : (
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: false,
            filter: false,
            resizable: false,
            minWidth: 30,
            maxWidth: 150,
            cellStyle: { backgroundColor: "#f9f9f9", borderRight: "1px solid #d3d3d3", color: "#00539f", fontSize: "14px", fontWeight: "600" },
          }}
          getRowStyle={getRowStyle}
          onGridReady={(params) => {
            onGridReady(params);
            params.api.sizeColumnsToFit();
            window.addEventListener('resize', () => params.api.sizeColumnsToFit());
          }}
          suppressExcelExport={true}
          autoSizeStrategy='SizeColumnsToContentStrategy'
          className="w-full h-full"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-4 p-4" style={{ height: "auto" }}>
      <div className="flex justify-between space-x-4">
        <div className="flex space-x-4">
          <Dropdown
            placeholder="Select Forecast Version"
            selection
            options={forecastOptions}
            value={forecastVersion}
            onChange={(e, { value }) => setForecastVersion(value)}
            className="capgemini-dropdown"
            style={{ minWidth: "200px", border: "1px solid #00539f", borderRadius: "4px", padding: "10px" }}
          />
          <Dropdown
            placeholder="Select Working Forecast Version"
            selection
            options={workingForecastOptions}
            value={workingForecastVersion}
            onChange={(e, { value }) => setWorkingForecastVersion(value)}
            className="capgemini-dropdown"
            style={{ minWidth: "200px", border: "1px solid #00539f", borderRadius: "4px", padding: "10px" }}
          />
          <Dropdown
            placeholder="Select Budgeted Version"
            selection
            options={budgetedOptions}
            value={budgetedVersion}
            onChange={(e, { value }) => setBudgetedVersion(value)}
            className="capgemini-dropdown"
            style={{ minWidth: "200px", border: "1px solid #00539f", borderRadius: "4px", padding: "10px" }}
          />
          <Dropdown
            placeholder="Select Real Version"
            selection
            options={realOptions}
            value={realVersion}
            onChange={(e, { value }) => setRealVersion(value)}
            className="capgemini-dropdown"
            style={{ minWidth: "200px", border: "1px solid #00539f", borderRadius: "4px", padding: "10px" }}
          />
        </div>
        <div className="flex space-x-4">
          <Button basic color="blue" onClick={() => exportToCsv(gridRef1)} primary>Export Q Data to CSV</Button>
          <Button basic color="blue" onClick={() => exportToCsv(gridRef2)} primary>Export H Data to CSV</Button>
        </div>
      </div>
      <div className="space-y-4 h-[full]">
        {renderGrid(qRowData, qColumnDefs, gridRef1)}
        {renderGrid(hRowData, hColumnDefs, gridRef2)}
      </div>
    </div>
  );
};

export default ContributionMargin;
