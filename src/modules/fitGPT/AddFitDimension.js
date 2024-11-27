import React from 'react';
import { Modal, Button, Dropdown } from 'semantic-ui-react';

const AddFitDimension = ({
  open,
  onClose,
  availableKeys,
  values,
  selectedKey,
  setSelectedKey,
  selectedValues,
  setSelectedValues,
  cards,
  setCards,
  editCardIndex,
  setShowAddCardModal
}) => {
  const renderSelectedValues = (values) => {
    const colors = ['#005A9C', '#0072C6', '#0094FF', '#00BFFF', '#00DFFF', '#00FFFF'];

    return (
      <div className="flex flex-wrap mt-4 overflow-y-auto" style={{ maxHeight: '100px' }}>
        {values.map((value, idx) => (
          <span
            key={idx}
            className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2"
            style={{ backgroundColor: colors[idx % colors.length] }}
          >
            {value}
          </span>
        ))}
      </div>
    );
  };

  const handleKeyChange = (e, { value }) => {
    setSelectedKey(value);
    setSelectedValues([]); // Reset selected values when key changes
  };

  const handleValuesChange = (e, { value }) => {
    if (value.includes('ALL_VALUES')) {
      setSelectedValues(values[selectedKey]);
    } else {
      setSelectedValues(value);
    }
  };

  const keyOptions = availableKeys.map(key => ({ value: key, text: key }));
  const valueOptions = selectedKey ? [{ value: 'ALL_VALUES', text: 'Select All' }, ...values[selectedKey]?.map(value => ({ value, text: value }))] || [] : [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-2 bg-gray-100 shadow-lg h-fit"
      style={{ maxWidth: '30%', minHeight: '300px' }}
    >
      <Modal.Header style={{ backgroundColor: '#005A9C', color: 'white', borderRadius: '8px 8px 0 0', padding: '10px 10px' }}>
        Add Dimension
      </Modal.Header>
      <Modal.Content style={{ padding: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'nowrap' }}>
          <Dropdown
            placeholder='Select Key'
            fluid
            selection
            options={keyOptions}
            onChange={handleKeyChange}
            clearable
            scrolling
            style={{ width: '200px' }}
            value={selectedKey}
          />
          {selectedKey && (
            <Dropdown
              placeholder='Select Values'
              fluid
              multiple
              search
              selection
              scrolling
              clearable
              options={valueOptions}
              onChange={handleValuesChange}
              value={selectedValues}
              style={{ width: '320px'}}
            />
          )}

        </div>
        <div>
          <strong>Selected Values:</strong> {renderSelectedValues(selectedValues)}
        </div>
      </Modal.Content>
      <Modal.Actions style={{ padding: '10px 20px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button primary onClick={() => {
          const newCards = [...cards];
          if (editCardIndex !== null) {
            newCards[editCardIndex] = { key: selectedKey, values: selectedValues };
          } else {
            newCards.push({ key: selectedKey, values: selectedValues });
          }
          setCards(newCards);
          setShowAddCardModal(false);
          setSelectedValues([]);
        }} style={{ backgroundColor: '#005A9C', color: 'white', marginRight: '10px' }}>Save</Button>
        <Button secondary onClick={onClose} style={{ backgroundColor: '#f0f4f8', color: '#005A9C' }}>Cancel</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AddFitDimension;
