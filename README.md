# ApiPilot - A Simple REST API Client

ApiPilot is a user-friendly REST API client that simplifies making and managing API requests. Whether you're a developer or a beginner, ApiPilot offers an intuitive interface to streamline API testing and interaction.

With support for HTTP methods like GET, POST, PUT, DELETE, and PATCH, ApiPilot makes it faster and more efficient to manage API requests, view responses, and debug API interactions.

---

## Features

- **Support for Standard HTTP Methods:**  
  GET, POST, PUT, DELETE, and PATCH
- **Intuitive User Interface:**  
  Clean, easy-to-use design that makes interacting with APIs straightforward.
- **Real-time Response Display:**  
  See responses instantly after making requests, with detailed information like status codes, headers, and body content.
- **Request History:**  
  Save and re-execute your API requests for easy testing and debugging.
- **Easy Authentication Support:**  
  Built-in support for common API authentication methods (Bearer tokens, Basic Auth, etc.).
- **Customizable Headers and Body:**  
  Easily configure request headers and body for advanced API interactions.
- **Cross-Platform Support:**  
  Works across major operating systems, including Windows, macOS, and Linux.

---

## Installation

### Prerequisites

- **Node.js** (>=12.x)  
- **npm** (>=6.x)

### Clone the Repository

```bash
git clone https://github.com/anmolpaweriya/apipilot.git
```

### Install Dependencies

```bash
cd apipilot
npm install
```

### Start the Application

```bash
npm run dev
```


Visit http://localhost:3000 in your browser to start using ApiPilot!


## Usage

### Sending API Requests

ApiPilot provides an easy-to-use interface for making HTTP requests. To send a request:

1. **Choose the HTTP Method:**  
   From the dropdown menu, select the HTTP method for the request (GET, POST, PUT, DELETE, PATCH).

2. **Enter the URL:**  
   In the URL input field, enter the API endpoint you want to interact with.

3. **Add Headers (optional):**  
   If needed, you can add custom headers for your API request. This can include authentication tokens or content-type headers.

4. **Add Body (for POST, PUT, and PATCH requests):**  
   If you're sending data in the request (for POST, PUT, or PATCH methods), you can add a JSON body in the input field.

5. **Send Request:**  
   Click the "Send" button to make the request. ApiPilot will display the response, including the status code, headers, and response body.

### Response Information

ApiPilot provides a comprehensive view of the response:

- **Status Code:** Displays the HTTP status code (e.g., 200 OK, 404 Not Found).
- **Response Headers:** View all the headers returned by the API.
- **Response Body:** View the raw data returned by the API.

---

## Examples


To fetch a list of users from an API, you can send a **GET** request:

1. Choose **GET** from the method dropdown.
2. Enter the URL: `https://api.example.com/users`
3. Click **Send**.

#### Example GET Request Code:
```javascript
axios.get('https://api.example.com/users')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
```