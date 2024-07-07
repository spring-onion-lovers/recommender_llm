<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://[github.com/insight-sg/insight-mobile](https://github.com/kjh-bryan/gift-redemption-app)">
    <img src="https://github.com/spring-onion-lovers/recommender_llm/assets/30686810/b03667c7-e536-4745-bd07-b86934c291a9" alt="Logo" width="50" >
    
  </a>

<h3 align="center">Recommender System (LLM) Backend for TrendCart</h3>

   <p align="center">
     A Node.js and TypeScript-based recommendation system leveraging Pinecone for vector similarity search and OpenAI for embeddings. This system provides various endpoints for product and user embeddings, bulk inserts, generating recommendations and providing products to user's query.<br />
   <!-- <a href="">View Demo</a> -->
  </p>
</div>
</br>
</br>

<!-- TABLE OF CONTENTS -->
<details >
  <summary ><h2>Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
        <li><a href="#features">Features</a></li>
        <li><a href="#architecture-diagram">Architecture Diagram</a></li>
        <li><a href="#built-with">Built With</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#api-endpoints">API Endpoints</a></li>
    <li><a href="#code-structure">Code Structure</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

</br>
</br>
<!-- ABOUT THE PROJECT -->

## About The Project

This project is designed to recommend products to users based on their interactions and embeddings created using OpenAI's text embedding models and Pinecone's vector database. It provides multiple endpoints to handle upsert operations for products and users, generate recommendations based on user interactions, retrieve similar product recommendations and provide products based on user's query.

## Features

- NodeJS(Backend) + Pinecone(Vector Database)
  - Product Upsert: Add or update products in the recommendation index.
  - User Upsert: Add or update user interaction data.
  - Bulk Product Insert: Insert multiple products in a single request.
  - User-Based Recommendations: Retrieve product recommendations based on user interactions.
  - Product-Based Recommendations: Retrieve similar products based on product embeddings
  - User's Query Product Recommendations: Retrive products according to user's query


### Architecture Diagram
| Miro.io             |
| --------------------------------------------------------- |
|![Untitled](https://github.com/spring-onion-lovers/recommender_llm/assets/30686810/8805b40c-3ad2-4be3-85be-d484e15203ed)|

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

<a name="built-with"></a>
- [![Express][express.dev]][express-url]
- [![NodeJS][node.dev]][node-url] Hosted on ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)
- ![image](https://github.com/spring-onion-lovers/recommender_llm/assets/30686810/95f6cd1f-040d-4706-8b19-6feeb147f0e6)
- ![images (1)](https://github.com/spring-onion-lovers/recommender_llm/assets/30686810/57784abc-f3b7-4d17-bc40-cc7e0253a6b8)


<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- Pinecone account and API key https://www.pinecone.io/
- OpenAI account and API key https://platform.openai.com/docs/overview


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/spring-onion-lovers/recommender_llm.git
   cd recommender_llm
   ```
2. Install packages
   ```sh
   npm install
   ```
3. Create .env files with the following variables

   ```sh
   PINECONE_API_KEY=your_pinecone_api_key
   OPEN_API_KEY=your_openai_api_key
   ```

4. Start the server
   ```js
   npm run dev
   ```

   
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

### API Endpoints
#### Handle Product Upsert
```http
POST /api/v1/product
```

- Request Body:
  ```json
  {
      "productId":1,
      "name":"Smartphone",
      "description": "Latest model with advanced features",
      "category":"Electronics"
  }
  ```
- Response:
  ```json
  {
    "message": "success",
    "response": true
  }
  ```

Intiailize Bulk Product Insert
```http
POST /api/v1/bulkProduct
```

- Request Body:
  ```json
  {
    "products": [
        {
            "productId": 1,
            "name": "Smartphone",
            "description": "Latest model with advanced features",
            "category": "Electronics"
        },
        {
            "productId": 2,
            "name": "Laptop",
            "description": "High-performance laptop for gaming and work",
            "category": "Electronics"
        },
        {
            "productId": 3,
            "name": "Headphones",
            "description": "Noise-cancelling headphones with rich sound",
            "category": "Electronics"
        },
        {
            "productId": 4,
            "name": "Coffee Maker",
            "description": "Automatic coffee maker with grinder",
            "category": "Home Appliances"
        },
    ]
  }
  ```

- Response:
  ```json
  {
    "message": "success",
    "response": true
  }
  ```

#### Handle User Upsert
```http
POST /api/v1/user
```
- Request Body:
  ```json
  {
    "userId": 1,
    "userInteractions": [
        {
            "userId": 1,
            "interaction": "purchase",
            "productId": 1
        },
        {
            "userId": 1,
            "interaction": "purchase",
            "productId": 2
        },
        {
            "userId": 1,
            "interaction": "purchase",
            "productId": 3
        },
    ]
  }
  ```

- Response:
  ```json
  {
    "message": "success",
    "response": true
  }
  ```

#### Handle User Query
```http
GET /api/v1/query
```
- Query Parameter:
  - `query`: User's query. E.g. "I need a watch, I'm into technology"

- Response:
  ```json
  {
    "message": "success",
    "response": ["2", "4", "13"] // Product Ids
  }
  ```

#### Handle Update User Interaction
```http
POST /api/v1/interaction
```
- Request Body:
  ```json
  {
    "userId": 1,
    "interaction": "purchase",
    "productId": 1
  }
  ```
- Response:
  ```json
  {
    "message": "success",
    "response": true
  }
  ```

#### Get User Recommendations
```http
GET /api/v1/recommend
```

- Query Parameter:
  - `userId`: The user ID.

- Response:
  ```json
  {
    "message": "OK",
    "response": ["123", "456", "789"] // Product Ids
  }
  ```

#### Get Similar Product Recommendations
```http
GET /api/v1/recommend-similar-product
```

- Query Parameter:
  - `productId`: The product ID.

- Response:
  ```json
  {
    "message": "OK",
    "response": ["6", "8", "16"] // Product Ids
  }
  ```
  
## Code Structure
```plaintext
├── src
│   ├── controllers
│   │   └── recommender.controller.ts
│   ├── helper
│   │   └── helper.ts
│   ├── routes
│   │   └── recommender.route.ts
│   ├── services
│   │   └── recommender.service.ts
│   ├── config
│   │   └── default.ts
│   ├── utils
│   │   ├── openAi.ts
│   │   ├── pineconeClient.ts
│   │   └── constant.ts
│   └── app.ts
│   └── index.ts
│   └── routes..ts
└── README.md
```

## Contact

Bryan Kang - [Github](https://github.com/kjh-bryan)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


[express.dev]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[express-url]: https://expressjs.com/
[node.dev]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[node-url]: https://nodejs.org/
