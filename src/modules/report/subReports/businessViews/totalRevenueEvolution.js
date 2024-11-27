import React, { useState, useEffect, useCallback, useRef } from "react";
import { Dropdown, Button, Loader } from 'semantic-ui-react';
import axios from 'axios';
import API_BASE_URL from '../../../../endPoint';

import { AgGridReact } from "ag-grid-react";

import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { CsvExportModule } from "@ag-grid-community/csv-export";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

const TotalRevenueEvolution = () => {
  const gridRef = useRef();
  const [forecastVersion, setForecastVersion] = useState("");
  const [realDataVersion, setRealDataVersion] = useState("");
  const [comparisonType, setComparisonType] = useState("Seq");
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const [forecastOptions, setForecastOptions] = useState([]);
  const [restatedOptions, setRestatedOptions] = useState([]);

  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [quarterData, setQuarterData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (forecastVersion && realDataVersion) {
          const token = localStorage.getItem('authToken');
          const response = await axios.get(`${API_BASE_URL}/reports/total_revenue_evolution/get_tr_table`, {
            params: {
              forecastVersion,
              realDataVersion
            },
            headers: {
              'Authorization': token ? `Bearer ${token}` : ''
            }
          });
          const { rows, columnDefs, quarters } = response.data;
          setRowData(rows);
          setColumnDefs(columnDefs.map(col => {
            if (col.children) {
              return {
                ...col,
                children: col.children.map(childCol => ({
                  ...childCol,
                  cellStyle: params => {
                    if (typeof params.value === 'string') {
                      return params.value.includes('-') ? { color: 'red' } : { color: 'green' };
                    }
                    else if (typeof params.value === 'number') {
                      return params.value < 0? { color: 'red' } : { color: 'green' };
                    }
                    return null;
                  }
                }))
              };
            } else {
              return {
                ...col,
                cellStyle: params => {
                  if (params.value) {
                    return params.value.includes('-') ? { color: 'red' } : { color: 'green' };
                  }
                  return null;
                }
              };
            }
          }));
          setQuarterData(quarters);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [forecastVersion, realDataVersion]);

  useEffect(() => {
    const fetchForecastOptions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/reports/total_revenue_evolution/get_forecast_options`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        setForecastOptions(response.data);
        if (response.data.length > 0) {
          setForecastVersion(response.data[0].value);
        }
      } catch (error) {
        console.error("Error fetching forecast options:", error);
      }
    };

    const fetchRealDataOptions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/reports/total_revenue_evolution/get_restated_options`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        setRestatedOptions(response.data);
        if (response.data.length > 0) {
          setRealDataVersion(response.data[0].value);
        }
      } catch (error) {
        console.error("Error fetching forecast options:", error);
      }
    };

    fetchForecastOptions();
    fetchRealDataOptions();
  }, []);

  const handleSubmit = useCallback(async () => {
    if (comparisonType && forecastVersion && realDataVersion) {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/reports/total_revenue_evolution/get_contributors_by_params`, {
          params: {
            comparisonType,
            forecastVersion,
            realDataVersion
          },
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        const { quarters } = response.data;
        setQuarterData(quarters);
        const allRegions = Object.values(quarters).flat();
        const uniqueRegions = Array.from(new Set(allRegions.map(region => region.name)))
          .map(name => allRegions.find(region => region.name === name));
        setRegions(uniqueRegions);
        if (!selectedRegion || !uniqueRegions.some(region => region.name === selectedRegion)) {
          setSelectedRegion(uniqueRegions.length > 0 ? uniqueRegions[0].name : null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    // eslint-disable-next-line
  }, [comparisonType, forecastVersion, realDataVersion]);

  useEffect(() => {
    handleSubmit();
  }, [comparisonType, forecastVersion, realDataVersion, handleSubmit]);

  const handleComparisonTypeChange = (type) => {
    setComparisonType(type);
  };

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv({fileName: 'total_revenue_evolution.csv'});
  }, []);

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };
  
  const getRowStyle = params => {
    return { background: params.node.rowIndex % 2 === 0 ? '#F0FAFF' : '#E0F5FF', fontSize: '14px', fontWeight: '600' };
  };

  return (
    <div className="space-y-0 p-2">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="flex flex-col m-2">
            <Dropdown
              placeholder="Select Forecast Version"
              selection
              options={forecastOptions}
              value={forecastVersion}
              onChange={(e, { value }) => setForecastVersion(value)}
              className="capgemini-dropdown"
              style={{ minWidth: '200px', border: '1px solid #00539f', borderRadius: '4px', padding: '10px' }}
            />
          </div>
          <div className="flex flex-col m-2">
            <Dropdown
              placeholder="Select Real Data Version"
              selection
              options={restatedOptions}
              value={realDataVersion}
              onChange={(e, { value }) => setRealDataVersion(value)}
              className="capgemini-dropdown"
              style={{ minWidth: '200px', border: '1px solid #00539f', borderRadius: '4px', padding: '10px' }}
            />
          </div>
        </div>
        <Button basic color="blue" onClick={onBtnExport} primary>Export to CSV</Button>
      </div>
      <div 
        className="ag-theme-alpine w-full shadow-lg h-fit p-2 rounded-xl" 
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
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ 
            sortable: false, 
            filter: false, 
            resizable: false, 
            minWidth: 20,
            maxWidth: 105.8,
            cellStyle: { backgroundColor: '#f9f9f9', borderRight: '1px solid #d3d3d3', color: '#00539f', fontSize: '14px', fontWeight: '600' },
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
      </div>
      <div className="flex items-center space-x-8 mt-2 p-2 border-1 border-dashed border-blue-500 bg-blue-50 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          <label className="font-semibold text-blue-700">Comparison Type:</label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="comparisonType"
              value="Seq"
              checked={comparisonType === "Seq"}
              onChange={() => handleComparisonTypeChange("Seq")}
              className="mr-2"
            />
            <span className="text-blue-700">Seq</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="comparisonType"
              value="YoY"
              checked={comparisonType === "YoY"}
              onChange={() => handleComparisonTypeChange("YoY")}
              className="mr-2"
            />
            <span className="text-blue-700">YoY</span>
          </label>
        </div>
        <div className="w-1/4 flex flex-col items-center space-y-1">
          {regions.length > 0 && (
            <div className="w-full flex justify-center space-x-4">
              <Dropdown
                placeholder="Select Region"
                fluid
                selection
                options={regions.map((region) => ({
                  key: region.name,
                  text: region.name,
                  value: region.name,
                }))}
                value={selectedRegion}
                onChange={(e, { value }) => setSelectedRegion(value)}
                upward
                className="capgemini-dropdown"
                style={{ minWidth: '200px', border: '1px solid #00539f', borderRadius: '4px', padding: '10px' }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex overflow-x-auto space-x-6 mt-1">
        {selectedRegion && quarterData && Object.keys(quarterData).map((quarter, index) => (
          <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-0 p-4 rounded-xl shadow-xl mt-2 w-full relative border-2 border-blue-300" style={{ minWidth: '360px', minHeight: '320px' }}>
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                <Loader active inline="centered" />
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-2">{selectedRegion} - {comparisonType} - {quarter}</h3>
                <div className="mb-4">
                  <h4 className="text-lg font-semibold mb-2 text-green-800">Top Contributors</h4>
                  <ul className="list-none list-inside space-y-3">
                    {quarterData[quarter].find(region => region.name === selectedRegion)?.topContributors.map((contributor, index) => (
                      <li key={index} className="pl-6 relative">
                        <span className="absolute left-0 top-0 h-3 w-3 bg-green-800 rounded-full"></span>
                        <span className="ml-6 text-green-800 text-md">{contributor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-red-600">Bottom Contributors</h4>
                  <ul className="list-none list-inside space-y-3">
                    {quarterData[quarter].find(region => region.name === selectedRegion)?.bottomContributors.map((contributor, index) => (
                      <li key={index} className="pl-6 relative">
                        <span className="absolute left-0 top-0 h-3 w-3 bg-red-500 rounded-full"></span>
                        <span className="ml-6 text-red-800 text-md ">{contributor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalRevenueEvolution;
