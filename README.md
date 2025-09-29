# Query The Quran


A modern, high-performance web application that enables users to search and explore Quranic verses in multiple languages (Arabic, English, and Bangla) using Elasticsearch's powerful search capabilities. This application provides an intuitive interface for studying the Quran with advanced search features and multilingual support.

## ✨ Features

- **User Experience**
  - Consecutive verse reading feature from any starting point
  - Search results include Surah and Ayah references for every matched verse
  - Each verse element contains Arabic, along with English, and Bangla translation
  - Verses can be searched using Bangla, English, or Arabic words

- **Advanced Search Capabilities**
  - Real-time search-as-you-type functionality
  - Fuzzy matching for typo tolerance
  - Relevance-based results ranking
  - Multi-field search across verse text and translations

- **Multilingual Support**
  - Complete Arabic original text
  - English translation
  - Bangla (Bengali) translation
  - Language-specific boosting for more relevant results


- **Infrastructure**
  - Dockerized deployment with Docker Compose
  - Nginx Proxy Manager for SSL termination and rate limiting
  - Scalable architecture
  - Built on top of Elasticsearch to demonstrate its full-text search capabilities


## 🖼️ Application Preview

<p align="center">
  <img src="./public/assets/ui-sample/querypage.png" alt="User Interface" width="400" style="height:auto;" />
  <img src="./public/assets/ui-sample/readpage.png" alt="User Interface" width="400" style="height:auto;" />
</p>

## 🚀 Quick Start

### Using Docker (Recommended)

The easiest way to get started is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/fardinabir/query-the-quran.git
cd query-the-quran

# Start the application stack
docker-compose up -d
```

Access the application:
- User Interface: `http://localhost:3000`
- Admin Interface: `http://localhost:3000/admin` (default credentials: admin/admin123)

## 🏗️ Architecture

The application follows a clean MVC-like architecture:

```
├── src/
│   ├── config/          # Configuration management
│   ├── controllers/     # Request handlers
│   │   ├── admin/       # Admin controllers
│   │   └── user/        # User-facing controllers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API route definitions
│   │   ├── admin/       # Admin routes
│   │   └── user/        # User routes
│   ├── services/        # Business logic layer
│   │   ├── admin/       # Admin services
│   │   └── user/        # User services
│   ├── utils/           # Utility functions
│   │   └── elasticsearch/ # Elasticsearch configuration
│   └── app.js           # Application entry point
├── public/              # Static assets
│   ├── admin/           # Admin interface
│   └── user/            # User interface
├── uploads/             # File upload directory
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile           # Docker build instructions
└── package.json         # Project dependencies
```

## 🐳 Docker Configuration

The application includes a complete Docker setup:

- `Dockerfile` for containerizing the Node.js application
- `docker-compose.yml` for orchestrating the application stack:
  - Node.js application
  - Elasticsearch database
  - Nginx Proxy Manager for SSL and rate limiting

## Why Elasticsearch?

Inverted Index
- Maps terms to documents and positions, enabling millisecond full‑text search at scale
- Rich language analyzers (Arabic, English, Bangla) for tokenization, stemming, stopword handling, and normalization
- Relevance scoring (BM25), phrase/proximity queries, and result highlighting

Why PostgreSQL LIKE falls short
- LIKE/ILIKE often degrade to sequential scans on large datasets (especially with leading wildcards)
- No built‑in relevance ranking or field boosting; boolean matches only
- Weak typo tolerance and limited fuzzy matching; multilingual search is cumbersome without extensions
- Harder to scale horizontally for search workloads; PostgreSQL excels at transactions, Elasticsearch at search
- Note: PostgreSQL FTS and pg_trgm exist, but for multilingual fuzzy search, analyzers, and large‑scale relevance, Elasticsearch is more suitable

Fuzziness in Elasticsearch
- Set fuzziness to AUTO or explicit edit distance to tolerate typos
- Tune prefix_length and max_expansions to balance performance and accuracy
- Use n‑grams, synonyms, and phonetic analyzers to improve recall while preserving precision


## 📚 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

The Quran text and translations are sourced from verified public domain sources

