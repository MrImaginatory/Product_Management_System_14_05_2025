import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, InputLabel, Autocomplete, FormControlLabel,
  RadioGroup, Radio, FormGroup, Checkbox, Box, Typography
} from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import api from '../services/api';

const ProductUpdateForm = ({ open, onClose, product, categories, onUpdated }) => {
  const [form, setForm] = useState({
    productName: '',
    stock: '',
    weight: '',
    mrp: '',
    salePrice: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [displayImage, setDisplayImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [thumbnailPreviews, setThumbnailPreviews] = useState([]);
  const [availability, setAvailability] = useState('ReadyToShip');
  const [productType, setProductType] = useState([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        productName: product.productName || '',
        stock: product.stock || '',
        weight: product.weight || '',
        mrp: product.mrp || '',
        salePrice: product.salePrice || '',
      });
      setSelectedCategory(product.category?._id || '');
      setSelectedSubCategories(Array.isArray(product.subCategories) ? product.subCategories : []);
      setAvailability(product.availability || 'ReadyToShip');
      setProductType(Array.isArray(product.productType) ? product.productType : []);
      setDescription(product.productDescription || '');
      setDisplayImage(null);
      setOtherImages([]);
      setThumbnailPreviews([]);
    }
  }, [product]);

  useEffect(() => {
    if (!selectedCategory) {
      setSubCategories([]);
      setSelectedSubCategories([]);
      return;
    }
    const cat = categories.find(c => c._id === selectedCategory);
    setSubCategories(cat?.subCategories || []);
    setSelectedSubCategories([]);
  }, [selectedCategory, categories]);

  const handleThumbnailPreview = (files) => {
    const previews = Array.from(files).map(file => URL.createObjectURL(file));
    setThumbnailPreviews(previews);
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    fd.append('productName', form.productName);
    fd.append('category', selectedCategory);
    fd.append('subCategories', selectedSubCategories.join(','));
    if (displayImage) fd.append('displayImage', displayImage);
    Array.from(otherImages).forEach(img => fd.append('otherImages', img));
    fd.append('availability', availability);
    fd.append('productType', productType.join(','));
    fd.append('stock', form.stock);
    fd.append('weight', form.weight);
    fd.append('mrp', form.mrp);
    fd.append('salePrice', form.salePrice);
    fd.append('productDescription', description);

    try {
      await api.patch(`/updateProduct/${product._id}`, fd);
      alert('Product updated successfully!');
      onUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Product</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth label="Product Name" margin="normal"
          value={form.productName}
          onChange={e => setForm({ ...form, productName: e.target.value })}
        />

        <Autocomplete
          options={categories}
          getOptionLabel={o => o.categoryName}
          value={categories.find(c => c._id === selectedCategory) || null}
          onChange={(e, v) => setSelectedCategory(v?._id || '')}
          renderInput={params => <TextField {...params} label="Category" />}
          sx={{ mt: 2 }}
        />

        <Autocomplete
          multiple
          options={subCategories}
          value={selectedSubCategories}
          onChange={(e, v) => setSelectedSubCategories(v)}
          renderInput={params => <TextField {...params} label="SubCategories" />}
          sx={{ mt: 2 }}
          disabled={!subCategories.length}
        />

        <InputLabel sx={{ mt: 2 }}>Display Image</InputLabel>
        <input type="file" accept="image/*" onChange={e => setDisplayImage(e.target.files[0])} />

        <InputLabel sx={{ mt: 2 }}>Other Images</InputLabel>
        <input
          type="file" accept="image/*" multiple
          onChange={e => {
            setOtherImages(e.target.files);
            handleThumbnailPreview(e.target.files);
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          {thumbnailPreviews.map((src, i) => (
            <img key={i} src={src} alt="" width={60} height={60} style={{ objectFit: 'cover' }} />
          ))}
        </Box>

        <RadioGroup row value={availability} onChange={e => setAvailability(e.target.value)} sx={{ mt: 2 }}>
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
                    const next = e.target.checked
                      ? [...productType, type]
                      : productType.filter(t => t !== type);
                    setProductType(next);
                  }}
                />
              }
              label={type.replace('_', ' ')}
            />
          ))}
        </FormGroup>

        {['stock', 'weight', 'mrp', 'salePrice'].map(field => (
          <TextField
            key={field} fullWidth type="number"
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            margin="normal"
            value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <Box sx={{ mt: 2 }}>
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(_, editor) => setDescription(editor.getData())}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>Update</Button>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductUpdateForm;
