import React from 'react';
import { SavedTemplateWrapper } from '../modules/fitGPT/style';
import Table from '../components/chatResponse/table/table';
import useSavedTemplateTable from '../store/useSavedTemplateTable'; // Adjust the path as necessary
import AddTraining from './addTraining';

export default function SavedTemplate() {
  const { data, deleteItem } = useSavedTemplateTable();  
  const updatedData = data.map(item => ({
    ...item,
    action: <button onClick={() => deleteItem(item.id)}>Delete</button>  
  }));

  const columns = ['Action', 'Question', 'Content', 'Training_Data_Type'];

  return (
    <SavedTemplateWrapper>
      <div className=' d-flex align-items-center head-text-btn'>
        <div className='headSection-left'>
          <h4>Training Data</h4>
          <p>Add or Remove training data. Good training data is the key to accuracy</p>
        </div>
        <div className='headSection-right'>
          <AddTraining/>
        </div>
      </div>
      <div className='table-savedItem'>      
      <Table savedDataColumns={columns}   /> 
      </div>
    </SavedTemplateWrapper>
  );
}
