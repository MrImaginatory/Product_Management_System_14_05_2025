import React, { useEffect, useState } from 'react';
import {
  Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Stack
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import CategoryForm from '../components/CategoryForm';
import ProductForm from '../components/ProductForm';
import SubCategoryForm from '../components/SubCategoryForm';

import CategoryUpdateForm from '../components/CategoryUpdateForm';
import ProductUpdateForm from '../components/ProductUpdateForm';
import SubCategoryUpdateForm from '../components/SubCategoryUpdateForm';

import api from '../services/api';

const Dashboard = () => {
  const [openCategoryForm, setOpenCategoryForm] = useState(false);
  const [openProductForm, setOpenProductForm] = useState(false);
  const [openSubCategoryForm, setOpenSubCategoryForm] = useState(false);

  const [openCategoryUpdateForm, setOpenCategoryUpdateForm] = useState(false);
  const [openProductUpdateForm, setOpenProductUpdateForm] = useState(false);
  const [openSubCategoryUpdateForm, setOpenSubCategoryUpdateForm] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

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
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/deleteCategory/${categoryId}`);
      alert('Category deleted');
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert('Failed to delete category');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/deleteProduct/${productId}`);
      alert('Product deleted');
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  const tableContainerStyle = {
    maxHeight: '300px',
    overflow: 'auto',
  };

  return (
    <div className="p-4">
      {/* <Typography variant="h4" align="center" gutterBottom>Dashboard</Typography> */}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={() => setOpenCategoryForm(true)}> <AddIcon /> Category</Button>
        <Button variant="contained" onClick={() => setOpenSubCategoryForm(true)}> <AddIcon /> SubCategory</Button>
        <Button variant="contained" onClick={() => setOpenProductForm(true)}> <AddIcon /> Product</Button>
      </div>

      {/* Categories Table */}
      <Typography variant="h6" gutterBottom>Categories</Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 4 }} style={tableContainerStyle}>
        <Table sx={{ tableLayout: 'fixed' }} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{width:'10%'}}>Category</TableCell>
              <TableCell sx={{width:'10%'}}>SubCategory</TableCell>
              <TableCell sx={{width:'10%'}}>Slug</TableCell>
              <TableCell sx={{width:'5%'}}>Image</TableCell>
              <TableCell sx={{width:'40%'}}>Description</TableCell>
              <TableCell sx={{width:'5%'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(cat => (
              <TableRow key={cat._id}>
                <TableCell>{cat.categoryName}</TableCell>
                <TableCell>
                  {Array.isArray(cat.subCategories) ? cat.subCategories.join(', ') : cat.subCategories}
                  {Array.isArray(cat.subCategories) && cat.subCategories.length > 0 && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setOpenSubCategoryUpdateForm(true)}
                      sx={{ ml: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                  )}
                </TableCell>
                <TableCell>{cat.slug}</TableCell>
                <TableCell>
                  <img src={`http://localhost:3001${cat.image}`} alt="category" width="60" height="60" />
                </TableCell>
                <TableCell dangerouslySetInnerHTML={{ __html: cat.description }} />
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button size="small" variant="outlined" onClick={() => {
                      setEditingCategory(cat);
                      setOpenCategoryUpdateForm(true);
                    }}><EditIcon /></Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteCategory(cat._id)}>
                      <DeleteIcon />
                    </Button>
                  </Stack>
                </TableCell>
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
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>SubCategory</TableCell>
              <TableCell>Display Image</TableCell>
              <TableCell>Other Images</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>MRP</TableCell>
              <TableCell>Sale Price</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(prod => (
              <TableRow key={prod._id}>
                <TableCell>{prod.productName}</TableCell>
                <TableCell>{prod.category?.categoryName || 'N/A'}</TableCell>
                <TableCell>{prod.subCategories || 'N/A'}</TableCell>
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
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setEditingProduct(prod);
                        setOpenProductUpdateForm(true);
                      }}
                    >
                      <EditIcon/>
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteProduct(prod._id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Forms */}
      <CategoryForm
        open={openCategoryForm}
        onClose={() => {
          setOpenCategoryForm(false);
          fetchCategories();
        }}
      />

      <ProductForm
        open={openProductForm}
        onClose={() => {
          setOpenProductForm(false);
          fetchProducts();
        }}
      />

      <SubCategoryForm
        open={openSubCategoryForm}
        onClose={() => setOpenSubCategoryForm(false)}
        categories={categories}
        onSubCategoryAdded={fetchCategories}
      />

      {/* Update Forms */}
      <CategoryUpdateForm
        open={openCategoryUpdateForm}
        onClose={() => {
          setOpenCategoryUpdateForm(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onUpdated={fetchCategories}
      />

      <ProductUpdateForm
        open={openProductUpdateForm}
        onClose={() => {
          setOpenProductUpdateForm(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        categories={categories}
        onUpdated={fetchProducts}
      />

      <SubCategoryUpdateForm
        open={openSubCategoryUpdateForm}
        onClose={() => setOpenSubCategoryUpdateForm(false)}
        categories={categories}
        onUpdated={fetchCategories}
      />
    </div>
  );
};

export default Dashboard;
