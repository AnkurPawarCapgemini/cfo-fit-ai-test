import React, { useState, useEffect } from 'react';
import { Modal, Button, Icon } from 'semantic-ui-react';
import AddFitDimension from './AddFitDimension';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import API_BASE_URL from '../../endPoint';

const FitDataScope = ({ open, onClose, keys, values, cards, setCards }) => {

  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [editCardIndex, setEditCardIndex] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);

  useEffect(() => {
    if (editCardIndex !== null) {
      setSelectedKey(cards[editCardIndex].key);
      setSelectedValues(cards[editCardIndex].values);
    }
  }, [editCardIndex, cards]);

  const handleAddCard = () => {
    if (availableKeys.length > 0) {
      setSelectedKey(null);
      setSelectedValues([]);
      setEditCardIndex(null);
      setShowAddCardModal(true);
    }
  };

  const handleEditCard = (index) => {
    setEditCardIndex(index);
    setShowAddCardModal(true);
  };

  const handleDeleteCard = (index) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handlePreviewData = async () => {
    setShowPreview(!showPreview);
    if (!showPreview) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post(`${API_BASE_URL}/fitgpt/previewData`, { cards }, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        const data = response.data;
        setRowData(data.rowData);
        setColumnDefs(data.columnDef);
      } catch (error) {
        console.error('Error fetching preview data:', error);
      }
    }
  };

  const availableKeys = keys.filter(key => !cards.some(card => card.key === key) || key === selectedKey);

  const renderSelectedValues = (values) => {
    const colors = [
      'rgba(173, 216, 230, 0.5)',
      'rgba(135, 206, 235, 0.5)',
      'rgba(0, 191, 255, 0.5)',
      'rgba(30, 144, 255, 0.5)',
      'rgba(70, 130, 180, 0.5)',
      'rgba(25, 25, 112, 0.5)'
    ];

    const calculateMaxVisibleValues = () => {
      const cardWidth = document.querySelector('.card')?.offsetWidth || 200; // Default to 200 if card width is not available
      const valueWidth = 100; // Approximate width of each value element
      return Math.floor(cardWidth / valueWidth);
    };

    const maxVisibleValues = calculateMaxVisibleValues();

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {values.slice(0, maxVisibleValues).map((value, idx) => (
          <span 
            key={idx} 
            className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2" 
            style={{ backgroundColor: colors[idx % colors.length] }}
          >
            {value}
          </span>
        ))}
        {values.length > maxVisibleValues && (
          <span 
            className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2" 
            style={{ backgroundColor: 'rgba(128, 128, 128, 0.5)' }}
          >
            +{values.length - maxVisibleValues}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="fixed flex justify-center items-center">
      <Modal 
        open={open} 
        onClose={onClose} 
        className="h-fit w-9/12 top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%]"
        style={{ width: '80%' }}
      >
        <Modal.Header>Set FIT Data Scope</Modal.Header>
        <Modal.Content>
          <div className="flex overflow-x-auto space-x-4 p-5 border-gray border-2 rounded-lg">
            <div 
              className={`flex justify-center items-center bg-gray-100 shadow-md rounded-lg p-6 cursor-pointer flex-shrink-0 ${availableKeys.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} 
              style={{ minWidth: '200px' }}
              onClick={availableKeys.length > 0 ? handleAddCard : null}
            >
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
            {cards.map((card, index) => (
              <div 
                key={index} 
                className="bg-blue-50 shadow-md rounded-lg p-6 relative cursor-pointer flex-shrink-0" 
                style={{ minWidth: '200px' }}
                onClick={() => handleEditCard(index)}
              >
                <h2 className="text-xl font-semibold mb-2">{card.key}</h2>
                <div>
                  {renderSelectedValues(card.values)}
                </div>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button className="text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteCard(index); }}>
                    <Icon name='trash' />
                  </button>
                </div>
              </div>
            ))}
            
          </div>
          {showPreview && (
            <div 
              className="preview-content mt-4 border p-4 border-gray-300 overflow-y-auto ag-theme-alpine" 
              style={{ maxHeight: 'auto', width: '100%' }}
            >
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                domLayout='autoHeight'
                pagination={true}
                paginationPageSize={10}
              />
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handlePreviewData}>
            {showPreview ? 'Hide Preview' : 'Preview Data'}
          </Button>
          <Button onClick={onClose}>Close</Button>
        </Modal.Actions>
      </Modal>

      <AddFitDimension
        open={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        availableKeys={availableKeys}
        values={values}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        cards={cards}
        setCards={setCards}
        editCardIndex={editCardIndex}
        setShowAddCardModal={setShowAddCardModal}
      />
    </div>
  );
};


export default FitDataScope;