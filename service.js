const express = require('express');
const app = express();

const PORT = 3120;

// API endpoint
const githubUrl = 'https://github.com/beautifulmoon211'
// Health check (optional)
app.get('/', (req, res) => {
  res.send(githubUrl);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});