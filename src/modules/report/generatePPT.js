import React, { useState, useEffect } from "react";
import { X } from 'lucide-react';
import { Loader } from 'lucide-react'; // Importing Loader icon
import axios from 'axios';
import API_BASE_URL from "../../endPoint";

const GeneratePPT = ({ onClose }) => {
  // State for segment activation
  const [activeSegments, setActiveSegments] = useState({
    trEvolution: false,
    contributionMargin: false,
    portfolioEvolution: false
  });

  // State for form data
  const [formData, setFormData] = useState({
    trEvolution: {
      forecastVersion: '',
      restatedVersion: '',
      quarters: ''
    },
    contributionMargin: {
      forecastVersion: '',
      workingForecastVersion: '',
      budgetedVersion: '',
      restatedVersion: '',
      quarters: []
    },
    portfolioEvolution: {
      forecastVersion: '',
      restatedVersion: '',
      region: ''
    }
  });

  // State for dropdown options
  const [options, setOptions] = useState({
    forecastOptions: [],
    workingForecastOptions: [],
    budgetedOptions: [],
    restatedOptions: [],
    regions: ['AMERICAS', 'APAC', 'North Central Europe', 'South Central Europe', 'Global FS', 'CBS'],
    quarters: ['Q1', 'Q2', 'Q3', 'Q4']
  });

  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  // Fetch options from backend API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const fetchOptions = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}/reports/generatePPT/getOptions`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
              }
            });
            const data = response.data;
            setOptions(prev => ({
              ...prev,
              forecastOptions: data.forecastOptions,
              workingForecastOptions: data.workingForecastOptions,
              budgetedOptions: data.budgetedOptions,
              restatedOptions: data.restatedOptions
            }));

            // Set the first value of each option to the respective state variable
            setFormData(prev => ({
              ...prev,
              trEvolution: {
                ...prev.trEvolution,
                forecastVersion: data.forecastOptions[0].value || '',
                restatedVersion: data.restatedOptions[0].value || '',
                quarters: 'Q2'
              },
              contributionMargin: {
                ...prev.contributionMargin,
                forecastVersion: data.forecastOptions[0].value || '',
                workingForecastVersion: data.workingForecastOptions[0].value || '',
                budgetedVersion: data.budgetedOptions[0].value || '',
                restatedVersion: data.restatedOptions[0].value || ''
              },
              portfolioEvolution: {
                ...prev.portfolioEvolution,
                forecastVersion: data.forecastOptions[0].value || '',
                restatedVersion: data.restatedOptions[0].value || '',
                region: "AMERICAS"
              }
            }));
          } catch (error) {
            console.error('Error fetching options:', error);
          }
        };

        fetchOptions();
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  // Handle checkbox changes for segments
  const handleSegmentToggle = (segment) => {
    setActiveSegments(prev => ({
      ...prev,
      [segment]: !prev[segment]
    }));
  };

  // Handle quarter selection with maximum 2 selections
  const handleQuarterChange = (segment, quarter) => {
    setFormData(prev => {
      const currentQuarters = prev[segment].quarters;
      const quarterIndex = currentQuarters.indexOf(quarter);

      if (quarterIndex === -1 && currentQuarters.length < 2) {
        return {
          ...prev,
          [segment]: {
            ...prev[segment],
            quarters: [...currentQuarters, quarter]
          }
        };
      } else if (quarterIndex !== -1) {
        return {
          ...prev,
          [segment]: {
            ...prev[segment],
            quarters: currentQuarters.filter(q => q !== quarter)
          }
        };
      }
      return prev;
    });
  };

  const handleDropdownChange = (segment, field, value) => {
    setFormData(prev => ({
      ...prev,
      [segment]: {
        ...prev[segment],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Set loading state to true
    const result = {};
    if (activeSegments.trEvolution) result.trEvolution = formData.trEvolution;
    if (activeSegments.contributionMargin) result.contributionMargin = formData.contributionMargin;
    if (activeSegments.portfolioEvolution) result.portfolioEvolution = formData.portfolioEvolution;

    try {
      const response = await axios.post(`${API_BASE_URL}/reports/generate_ppt`, result, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        responseType: 'blob' // Important for handling binary data
      });

      // Create a URL for the blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'fit_report_export.pptx'); // or whatever file name you want
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error submitting form data:', error);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 backdrop-blur-sm flex items-center justify-center p-4 " onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border-1 border-black" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Generate PPT</h2>

        {/* TR Evolution Segment */}
        <div className="mb-6 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border-1 border-blue">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={activeSegments.trEvolution}
              onChange={() => handleSegmentToggle('trEvolution')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label className="ml-2 text-lg font-semibold text-gray-700">TR Evolution Slide</label>
          </div>

          {activeSegments.trEvolution && (
            <div className="pl-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forecast Version
                  </label>
                  <select
                    onChange={(e) => handleDropdownChange('trEvolution', 'forecastVersion', e.target.value)}
                    value={formData.trEvolution.forecastVersion}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="">Select version</option>
                    {options.forecastOptions.map(option => (
                      <option key={option.key} value={option.value}>{option.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restated Version
                  </label>
                  <select
                    onChange={(e) => handleDropdownChange('trEvolution', 'restatedVersion', e.target.value)}
                    value={formData.trEvolution.restatedVersion}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="">Select version</option>
                    {options.restatedOptions.map(option => (
                      <option key={option.key} value={option.value}>{option.value}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Quarters
                </label>
                <div className="flex space-x-4">
                  {options.quarters.map(quarter => (
                    <label key={quarter} className="flex items-center">
                      <input
                        type="radio"
                        name="trEvolutionQuarter"
                        checked={formData.trEvolution.quarters===quarter}
                        onChange={() => handleQuarterChange('trEvolution', quarter)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-600">{quarter}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contribution Margin Segment */}
        <div className="mb-6 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border-darkgray">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={activeSegments.contributionMargin}
              onChange={() => handleSegmentToggle('contributionMargin')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label className="ml-2 text-lg font-semibold text-gray-700">Contribution Margin Slide</label>
          </div>

          {activeSegments.contributionMargin && (
            <div className="pl-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forecast Version
                  </label>
                  <select
                    onChange={(e) => handleDropdownChange('contributionMargin', 'forecastVersion', e.target.value)}
                    value={formData.contributionMargin.forecastVersion}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="">Select version</option>
                    {options.forecastOptions.map(option => (
                      <option key={option.key} value={option.value}>{option.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Working Forecast Version
                  </label>
                  <select
                    onChange={(e) => handleDropdownChange('contributionMargin', 'workingForecastVersion', e.target.value)}
                    value={formData.contributionMargin.workingForecastVersion}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="">Select version</option>
                    {options.workingForecastOptions.map(option => (
                      <option key={option.key} value={option.value}>{option.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budgeted Version
                  </label>
                  <select
                    onChange={(e) => handleDropdownChange('contributionMargin', 'budgetedVersion', e.target.value)}
                    value={formData.contributionMargin.budgetedVersion}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="">Select version</option>
                    {options.budgetedOptions.map(option => (
                      <option key={option.key} value={option.value}>{option.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restated Version
                  </label>
                  <select
                    onChange={(e) => handleDropdownChange('contributionMargin', 'restatedVersion', e.target.value)}
                    value={formData.contributionMargin.restatedVersion}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="">Select version</option>
                    {options.restatedOptions.map(option => (
                      <option key={option.key} value={option.value}>{option.value}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Portfolio Evolution Segment */}
        <div className="mb-6 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border-darkgray">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={activeSegments.portfolioEvolution}
              onChange={() => handleSegmentToggle('portfolioEvolution')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label className="ml-2 text-lg font-semibold text-gray-700">Portfolio Evolution Slide</label>
          </div>

          {activeSegments.portfolioEvolution && (
            <div className="pl-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forecast Version
                  </label>
                  <select
                    onChange={(e) => handleDropdownChange('portfolioEvolution', 'forecastVersion', e.target.value)}
                    value={formData.portfolioEvolution.forecastVersion}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="">Select version</option>
                    {options.forecastOptions.map(option => (
                      <option key={option.key} value={option.value}>{option.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restated Version
                  </label>
                  <select
                    onChange={(e) => handleDropdownChange('portfolioEvolution', 'restatedVersion', e.target.value)}
                    value={formData.portfolioEvolution.restatedVersion}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="">Select version</option>
                    {options.restatedOptions.map(option => (
                      <option key={option.key} value={option.value}>{option.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Region
                  </label>
                  <select
                    onChange={(e) => handleDropdownChange('portfolioEvolution', 'region', e.target.value)}
                    value={formData.portfolioEvolution.region}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="">Select region</option>
                    {options.regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!Object.values(activeSegments).some(Boolean) || isLoading}
          className={`w-full p-3 rounded-lg text-white font-medium transition-colors ${Object.values(activeSegments).some(Boolean) && !isLoading
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader className="animate-spin mr-2" size={16} />
              Generating...
            </div>
          ) : (
            'Generate PPT'
          )}
        </button>
      </div>
    </div>
  );
};

export default GeneratePPT;