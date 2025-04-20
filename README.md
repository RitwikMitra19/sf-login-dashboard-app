# Salesforce Login Dashboard App

A full-stack web application with Salesforce integration.

## Deployment Instructions for Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy the application:
```bash
vercel
```

4. Set up environment variables in Vercel dashboard:
- `DATABASE_URL`: Your PostgreSQL database connection string
- `JWT_SECRET`: Your JWT secret key
- `FRONTEND_URL`: Your frontend URL (e.g., https://your-app.vercel.app)
- `SALESFORCE_CLIENT_ID`: Your Salesforce client ID
- `SALESFORCE_CLIENT_SECRET`: Your Salesforce client secret
- `SALESFORCE_CALLBACK_URL`: Your Salesforce callback URL (e.g., https://your-app.vercel.app/api/salesforce/callback)

5. After deployment, make sure to:
- Set up a PostgreSQL database (you can use Vercel Postgres or any other provider)
- Configure your Salesforce Connected App with the correct callback URL
- Update the CORS settings in your Salesforce Connected App to allow your Vercel domain

## Development

1. Install dependencies:
```bash
npm run install-all
```

2. Start development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
SALESFORCE_CLIENT_ID=your_salesforce_client_id
SALESFORCE_CLIENT_SECRET=your_salesforce_client_secret
SALESFORCE_CALLBACK_URL=http://localhost:5000/api/salesforce/callback
``` 