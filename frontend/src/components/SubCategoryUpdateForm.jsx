import React, { useEffect, useState } from 'react';
import {
  Dialog, Typography, Button, InputLabel, Select, MenuItem, TextField
} from '@mui/material';
import axios from 'axios';

const SubCategoryUpdateForm = ({ open, onClose, categories, onUpdated }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [oldSubCategory, setOldSubCategory] = useState('');
  const [newSubCategoryName, setNewSubCategoryName] = useState('');

  useEffect(() => {
    if (!selectedCategoryId) {
      setAvailableSubCategories([]);
      setOldSubCategory('');
      return;
    }
    const selectedCat = categories.find(cat => cat._id === selectedCategoryId);
    setAvailableSubCategories(selectedCat?.subCategories || []);
    setOldSubCategory('');
  }, [selectedCategoryId, categories]);

  const handleSubmit = async () => {
    if (!selectedCategoryId || !oldSubCategory || !newSubCategoryName.trim()) {
      alert('Please fill all fields');
      return;
    }

    try {
      await axios.patch('http://localhost:3001/api/updateSubCategory', {
        categoryId: selectedCategoryId,
        oldSubCategoryName: oldSubCategory,
        newSubCategoryName: newSubCategoryName.trim(),
      });
      alert('Subcategory updated successfully!');
      onUpdated();
      onClose();
      setSelectedCategoryId('');
      setOldSubCategory('');
      setNewSubCategoryName('');
    } catch (err) {
      console.error('Failed to update subcategory:', err);
      alert('Failed to update subcategory');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div style={{ padding: '2rem', width: 400 }}>
        <Typography variant="h6" gutterBottom>Update SubCategory</Typography>

        <InputLabel>Category</InputLabel>
        <Select
          fullWidth
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="">Select Category</MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat._id} value={cat._id}>{cat.categoryName}</MenuItem>
          ))}
        </Select>

        <InputLabel>Current SubCategory</InputLabel>
        <Select
          fullWidth
          value={oldSubCategory}
          onChange={(e) => setOldSubCategory(e.target.value)}
          disabled={!availableSubCategories.length}
          sx={{ mb: 2 }}
        >
          <MenuItem value="">Select SubCategory</MenuItem>
          {availableSubCategories.map((sub, idx) => (
            <MenuItem key={idx} value={sub}>{sub}</MenuItem>
          ))}
        </Select>

        <TextField
          fullWidth
          label="New SubCategory Name"
          value={newSubCategoryName}
          onChange={(e) => setNewSubCategoryName(e.target.value)}
          placeholder="Enter new subcategory name"
          sx={{ mb: 2 }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Update</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default SubCategoryUpdateForm;
