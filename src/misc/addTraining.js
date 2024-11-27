import React from 'react'
import Modal from '../components/modal/modal';

export default function AddTraining() {
    const handleSave = (data) => {
        console.log('Training data saved:', data);
      };
    
      const handleCancel = () => {
        console.log('Action canceled');
      };
    
      return (
        <div>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addTrainingModal"
          >
            Add Training
          </button>
    
          <Modal
            id="addTrainingModal"
            title="Add Training Data"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      );
}
