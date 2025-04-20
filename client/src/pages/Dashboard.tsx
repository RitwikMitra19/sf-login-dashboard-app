import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface Account {
  Id: string;
  Name: string;
  Type: string;
  Industry: string;
  Phone: string;
  Website: string;
  AnnualRevenue: number;
}

const Dashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchAccounts();
  }, [page, rowsPerPage]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/salesforce/accounts?page=${
          page + 1
        }&limit=${rowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setAccounts(response.data.accounts);
      setTotal(response.data.total);
      setError('');
    } catch (err) {
      setError('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleConnectSalesforce = () => {
    window.location.href = 'http://localhost:5000/api/salesforce/auth';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Salesforce Accounts
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConnectSalesforce}
          sx={{ mb: 2 }}
        >
          Connect to Salesforce
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Annual Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {error}
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account) => (
                  <TableRow key={account.Id}>
                    <TableCell>{account.Name}</TableCell>
                    <TableCell>{account.Type}</TableCell>
                    <TableCell>{account.Industry}</TableCell>
                    <TableCell>{account.Phone}</TableCell>
                    <TableCell>{account.Website}</TableCell>
                    <TableCell>
                      {account.AnnualRevenue
                        ? `$${account.AnnualRevenue.toLocaleString()}`
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Dashboard; 