const fs = require('fs');

let txt = fs.readFileSync('src/components/Dashboard.jsx', 'utf8');

txt = txt.replace(/const handleLogout = async \(\) => \{ await signOut\(auth\); navigate\('\/'\); \};[\s\S]*?tipo: 'evaluacion',/m,
`const handleLogout = async () => { await signOut(auth); navigate('/'); };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    try {
      const asig = form.asignatura === 'Otra' ? form.asignaturaCustom : form.asignatura;
      const content = await generateEvaluacion({
        asignatura: asig, nivel: form.nivel, tema: form.tema,
        tipoPreguntas: form.tipoPreguntas, cantidad: form.cantidad,
        dificultad: form.dificultad, instrucciones: form.instrucciones,
        distribucion: form.tipoPreguntas === 'personalizado' ? form.distribucion : null
      });
      setResult(content);
      if (auth.currentUser) {
        await addDoc(collection(db, 'materials'), {
          userId: auth.currentUser.uid,
          tipo: 'evaluacion',`);

fs.writeFileSync('src/components/Dashboard.jsx', txt, 'utf8');
