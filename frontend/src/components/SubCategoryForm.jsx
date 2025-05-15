import React, { useState } from 'react';
import { Dialog, Typography, Button, InputLabel, Select,MenuItem, TextField } from '@mui/material';
import axios from 'axios';

const SubCategoryForm = ({ open, onClose, categories, onSubCategoryAdded }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');

  const handleSubmit = async () => {
    if (!selectedCategoryId || !subCategoryName) {
      alert('Please select a category and enter a subcategory name.');
      return;
    }

    try {
      await axios.put('http://localhost:3001/api/addSubCategory', {
        categoryId: selectedCategoryId,
        subCategoryName,
      });
      onSubCategoryAdded(); // Notify parent to refresh categories
      onClose();
      setSelectedCategoryId('');
      setSubCategoryName('');
    } catch (error) {
      console.error('Failed to add subcategory:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div style={{ padding: '2rem', width: 400 }}>
        <Typography variant="h6" gutterBottom>Add SubCategory</Typography>

        <div style={{ marginBottom: '1rem' }}>
          <InputLabel sx={{ mt: 2 }}>Category</InputLabel>
          <Select
            fullWidth
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.categoryName}
                </MenuItem>
            ))}
          </Select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <InputLabel>SubCategory Name</InputLabel>
          <TextField
            fullWidth
            label="Subcategory"
            margin="normal"
            type="text"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            placeholder="Enter subcategory name"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default SubCategoryForm;
