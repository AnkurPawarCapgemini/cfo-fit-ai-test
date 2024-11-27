import React, { useState, useEffect, useRef } from "react";
import { Dropdown, Button, Loader, Radio } from 'semantic-ui-react';
import axios from 'axios';
import API_BASE_URL from '../../../../endPoint';

import { AgGridReact } from "ag-grid-react";

import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { CsvExportModule } from "@ag-grid-community/csv-export";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

const PortfolioEvolution = () => {
  const gridRef = useRef();

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [forecastVersion, setForecastVersion] = useState('');
  const [realVersion, setRealVersion] = useState('');
  const [region, setRegion] = useState('');
  const [view, setView] = useState('unnamed_total');

  const [forecastOptions, setForecastOptions] = useState([]);
  const [restatedOptions, setRestatedOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);

  const [revenueRows, setRevenueRows] = useState([]);
  const [revenueColumnDefs, setRevenueColumnDefs] = useState([]);
  const [cmMrRows, setCmMrRows] = useState([]);
  const [cmMrColumnDefs, setCmMrColumnDefs] = useState([]);
  const [unnamedRows, setUnnamedRows] = useState([]);
  const [unnamedColumnDefs, setUnnamedColumnDefs] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchOptions = async (url, setOptions, setVersion) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(url, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      setOptions(response.data);
      if (response.data.length > 0) {
        setVersion(response.data[0].value);
      }
    } catch (error) {
      console.error(`Error fetching options from ${url}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions(`${API_BASE_URL}/reports/portfolio_evolution/get_forecast_options`, setForecastOptions, setForecastVersion);
    fetchOptions(`${API_BASE_URL}/reports/portfolio_evolution/get_restated_options`, setRestatedOptions, setRealVersion);
    fetchOptions(`${API_BASE_URL}/reports/portfolio_evolution/get_region_options`, setRegionOptions, setRegion);
  }, []);

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

  const fetchPortfolioTable = async (forecastVersion, realVersion, region) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/reports/portfolio_evolution/get_portfolio_table`, {
        params: { forecastVersion, realVersion, region },
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const { revenueRows, revenueColumnDefs, cmMrRows, cmMrColumnDefs, unnamedRows, unnamedColumnDefs } = response.data;
      setRevenueRows(revenueRows);
      setRevenueColumnDefs(applyColumnStyle(revenueColumnDefs));
      setCmMrRows(cmMrRows);
      setCmMrColumnDefs(applyColumnStyle(cmMrColumnDefs));
      setUnnamedRows(unnamedRows);
      setUnnamedColumnDefs(applyColumnStyle(unnamedColumnDefs));
      setView('revenue');
    } catch (error) {
      console.error("Error fetching portfolio table:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (forecastVersion && realVersion && region) {
      fetchPortfolioTable(forecastVersion, realVersion, region);
    }
  }, [forecastVersion, realVersion, region]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.autoSizeAllColumns();
  };

  const exportToCsv = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv();
    }
  };

  const getRowStyle = params => {
    return { background: params.node.rowIndex % 2 === 0 ? '#F0FAFF' : '#E0F5FF', fontSize: '14px', fontWeight: '600' };
  };

  const renderGrid = (rowData, columnDefs, width) => (
    <div
      className="ag-theme-quartz w-[100%] shadow-lg h-fit flex rounded-xl flex-col"
      style={{ 
        height: '450px', 
        border: '1px solid #00539f', 
        backgroundColor: '#f0f8ff',
        '--ag-header-background-color': '#0070ad', 
        '--ag-cell-horizontal-border': 'solid',
        '--ag-cell-vertical-border': 'solid',
        '--ag-header-cell-text-color': 'white',
        '--ag-header-foreground-color': 'white',
        '--ag-border-color': '#d3d3d3', // Ensures column separators are clearly visible
        '--ag-border-width': '1px', // Sets the width of the column separators
        '--ag-header-cell-font-weight': 'bold', // Makes the header font bold
        '--ag-header-cell-border-right': '1px solid #d3d3d3', // Adds a right border to header cells
        '--ag-header-cell-border-bottom': '1px solid #d3d3d3', // Adds a bottom border to header cells
        '--ag-cell-text-align': 'center', // Aligns column text in center
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
        <Button basic color='blue' onClick={exportToCsv} style={{ color: 'white', marginRight: '20px', padding: '10px', margin: '10px' }}>Export to CSV</Button>
      </div>
      <div style={{
        height: 'auto', width: 'auto',
        border: '1px solid #d3d3d3',
        margin: 'auto auto',
        marginBottom: '100px'
      }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ 
            sortable: false, 
            filter: false, 
            resizable: false, 
            minWidth: 20,
            cellStyle: { backgroundColor: '#f9f9f9', borderRight: '1px solid #d3d3d3', color: '#00539f', fontSize: '14px', fontWeight: '600' },
          }}
          onGridReady={onGridReady}
          suppressExcelExport={true}
          autoSizeStrategy='SizeColumnsToContentStrategy'
          domLayout="print"
          getRowStyle={getRowStyle}
          className="w-[100%] h-[95%]"
        />
      </div>
    </div>
  );

  return (
    <div style={{ padding: '14px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Dropdown
            placeholder='Select Forecast Version'
            selection
            options={forecastOptions}
            onChange={(e, { value }) => setForecastVersion(value)}
            value={forecastVersion}
            style={{ borderColor: '#2185d0', borderRadius: '5px' }}
          />
          <Dropdown
            placeholder='Select Actual Version'
            selection
            options={restatedOptions}
            onChange={(e, { value }) => setRealVersion(value)}
            value={realVersion}
            style={{ borderColor: '#2185d0', borderRadius: '5px' }}
          />
          <Dropdown
            placeholder='Select Region'
            selection
            options={regionOptions}
            onChange={(e, { value }) => setRegion(value)}
            value={region}
            style={{ borderColor: '#2185d0', borderRadius: '5px' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <label style={{ marginRight: '10px', fontWeight: '600', color: '#2185d0' }}>View:</label>
        <Radio
          label='Revenue'
          name='viewRadioGroup'
          value='revenue'
          checked={view === 'revenue'}
          onChange={(e, { value }) => setView(value)}
          style={{ color: '#2185d0' }}
        />
        <Radio
          label='CM / MR'
          name='viewRadioGroup'
          value='cm_mr'
          checked={view === 'cm_mr'}
          onChange={(e, { value }) => setView(value)}
          style={{ color: '#2185d0' }}
        />
        <Radio
          label='Unnamed Total'
          name='viewRadioGroup'
          value='unnamed_total'
          checked={view === 'unnamed_total'}
          onChange={(e, { value }) => setView(value)}
          style={{ color: '#2185d0' }}
        />
      </div>
      <hr style={{ backgroundColor: '#2185d0', marginTop: '14px', marginBottom: '14px' }} />
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '450px' }}>
          <Loader active inline='centered' />
        </div>
      ) : (
        <>
          {view === 'revenue' && renderGrid(revenueRows, revenueColumnDefs, '85%')}
          {view === 'cm_mr' && renderGrid(cmMrRows, cmMrColumnDefs, '94%')}
          {view === 'unnamed_total' && renderGrid(unnamedRows, unnamedColumnDefs, '60%')}
        </>
      )}
    </div>
  );
};

export default PortfolioEvolution;
