// src/components/ProductForm.jsx
import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, InputLabel, Select,
  RadioGroup, FormControlLabel, Radio,
  FormGroup, Checkbox,
  Input
} from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import api from '../services/api';
import { blue } from '@mui/material/colors';

const ProductForm = ({ open, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [displayImage, setDisplayImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [thumbnailPreviews, setThumbnailPreviews] = useState([]);
  const [availability, setAvailability] = useState('ReadyToShip');
  const [productType, setProductType] = useState([]);
  const [form, setForm] = useState({
    productName: '',
    stock: '',
    weight: '',
    mrp: '',
    salePrice: ''
  });
  const [description, setDescription] = useState('');

  // Fetch categories including subCategories
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setSubCategories([]);
      setSelectedSubCategories([]);
      return;
    }
    const categoryObj = categories.find(cat => cat._id === selectedCategory);
    if (categoryObj) {
      setSubCategories(categoryObj.subCategories || []);
      setSelectedSubCategories([]); // reset selection
    }
  }, [selectedCategory, categories]);

  const handleThumbnailPreview = (files) => {
    const previews = Array.from(files).map(file => URL.createObjectURL(file));
    setThumbnailPreviews(previews);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('productName', form.productName);
      formData.append('category', selectedCategory);
      formData.append('subCategories', selectedSubCategories.join(','));
      formData.append('displayImage', displayImage);
      Array.from(otherImages).forEach(img => formData.append('otherImages', img));
      formData.append('availability', availability);
      formData.append('productType', productType.join(','));
      formData.append('stock', form.stock);
      formData.append('weight', form.weight);
      formData.append('mrp', form.mrp);
      formData.append('salePrice', form.salePrice);
      formData.append('productDescription', description);
      await api.post('/addProduct', formData);
      alert('Product created successfully!');
      window.location.reload();
      onClose();
    } catch (error) {
      console.error(error);
      console.log(typeof(productType))
      alert('Error creating product');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent dividers>

        <TextField
          fullWidth
          label="Product Name"
          margin="normal"
          value={form.productName}
          onChange={e => setForm({ ...form, productName: e.target.value })}
        />

        <InputLabel sx={{ mt: 2 }}>Category</InputLabel>
        <Select
          fullWidth
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>Select Category</MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.categoryName.charAt(0).toUpperCase() + cat.categoryName.slice(1)}
            </MenuItem>
          ))}
        </Select>

        <InputLabel sx={{ mt: 2 }}>SubCategories</InputLabel>
        <Select
          multiple
          fullWidth
          value={selectedSubCategories}
          onChange={e => setSelectedSubCategories(e.target.value)}
          renderValue={selected => selected.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
          displayEmpty
          disabled={subCategories.length === 0}
        >
          {subCategories.length === 0 && (
            <MenuItem disabled>No subcategories available</MenuItem>
          )}
          {subCategories.map((subCat, idx) => (
            <MenuItem key={idx} value={subCat}>
              {subCat.charAt(0).toUpperCase() + subCat.slice(1)}
            </MenuItem>
          ))}
        </Select>

        <InputLabel sx={{ mt: 2 }}>Display Image</InputLabel>
        <input
          color='primary'
          type="file"
          accept="image/*"
          onChange={e => setDisplayImage(e.target.files[0])}
        />

        <InputLabel sx={{ mt: 2 }}>Other Images</InputLabel>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => {
            setOtherImages(e.target.files);
            handleThumbnailPreview(e.target.files);
          }}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          {thumbnailPreviews.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="thumb"
              style={{ width: 60, height: 60, objectFit: 'cover' }}
            />
          ))}
        </div>

        <RadioGroup
          row
          value={availability}
          onChange={e => setAvailability(e.target.value)}
          sx={{ mt: 2 }}
        >
          <FormControlLabel value="OnBooking" control={<Radio />} label="On Booking" />
          <FormControlLabel value="ReadyToShip" control={<Radio />} label="Ready to Ship" />
        </RadioGroup>

        <FormGroup row sx={{ mt: 1 }}>
          {['Hot_Product', 'BestSeller', 'Todays_Deal'].map(type => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={productType.includes(type)}
                  onChange={e => {
                    if (e.target.checked)
                      setProductType([...productType, type]);
                    else
                      setProductType(productType.filter(p => p !== type));
                  }}
                />
              }
              label={type.replace('_', ' ')}
            />
          ))}
        </FormGroup>

        <TextField
          fullWidth
          type="number"
          label="Stock"
          margin="normal"
          value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })}
        />
        <TextField
          fullWidth
          type="number"
          label="Weight"
          margin="normal"
          value={form.weight}
          onChange={e => setForm({ ...form, weight: e.target.value })}
        />
        <TextField
          fullWidth
          type="number"
          label="MRP"
          margin="normal"
          value={form.mrp}
          onChange={e => setForm({ ...form, mrp: e.target.value })}
        />
        <TextField
          fullWidth
          type="number"
          label="Sale Price"
          margin="normal"
          value={form.salePrice}
          onChange={e => setForm({ ...form, salePrice: e.target.value })}
        />

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
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;
