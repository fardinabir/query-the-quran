# Query The Quran

A modern web application that allows users to search through Quranic verses in Arabic, English, and Bangla using Elasticsearch's powerful search capabilities.

## Features

- Real-time search-as-you-type functionality
- Multi-language support (Arabic, English, Bangla)
- Modern and responsive UI
- Admin panel for data management
- CSV data import functionality
- Elasticsearch health monitoring
- Secure admin access

## Prerequisites

- Node.js (v18 or higher)
- Elasticsearch (v8 or higher)
- npm or yarn package manager

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd query-the-quran
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following content:
```env
# Elasticsearch Configuration
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_INDEX=quran_verses

# Server Configuration
PORT=3000
HOST=localhost

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

4. Start the server:
```bash
node src/app.js
```

5. Access the application:
- User Interface: `http://localhost:3000`
- Admin Interface: `http://localhost:3000/admin`

## Project Structure

```
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── app.js           # Main application file
├── public/
│   ├── admin/          # Admin interface
│   └── user/           # User interface
├── uploads/            # Temporary upload directory
├── .env                # Environment variables
└── package.json        # Project dependencies
```

## API Endpoints

### Search Endpoints
- `GET /api/v1/verses/search` - Search verses
  - Query parameters:
    - `query`: Search text
    - `from`: Pagination offset (optional)
    - `size`: Number of results per page (optional)

- `GET /api/v1/verses/suggest` - Get search suggestions
  - Query parameters:
    - `query`: Partial search text
    - `field`: Field to get suggestions from (optional)

### Admin Endpoints
- `POST /api/v1/verses/admin/upload` - Upload and index CSV data
  - Requires basic authentication
  - Accepts CSV file upload

- `GET /api/v1/verses/admin/health` - Get Elasticsearch cluster health
  - Requires basic authentication

## CSV Data Format

The application expects CSV files with the following columns:
```
id,sura_no,verse_no,ayat_text_arabic,ayat_text_english,ayat_text_bangla
```

## Security

- Admin endpoints are protected with basic authentication
- Rate limiting is implemented to prevent abuse
- Input validation and sanitization are in place
- Secure Elasticsearch connection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.