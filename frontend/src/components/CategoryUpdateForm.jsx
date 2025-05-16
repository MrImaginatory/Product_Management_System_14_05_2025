import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography
} from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import api from '../services/api';

const CategoryUpdateForm = ({ open, onClose, category, onUpdated }) => {
  const [categoryName, setCategoryName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (category) {
      setCategoryName(category.categoryName || '');
      setSlug(category.slug || '');
      setDescription(category.description || '');
      setImage(null); // reset file input; keep current image shown separately
    }
  }, [category]);

  // Generate slug from name
  const generateSlug = (name) => {
    const cleaned = name.trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    setSlug(cleaned);
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategoryName(val);
    generateSlug(val);
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!categoryName) {
      alert('Category Name is required');
      return;
    }

    const formData = new FormData();
    formData.append('categoryName', categoryName);
    formData.append('description', description);
    if (image) {
      formData.append('categoryImage', image);
    }

    try {
      await api.patch(`/updateCategory/${category._id}`, formData);
      alert('Category updated successfully!');
      onUpdated(); // notify parent to refresh
      onClose();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    }
  };

  if (!category) return null; // don't render if no category to edit

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Category</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          label="Category Name"
          value={categoryName}
          onChange={handleCategoryChange}
          margin="normal"
        />

        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          <strong>Slug:</strong> {slug}
        </Typography>

        <Button variant="outlined" component="label" sx={{ mb: 1 }}>
          Upload New Image
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </Button>

        { !image && category.image && (
          <div style={{ marginBottom: '1rem' }}>
            <Typography variant="body2" color="textSecondary">Current Image:</Typography>
            <img
              src={`http://localhost:3001${category.image}`}
              alt={categoryName}
              style={{ maxWidth: 150, maxHeight: 150, objectFit: 'cover' }}
            />
          </div>
        )}

        <div>
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => setDescription(editor.getData())}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSubmit} variant="contained">Update</Button>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryUpdateForm;
