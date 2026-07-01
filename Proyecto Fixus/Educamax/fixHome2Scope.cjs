const fs = require('fs');

let txt = fs.readFileSync('src/components/Home2.jsx', 'utf8');

// Remove initials from inside the useEffect
txt = txt.replace(/      const initials = profile[\s\S]*?: 'F';\s*/, '');

// Insert initials before the return statement
txt = txt.replace(/  return \(/, 
`  const initials = profile
    ? \`\${profile.nombre?.[0] || ''}\${profile.apellido?.[0] || ''}\`.toUpperCase()
    : 'F';

  return (`);

fs.writeFileSync('src/components/Home2.jsx', txt, 'utf8');
console.log('Fixed Home2 initials scope');
