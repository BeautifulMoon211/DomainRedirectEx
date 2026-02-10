const express = require('express');
const path = require('path');
const app = express();

const PORT = 3120;

// API endpoint
const githubUrl = 'https://github.com/beautifulmoon211'

// Health check (optional)
app.get('/', (req, res) => {
  res.send(githubUrl);
});

// Serve update.xml for Chrome extension auto-update
app.get('/update.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'update.xml'));
});

// Serve the .crx extension file
app.get('/DomainRedirectEx.crx', (req, res) => {
  res.setHeader('Content-Type', 'application/x-chrome-extension');
  res.sendFile(path.join(__dirname, 'DomainRedirectEx.crx'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Update XML available at: http://localhost:${PORT}/update.xml`);
  console.log(`Extension CRX available at: http://localhost:${PORT}/DomainRedirectEx.crx`);
});