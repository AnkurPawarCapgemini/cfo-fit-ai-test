import React from 'react';

const Modal = () => {
  return (
    <>
      {/* Button to trigger the modal */}
      <button
        type="button"
        className="btn btn-primary rounded-pill"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Open modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-sm">
          <div className="modal-content text-center">
            <div className="modal-body text-center">
              <div className="d-flex justify-content-end mb-2">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-secondary rounded-pill btn-sm"
                data-bs-dismiss="modal"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
