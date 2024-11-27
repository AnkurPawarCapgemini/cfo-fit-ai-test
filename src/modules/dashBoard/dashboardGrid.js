import React, { useEffect, useMemo, useState } from "react";
import useDashboardStore from "../../store/useDashboardStore";
import TagSearchBar from "./tagSearchBar";
import Plot from "react-plotly.js";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Icon } from 'semantic-ui-react';

const colorPalette = [
  'bg-red-100 text-red-800',
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-gray-100 text-gray-800',
];

const capgeminiColors = {
  blue: '#0070ad',
  lightBlue: '#00a1e0',
  darkBlue: '#005b96',
  gray: '#f2f2f2',
  white: '#ffffff'
};

const DashboardGrid = () => {
  const { dashboardData, fetchDashboardData } = useDashboardStore();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [tagObjects, setTagObjects] = useState([]);
  const [loadingKpi, setLoadingKpi] = useState(true);

  useEffect(() => {
    // Extract tags, flatten them, and filter for unique values
    const allTags = dashboardData.map(item => item.tags).flat().filter((tag, index, self) => tag && self.indexOf(tag) === index);

    // Map tags to desired object structure
    const tagObjectList = allTags.map(tag => ({ key: tag, value: tag, text: tag}));

    setTagObjects(tagObjectList);
  }, [dashboardData]);

  useEffect(() => {
    fetchDashboardData().finally(() => setLoadingKpi(false));
  }, [fetchDashboardData]);

  const tagColors = useMemo(() => {
    const colors = {};
    let colorIndex = 0;
    dashboardData.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => {
          if (!colors[tag]) {
            colors[tag] = colorPalette[colorIndex % colorPalette.length];
            colorIndex++;
          }
        });
      }
    });
    return colors;
  }, [dashboardData]);

  const handleSelectionChange = (value) => {
    setSelectedOptions(value);
  };

  const filteredDashboardData = useMemo(() => {
    if (selectedOptions.length === 0) return dashboardData;
    return dashboardData.filter(dashData => 
      dashData.tags && selectedOptions.every(tag => dashData.tags.includes(tag))
    );
  }, [dashboardData, selectedOptions]);

  const renderTags = (tags) => {
    const maxDisplayTags = 7;
    const displayTags = tags.slice(0, maxDisplayTags);
    const remainingTags = tags.length - maxDisplayTags;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {displayTags.map((tag, index) => (
          <span key={index} className={`${tagColors[tag]} text-xs font-medium px-2 py-0.5 rounded`}>
            {tag}
          </span>
        ))}
        {remainingTags > 0 && (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
            +{remainingTags}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="h-full relative p-4 flex flex-col">
      <div className="search-bar rounded-lg shadow-md transition duration-100 ease-in-out active:shadow-lg active:scale-[1.005] flex flex-col z-50 mb-4">
        <TagSearchBar
          dashboarddata={tagObjects}
          onSelectionChange={handleSelectionChange}
          selectedOptions={selectedOptions}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {filteredDashboardData.map((dashData, index) => (
          <div key={index} className="bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-lg transition duration-200 ease-in-out hover:shadow-xl hover:scale-[1.01] flex flex-col" style={{ height: 'calc(42vh - 1rem)', border: `1px solid ${capgeminiColors.blue}` }}>
            <div className="p-4 flex-grow flex flex-col">
              <h2 className="text-lg font-bold mb-2" style={{ color: capgeminiColors.darkBlue }}>
                {dashData.table_heading}
              </h2>
              <div className="flex-grow">
                {loadingKpi ? (
                  <div className="flex justify-center items-center h-full">
                    <Icon loading name="spinner" size="large" />
                  </div>
                ) : dashData.type === 'chart' ? (
                  <Plot
                    data={JSON.parse(dashData.content).data}
                    layout={{...JSON.parse(dashData.content).layout, autosize: true, margin: {l: 40, r: 40, t: 40, b: 40}}}
                    useResizeHandler={true}
                    style={{width: "100%", height: "100%"}}
                  />
                ) : dashData.type === 'table' ? (
                  <div
                    className="ag-theme-alpine h-fit w-full"
                    style={{ 
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
                      rowData={dashData.content.data}
                      columnDefs={dashData.content.props.map(col => col.field === 'Entity' ? { ...col, width: 280 } : col)}
                      defaultColDef={{
                        sortable: false,
                        resizable: false
                      }}
                      onGridReady={(params) => {
                        params.api.sizeColumnsToFit();
                      }}
                      pagination={false}
                      paginationPageSize={5}
                      domLayout="autoHeight"
                    />
                  </div>
                ) : null}
              </div>
              {dashData.tags && renderTags(dashData.tags)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardGrid;