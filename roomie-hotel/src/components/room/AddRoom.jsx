import React, { useState } from 'react';
import { addRoom } from '../utils/ApiFunctions';
import RoomTypeSelector from '../common/RoomTypeSelector';

const AddRoom = () => {
  const [newRoom, setNewRoom] = useState({
    photo: null,
    roomType: "",
    roomPrice: ""
  });

  const [imagePreview, setImagePreview] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoomInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setNewRoom({ ...newRoom, photo: selectedImage });
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await addRoom(newRoom.photo, newRoom.roomType, newRoom.roomPrice);
      if (success) {
        setSuccessMessage("A new room was added to the database");
        setNewRoom({ photo: null, roomType: "", roomPrice: "" });
        setImagePreview("");
        setErrorMessage("");
      } else {
        setErrorMessage("Error adding room");
      }
    } catch (error) {
      console.error("Error while adding room:", error);
      setErrorMessage(error.message || "Failed to add room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="mt-5 mb-2">Add a new room</h2>

          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="roomType" className="form-label">Room Type</label>
              <RoomTypeSelector handleRoomInputChange={handleRoomInputChange} newRoom={newRoom} />
            </div>

            <div className="mb-3">
              <label htmlFor="roomPrice" className="form-label">Room Price</label>
              <input 
                className="form-control" 
                required 
                id="roomPrice"
                type="number"
                min="0"
                name="roomPrice"
                value={newRoom.roomPrice}
                onChange={handleRoomInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="photo" className="form-label">Room Photo</label>
              <input 
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Room Preview" 
                  style={{ maxWidth: "400px", maxHeight: "400px" }} 
                  className="mt-3" 
                />
              )}
            </div>

            <div className="d-grid gap-2">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Room'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddRoom;
