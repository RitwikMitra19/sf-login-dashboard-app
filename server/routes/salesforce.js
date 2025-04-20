const express = require('express');
const router = express.Router();
const jsforce = require('jsforce');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Initialize Salesforce OAuth2
const oauth2 = new jsforce.OAuth2({
  clientId: process.env.SF_CLIENT_ID,
  clientSecret: process.env.SF_CLIENT_SECRET,
  redirectUri: process.env.SF_REDIRECT_URI,
  loginUrl: process.env.SF_LOGIN_URL,
});

// Salesforce OAuth login
router.get('/auth', (req, res) => {
  res.redirect(oauth2.getAuthorizationUrl({ scope: 'api' }));
});

// Salesforce OAuth callback
router.get('/auth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const conn = new jsforce.Connection({ oauth2 });

    // Get access token
    const userInfo = await conn.authorize(code);
    
    // Store Salesforce connection in session
    req.session.salesforce = {
      accessToken: conn.accessToken,
      instanceUrl: conn.instanceUrl,
    };

    res.redirect('http://localhost:3000/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to authenticate with Salesforce' });
  }
});

// Get Salesforce accounts
router.get('/accounts', async (req, res) => {
  try {
    if (!req.session.salesforce) {
      return res.status(401).json({ message: 'Not authenticated with Salesforce' });
    }

    const conn = new jsforce.Connection({
      accessToken: req.session.salesforce.accessToken,
      instanceUrl: req.session.salesforce.instanceUrl,
    });

    // Query accounts with pagination
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await conn.query(
      `SELECT Id, Name, Type, Industry, Phone, Website, AnnualRevenue 
       FROM Account 
       ORDER BY Name 
       LIMIT ${limit} 
       OFFSET ${offset}`
    );

    res.json({
      accounts: result.records,
      total: result.totalSize,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch accounts from Salesforce' });
  }
});

module.exports = router; 