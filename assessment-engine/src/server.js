const express = require('express');
const graderRoutes = require('./grader');

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json({ limit: '50mb' }));
app.use('/api/grade', graderRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'assessment-engine' });
});

app.listen(PORT, () => {
  console.log(`🔬 Assessment Engine running on port ${PORT}`);
});
