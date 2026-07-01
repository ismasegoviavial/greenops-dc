const fs = require('fs');

let txt = fs.readFileSync('src/components/Dashboard.jsx', 'utf8');

// 1. Update canNext
txt = txt.replace(/const canNext = \(\) => \{[\s\S]*?return true;\s*\};/m,
`const canNext = () => {
    if (currentStep === 1) return !!form.asignatura;
    if (currentStep === 2) return !!form.nivel;
    if (currentStep === 3) return form.tema.trim().length > 2;
    if (currentStep === 4) return !!form.tipoPreguntas;
    if (currentStep === 5 && form.tipoPreguntas === 'personalizado') {
      return Object.values(form.distribucion).reduce((a, b) => a + b, 0) === form.cantidad;
    }
    return true;
  };`);

// 2. Add distribucion to Step 5
const step5Replacement = 
`{/* Step 5: Config */}
              {currentStep === 5 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-[var(--color-text-main)]">Configuración final</h2>
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Cantidad de preguntas: <span className="text-[var(--color-primary)] text-base">{form.cantidad}</span></label>
                    <input type="range" min={3} max={30} value={form.cantidad} onChange={e => setForm(f => ({ ...f, cantidad: Number(e.target.value) }))} className="mt-2 w-full accent-[var(--color-primary)]" />
                    <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1"><span>3 preguntas</span><span>30 preguntas</span></div>
                  </div>

                  {form.tipoPreguntas === 'personalizado' && (
                    <div className="bg-[var(--color-primary)]/5 p-4 rounded-2xl border border-[var(--color-primary)]/20">
                      <label className="text-xs font-semibold text-[var(--color-text-main)] uppercase tracking-wider block mb-3">Distribución de las {form.cantidad} preguntas</label>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.keys(form.distribucion).map(key => (
                          <div key={key} className="flex flex-col">
                            <span className="text-xs text-[var(--color-text-muted)] capitalize mb-1">{key.replace('_', ' ')}</span>
                            <input type="number" min="0" max={form.cantidad} value={form.distribucion[key]}
                              onChange={e => setForm(f => ({ ...f, distribucion: { ...f.distribucion, [key]: Number(e.target.value) } }))}
                              className="px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-xl text-sm outline-none focus:border-[var(--color-primary)]" />
                          </div>
                        ))}
                      </div>
                      {Object.values(form.distribucion).reduce((a, b) => a + b, 0) !== form.cantidad && (
                        <p className="text-xs text-red-500 mt-2 font-medium flex items-center gap-1">⚠️ La suma debe ser exactamente {form.cantidad}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">Dificultad</label>
                    <div className="flex gap-2">
                      {[['fácil', '🟢'], ['medio', '🟡'], ['difícil', '🔴']].map(([v, e]) => (
                        <button key={v} onClick={() => setForm(f => ({ ...f, dificultad: v }))}
                          className={\`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium capitalize transition-all \${form.dificultad === v ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'border-[var(--color-border)]/50 text-[var(--color-text-muted)]'}\`}>
                          {e} {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">Instrucciones adicionales (opcional)</label>
                    <textarea value={form.instrucciones} onChange={e => setForm(f => ({ ...f, instrucciones: e.target.value }))}
                      placeholder="Ej: Incluir imágenes descriptivas, enfocarse en comprensión lectora..."
                      rows={3} className="w-full p-4 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 resize-none text-[var(--color-text-main)]" />
                  </div>
                </div>
              )}`;

txt = txt.replace(/\{\/\* Step 5: Config \*\/\}[\s\S]*?(?=\{\/\* Step 6: Resumen \*\/\})/m, step5Replacement + '\n\n              ');

// 3. Update Navigation logic
const navReplacement = 
`{/* Navigation */}
              {currentStep <= 6 && (
                <div className="flex justify-between mt-8">
                  <button onClick={() => setCurrentStep(s => Math.max(1, s - 1))} disabled={currentStep === 1 || isGenerating}
                    className="flex items-center gap-2 px-4 py-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 rounded-xl disabled:opacity-0 transition-colors text-sm font-medium">
                    <ChevronLeft className="w-4 h-4" /> Atrás
                  </button>
                  {currentStep < 6 && (
                    <button onClick={() => setCurrentStep(s => s + 1)} disabled={!canNext()}
                      className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-2xl transition-all text-sm shadow-md hover:shadow-lg">
                      Siguiente <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}`;

txt = txt.replace(/\{\/\* Navigation \*\/\}[\s\S]*?(?=<\/div>\s*<\/div>\s*\) : \()/m, navReplacement + '\n            ');

fs.writeFileSync('src/components/Dashboard.jsx', txt, 'utf8');
console.log('Fixed Dashboard.jsx logic');
