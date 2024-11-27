import React, { useState, useEffect } from 'react';
import useFormStore from '../../../store';

export default function CrudList() {
  const formList = useFormStore((state) => state.formList);
  const deleteList = useFormStore((state) => state.deleteList);

  const [visibleItems, setVisibleItems] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState([]);

  const loadMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 10);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log(filteredList,"hello")
  };

  useEffect(() => {
    setFilteredList(
      formList.filter(item =>
        item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mobile.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [formList, searchTerm]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 bg-white p-4">
          <input
            type="text"
            placeholder="Search"
            className="form-control form-control-lg mb-4"
            value={searchTerm}
            onChange={handleSearchChange}
            autoComplete="off"
            required
          />
       {filteredList.length>0 ?
          <table>
          <thead>
            <tr>
              <td>S No.</td>
              <td>First Name</td>
              <td>Last Name</td>
              <td>Email</td>
              <td>Mobile</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {filteredList.slice(0, visibleItems).map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td style={{ display: 'flex', width: '100%' }}>
                  <button type="button" className="btn btn-secondary btn-md">
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-md"
                    onClick={() => deleteList(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        :
        <p>No data is present</p>}

          {visibleItems < filteredList.length && (
            <button
              type="button"
              className="btn mt-4 btn-secondary btn-md"
              onClick={loadMore}
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
