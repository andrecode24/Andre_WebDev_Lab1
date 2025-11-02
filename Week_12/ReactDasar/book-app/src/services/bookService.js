import axios from 'axios';

const API_URL = 'http://localhost:8000/basic/';

// Fungsi utk mengambil buku

export const getAllBooks = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

// Fungsi utk menambahkan buku baru

export const createBook = async (bookData) => {
    try {
        const response = await axios.post(API_URL, bookData);
        return response.data;
    } catch (error) {
        console.error('Error adding book:', error);
        throw error;
    }
};

// Fungsi utk delete data buku

export const deleteBook = async (bookId, updatedData) => {
    try {
        await axios.delete(`${API_URL}${bookId}/`);
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
};

// Fungsi utk update data buku

export const updateBook = async (bookId, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}${bookId}/`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }  
};