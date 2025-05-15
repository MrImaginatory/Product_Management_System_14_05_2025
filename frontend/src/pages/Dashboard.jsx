import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box
} from '@mui/material';

import CategoryForm from '../components/CategoryForm';
import ProductForm from '../components/ProductForm';
import SubCategoryForm from '../components/SubCategoryForm';

import api from '../services/api';
import axios from 'axios';

const Dashboard = () => {
  const [openCategoryForm, setOpenCategoryForm] = useState(false);
  const [openProductForm, setOpenProductForm] = useState(false);
  const [openSubCategoryForm, setOpenSubCategoryForm] = useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      console.log(res.data);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const tableContainerStyle = {
    maxHeight: '300px',
    overflow: 'auto',
  };

  return (
    <div className="p-4">
      <Typography variant="h4" align='center' gutterBottom>Dashboard</Typography>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent:'center'}}>
        <Button variant="contained" onClick={() => setOpenCategoryForm(true)}>Add Category</Button>
        <Button variant="contained" onClick={() => setOpenSubCategoryForm(true)}>Add SubCategory</Button>
        <Button variant="contained" onClick={() => setOpenProductForm(true)}>Add Product</Button>
      </div>

      {/* Categories Table */}
      <Typography variant="h6" gutterBottom>Categories</Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 4 }} style={tableContainerStyle}>
        <Table sx={{ tableLayout: 'fixed' }} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '20%' }}>Category</TableCell>
              <TableCell sx={{ width: '20%' }}>SubCategory</TableCell>
              <TableCell sx={{ width: '20%' }}>Slug</TableCell>
              <TableCell sx={{ width: '20%' }}>Image</TableCell>
              <TableCell sx={{ width: '20%' }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(cat => (
              <TableRow key={cat._id}>
                <TableCell>{cat.categoryName}</TableCell>
                <TableCell>{Array.isArray(cat.subCategories) ? cat.subCategories.join(', ') : cat.subCategories}</TableCell>
                <TableCell>{cat.slug}</TableCell>
                <TableCell>
                  <img src={`http://localhost:3001${cat.image}`} alt="catalog of sarees" width="60" height="60" />
                </TableCell>
                <TableCell dangerouslySetInnerHTML={{ __html: cat.description }} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Products Table */}
      <Typography variant="h6" gutterBottom>Products</Typography>
      <TableContainer component={Paper} style={tableContainerStyle}>
        <Table sx={{ tableLayout: 'fixed' }} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '10%' }}>Product</TableCell>
              <TableCell sx={{ width: '10%' }}>Category</TableCell>
              <TableCell sx={{ width: '10%' }}>SubCategory</TableCell>
              <TableCell sx={{ width: '10%' }}>Display Image</TableCell>
              <TableCell sx={{ width: '10%' }}>Other Images</TableCell>
              <TableCell sx={{ width: '10%' }}>Availability</TableCell>
              <TableCell sx={{ width: '10%' }}>Type</TableCell>
              <TableCell sx={{ width: '10%' }}>Stock</TableCell>
              <TableCell sx={{ width: '10%' }}>Weight</TableCell>
              <TableCell sx={{ width: '10%' }}>MRP</TableCell>
              <TableCell sx={{ width: '10%' }}>Sale Price</TableCell>
              <TableCell sx={{ width: '10%' }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(prod => (
              <TableRow key={prod._id}>
                <TableCell>{prod.productName}</TableCell>
                <TableCell>{prod.category?.categoryName || 'N/A'}</TableCell>
                <TableCell>{prod.subCategories?.categoryName || 'N/A'}</TableCell>
                <TableCell>
                  <img src={`http://localhost:3001${prod.displayImage}`} alt="display" width="60" height="60" />
                </TableCell>
                <TableCell>
                  <Box display="flex" flexWrap="wrap">
                    {prod.otherImages?.map((img, i) => (
                      <img key={i} src={`http://localhost:3001${img}`} width="40" height="40" style={{ marginRight: 4, marginBottom: 4 }} />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>{prod.availability}</TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="column">
                    {prod.productType?.map((type, i) => (
                      <Typography key={i}>{type}</Typography>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>{prod.stock}</TableCell>
                <TableCell>{prod.weight}</TableCell>
                <TableCell>{prod.mrp}</TableCell>
                <TableCell>{prod.salePrice}</TableCell>
                <TableCell dangerouslySetInnerHTML={{ __html: prod.productDescription }} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Forms in Dialog */}
      <CategoryForm open={openCategoryForm} onClose={() => {
        setOpenCategoryForm(false);
        fetchCategories();
      }} />

      <ProductForm open={openProductForm} onClose={() => {
        setOpenProductForm(false);
        fetchProducts();
      }} />

      <SubCategoryForm
        open={openSubCategoryForm}
        onClose={() => setOpenSubCategoryForm(false)}
        categories={categories}
        onSubCategoryAdded={fetchCategories}
      />
    </div>
  );
};

export default Dashboard;
