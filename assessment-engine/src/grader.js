const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const SANDBOX_DIR = '/tmp/devlens-sandbox';

// Ensure sandbox directory exists
if (!fs.existsSync(SANDBOX_DIR)) {
  fs.mkdirSync(SANDBOX_DIR, { recursive: true });
}

const TIMEOUT = 5000; // 5 seconds timeout

router.post('/execute', (req, res) => {
  try {
    const { language, code, testCases } = req.body;

    if (!language || !code) {
      return res.status(400).json({ error: 'Missing language or code' });
    }

    let command, args;

    switch (language) {
      case 'javascript':
        command = 'node';
        args = [];
        break;
      case 'python':
        command = 'python3';
        args = [];
        break;
      case 'java':
        command = 'java';
        args = [];
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language' });
    }

    // Write code to temporary file
    const filename = `code-${Date.now()}.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'java'}`;
    const filepath = path.join(SANDBOX_DIR, filename);
    fs.writeFileSync(filepath, code);

    // Execute code with timeout
    const process = spawn(command, [...args, filepath]);
    let output = '';
    let errorOutput = '';
    let timeout;

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    timeout = setTimeout(() => {
      process.kill();
      res.json({
        success: false,
        error: 'Execution timeout',
        output: output
      });
    }, TIMEOUT);

    process.on('close', (code) => {
      clearTimeout(timeout);
      
      // Clean up
      fs.unlinkSync(filepath);

      let result = {
        success: code === 0,
        exit_code: code,
        output: output,
        error: errorOutput
      };

      // Grade against test cases if provided
      if (testCases && testCases.length > 0) {
        let passed = 0;
        const results = [];
        
        for (const test of testCases) {
          const passed_test = output.includes(test.expected);
          if (passed_test) passed++;
          results.push({
            input: test.input,
            expected: test.expected,
            passed: passed_test
          });
        }
        
        result.test_results = results;
        result.passed_tests = passed;
        result.total_tests = testCases.length;
        result.score = (passed / testCases.length) * 100;
      }

      res.json(result);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Execution error', details: err.message });
  }
});

router.get('/languages', (req, res) => {
  res.json({
    supported: ['javascript', 'python', 'java', 'cpp', 'go', 'rust'],
    details: {
      javascript: { version: '18.x', runtime: 'Node.js' },
      python: { version: '3.9+', runtime: 'Python' },
      java: { version: '11+', runtime: 'JVM' }
    }
  });
});

module.exports = router;
