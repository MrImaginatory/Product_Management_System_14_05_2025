// src/components/CategoryForm.jsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import api from '../services/api';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CategoryForm = ({ open, onClose }) => {
  const [categoryName, setCategoryName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');

  const generateSlug = (name) => {
    const cleaned = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setSlug(cleaned);
  };

  const handleCategoryChange = (e) => {
    const name = e.target.value;
    setCategoryName(name);
    generateSlug(name);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!categoryName || !image) return alert("Please fill all required fields.");

    const formData = new FormData();
    formData.append('categoryName', categoryName);
    formData.append('subCategory', 'default'); // Or update if subcategory logic changes
    formData.append('description', description);
    formData.append('categoryImage', image); // Should match `upload.array('categoryImage', ...)`
    
    try {
      const res = await api.post('/addCategory', formData);
      alert('Category created!');
      onClose(); // Close dialog
    } catch (err) {
      console.error(err);
      alert('Failed to create category.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Category</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          label="Category Name"
          value={categoryName}
          onChange={handleCategoryChange}
          margin="normal"
        />
        <div style={{ marginBottom: '1rem', color: '#555' }}>
          <strong>Slug:</strong> {slug}
        </div>
        <Button variant="outlined" component="label" sx={{ mb: 1 }}>
        <input type="file"  accept="image/*" onChange={handleImageChange} />
        </Button>
        <div style={{ marginTop: '1rem' }}>
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDescription(data);
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryForm;
