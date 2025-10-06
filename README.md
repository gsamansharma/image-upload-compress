# Azure Image Upload & Compression Function
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A serverless Azure Function that provides an HTTP endpoint to upload an image, compress it into WebP format, and store it in Azure Blob Storage.

## Overview

This function is designed to be a lightweight, scalable, and cost-effective solution for handling image uploads. It intercepts a multipart/form-data request, extracts the image file, uses the high-performance sharp library to compress it, and uploads the result to a specified Azure Blob Storage container. This is ideal for web or mobile applications that need to process user-uploaded images efficiently.

## Features

* **HTTP Trigger:** Simple and accessible via a standard POST request.
* **Multipart Form Parsing:** Handles file uploads from web forms or clients.
* **Image Compression:** Automatically compresses images to the modern, efficient WebP format using sharp.
* **Configurable Quality:** Image compression quality can be controlled via an environment variable.
* **Azure Blob Storage Integration:** Securely uploads the processed image to a designated blob container.
* **Scalable & Serverless:** Built on Azure Functions to handle load automatically.

## Prerequisites

Before you begin, ensure you have the following installed:

* Node.js (v18 or later recommended)
* Azure Functions Core Tools
* Azure CLI
* An Azure Subscription and an Azure Storage Account

## ⚙️ Setup and Configuration

### 1. Clone the Repository

```bash
git clone https://github.com/gsamansharma/image-upload-compress
cd image-upload-compress
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `local.settings.json` file in the root of the project. This file is used for local development and should not be committed to source control.

**local.settings.json Template:**

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_STORAGE_CONNECTION_STRING": "DefaultEndpointsProtocol=https...your-connection-string",
    "AZURE_STORAGE_CONTAINER_NAME": "your-container-name",
    "IMAGE_QUALITY": "80"
  }
}
```

* `AZURE_STORAGE_CONNECTION_STRING`: Get this from your Azure Storage Account access keys.
* `AZURE_STORAGE_CONTAINER_NAME`: The name of the blob container where images will be stored (e.g., `images`).
* `IMAGE_QUALITY`: (Optional) A number from 1-100. Defaults to 80.

## 🚀 Running Locally

To start the function on your local machine, run the following command from the project root:

```bash
func start
```

The terminal will display the local URL for your uploadImage function, typically `http://localhost:7071/api/uploadImage`.

## API Endpoint

### POST /api/uploadImage

Uploads and processes a single image file.

* **Method:** POST
* **Headers:**
  * Content-Type: `multipart/form-data`
* **Body:** The request body must be `multipart/form-data` and contain a file field. The field name can be anything (e.g., `image`, `file`, `upload`).

**Example Request using cURL:**

```bash
curl -X POST \
  http://localhost:7071/api/uploadImage \
  -F "image=@/path/to/your/image.jpg"
```

### ✅ Success Response (200 OK)

```json
{
  "message": "Image uploaded & compressed successfully!",
  "blobUrl": "https://yourstorageaccount.blob.core.windows.net/your-container/uuid-goes-here.webp",
  "originalSize": 102400,
  "compressedSize": 25600
}
```

### ❌ Error Responses

* **400 Bad Request:** Sent if the Content-Type is not `multipart/form-data` or if no file is found in the request.
* **500 Internal Server Error:** Sent if an error occurs during compression or upload. The response body will contain the error message.

## 🔧 Configuration Options

The function's behavior can be customized using the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `AZURE_STORAGE_CONNECTION_STRING` | The connection string for the Azure Storage Account. | `null` |
| `AZURE_STORAGE_CONTAINER_NAME` | The name of the blob container for storing images. | `null` |
| `IMAGE_QUALITY` | The quality setting (1-100) for WebP compression. | `80` |

## 📝 License

This project is licensed under the [MIT License](./LICENSE) — see the LICENSE file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

**Aman Sharma**  
📩 [contact@amansharma.cv](mailto:contact@amansharma.cv)  
🌐 [amansharma.cv](https://amansharma.cv)

🌟 Star this repo if you found it useful!