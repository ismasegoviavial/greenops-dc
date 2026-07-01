const fs = require('fs');

let txt = fs.readFileSync('src/components/Home2.jsx', 'utf8');

// Add import
if (!txt.includes("import { ErrorBoundary }")) {
  txt = txt.replace(/import \{ useState, useEffect \} from 'react';/, "import { useState, useEffect } from 'react';\nimport { ErrorBoundary } from './ErrorBoundary';");
}

// Wrap the main return in ErrorBoundary
// First find the `return (` line in the main component function body.
txt = txt.replace(/  return \(\n    <div className="min-h-screen/, "  return (\n    <ErrorBoundary>\n    <div className=\"min-h-screen");

// And close the tag before the final `);` of the component
// Since it's at the end of the file:
txt = txt.replace(/    <\/div>\n  \);\n\}\n/, "    </div>\n    </ErrorBoundary>\n  );\n}\n");

fs.writeFileSync('src/components/Home2.jsx', txt, 'utf8');
console.log('Added ErrorBoundary to Home2');
