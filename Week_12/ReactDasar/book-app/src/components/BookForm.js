import React, { useState, useEffect} from "react";

function BookForm({ onSubmit, bookToEdit, onCancel }) {
    const [formData, setFormData] = useState({
        name: "",
        author: "",
        rating: "average",
    });



    useEffect(() => {
        if (bookToEdit) {
            setFormData({
                name: bookToEdit.name || "",
                author: bookToEdit.author || "",
                rating: bookToEdit.rating || "average",
            });
        }
    }, [bookToEdit]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            name: "",
            author: "",
            rating: "average",
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl mb-4">{bookToEdit ? "Edit Book" : "Add New Book"}
            {bookToEdit ? "Edit Buku" : "Tambah Buku Baru"}
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Judul Buku:
                    </label>
                    <input type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                    placeholder="Masukkan judul buku"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Penulis:
                    </label>
                    <input type="text" 
                    name="author" 
                    value={formData.author} 
                    onChange={handleChange} 
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                    placeholder="Masukkan nama author"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Rating:
                    </label>
                    <select
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="excellent">Excellent</option>
                        <option value="average">Average</option>
                        <option value="bad">Bad</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        {bookToEdit ? "Update Book" : "Add Book"}
                    </button>
                    {bookToEdit && (
                        <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200">
                            Cancel
                        </button>
                    )}
                </div>
                
                </form>
        </div>
    );}

export default BookForm;