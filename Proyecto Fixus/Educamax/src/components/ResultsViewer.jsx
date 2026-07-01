import { useState, useEffect, useRef } from 'react';
import { Download, Copy, RefreshCw, Check, FileText, Printer, Edit3, Eye, Sparkles, Send } from 'lucide-react';
import jsPDF from 'jspdf';
import { refinarDocumento } from '../services/api';

function renderMarkdown(text, tipo) {
  if (!text) return '';
  const isInfo = tipo === 'infografia';
  
  return text
    .replace(/!\[(.*?)\]\((.*?)\)/g, `<img src="$2" alt="$1" class="w-full rounded-2xl mb-8 shadow-xl border-4 ${isInfo ? 'border-blue-100 dark:border-blue-900/50' : 'border-white dark:border-gray-800'} object-cover aspect-video" />`)
    .replace(/^### (.+)$/gm, `<h3 class="text-base font-bold ${isInfo ? 'text-blue-700 dark:text-blue-300' : 'text-[var(--color-text-main)]'} mt-4 mb-1">$1</h3>`)
    .replace(/^## (.+)$/gm, `<h2 class="text-lg font-bold ${isInfo ? 'text-blue-800 dark:text-blue-400 border-b-2 border-blue-200 dark:border-blue-800/50 pb-1 inline-block' : 'text-[var(--color-text-main)]'} mt-6 mb-3">$1</h2><br/>`)
    .replace(/^# (.+)$/gm, `<h1 class="text-3xl font-black ${isInfo ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 text-center uppercase tracking-wider' : 'text-xl text-[var(--color-text-main)]'} mt-2 mb-6">$1</h1>`)
    .replace(/\*\*(.+?)\*\*/g, `<strong class="font-bold ${isInfo ? 'text-blue-900 dark:text-blue-200' : ''}">$1</strong>`)
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/^---$/gm, `<hr class="${isInfo ? 'border-blue-200 dark:border-blue-800/50' : 'border-[var(--color-border)]/40'} my-6 border-2 rounded-full" />`)
    .replace(/^- (.+)$/gm, `<li class="ml-4 list-disc text-sm mb-1 ${isInfo ? 'marker:text-blue-500' : ''}">$1</li>`)
    .replace(/^(\d+)\. (.+)$/gm, `<li class="ml-4 list-none text-sm mb-2 flex gap-2"><span class="font-black ${isInfo ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs' : ''}">$1</span> <span>$2</span></li>`)
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

export default function ResultsViewer({ content, titulo, tipo, onNew }) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Tab state: 'A' (Estándar) or 'B' (PIE/D.U.A)
  const [activeTab, setActiveTab] = useState('A');
  
  const [editedContentA, setEditedContentA] = useState('');
  const [editedContentB, setEditedContentB] = useState('');
  
  // States for IA Refiner
  const [refinerInput, setRefinerInput] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (typeof content === 'object' && content !== null && content.formaA) {
      setEditedContentA(content.formaA || '');
      setEditedContentB(content.formaB || '');
    } else {
      setEditedContentA(content || '');
      setEditedContentB('');
    }
    setActiveTab('A');
  }, [content]);

  const currentContent = activeTab === 'A' ? editedContentA : editedContentB;
  const setCurrentContent = (newContent) => {
    if (activeTab === 'A') setEditedContentA(newContent);
    else setEditedContentB(newContent);
  };


  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefine = async () => {
    if (!refinerInput.trim()) return;
    setIsRefining(true);
    try {
      const updated = await refinarDocumento(currentContent, refinerInput);
      setCurrentContent(updated);
      setRefinerInput('');
    } catch (e) {
      console.error(e);
      alert('Error al refinar el documento.');
    } finally {
      setIsRefining(false);
    }
  };

  const handlePDF = () => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const lines = pdf.splitTextToSize(currentContent, 175);
    pdf.setFont('helvetica');
    pdf.setFontSize(11);
    let y = 20;
    lines.forEach(line => {
      if (y > 270) { pdf.addPage(); y = 20; }
      pdf.text(line, 17, y);
      y += 6;
    });
    pdf.save(`${titulo || 'educamax'}.pdf`);
  };

  const handlePrint = () => window.print();

  return (
    <div className="max-w-3xl animate-fade-in mx-auto">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
              {tipo === 'infografia' ? 'Infografía Generada' : 'Resultado generado'}
            </span>
          </div>
          <h2 className="text-lg font-bold text-[var(--color-text-main)] mt-0.5">{titulo}</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${isEditing ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/50 text-[var(--color-primary)]' : 'border-[var(--color-border)]/50 text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/5'}`}>
            {isEditing ? <><Eye className="w-3.5 h-3.5" /> Vista Previa</> : <><Edit3 className="w-3.5 h-3.5" /> Editar</>}
          </button>
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-[var(--color-border)]/50 text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/5 transition-all">
            {copied ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
          </button>
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-[var(--color-border)]/50 text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/5 transition-all">
            <Printer className="w-3.5 h-3.5" /> Imprimir
          </button>
          <button onClick={handlePDF} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] transition-all shadow-md hover:shadow-lg">
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
          <button onClick={onNew} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-[var(--color-accent)]/50 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all">
            <RefreshCw className="w-3.5 h-3.5" /> Nueva
          </button>
        </div>
      </div>

      {/* Tabs para D.U.A si existe formaB */}
      {editedContentB && (
        <div className="flex justify-center mb-6">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)]/50 rounded-xl p-1 inline-flex shadow-sm">
            <button
              onClick={() => setActiveTab('A')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'A' 
                  ? 'bg-[var(--color-primary)] text-white shadow-md' 
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-border)]/20'
              }`}
            >
              Estándar
            </button>
            <button
              onClick={() => setActiveTab('B')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'B' 
                  ? 'bg-emerald-500 text-white shadow-md' 
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-border)]/20'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Adecuación PIE (D.U.A)
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`rounded-3xl p-8 sm:p-10 shadow-2xl transition-colors duration-500 relative mb-24 ${
        tipo === 'infografia' 
          ? 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900 border-2 border-blue-200/50 dark:border-blue-800/30' 
          : 'bg-[var(--color-surface)] border border-[var(--color-border)]/30'
      }`}>
        {isEditing ? (
          <textarea
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            className="w-full h-[60vh] bg-transparent border-0 outline-none resize-none font-mono text-sm leading-relaxed text-[var(--color-text-main)]"
            spellCheck="false"
          />
        ) : (
          <div
            className={`prose-educamax text-sm leading-relaxed max-w-none ${tipo === 'infografia' ? 'text-slate-700 dark:text-slate-300' : 'text-[var(--color-text-main)]'}`}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(currentContent, tipo) }}
          />
        )}
      </div>

      {/* Refiner IA Chat (Floating at bottom of document) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
        <div className="bg-[var(--color-surface)] border border-purple-500/30 rounded-2xl p-2 shadow-2xl shadow-purple-500/10 flex items-center gap-2">
          <div className="bg-purple-500/10 p-2.5 rounded-xl">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <input 
            type="text" 
            placeholder="Ej: Haz la pregunta 3 más fácil, o cambia a formato verdadero/falso..."
            value={refinerInput}
            onChange={(e) => setRefinerInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
            disabled={isRefining || isEditing}
            className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] h-full px-2"
          />
          <button 
            onClick={handleRefine}
            disabled={isRefining || !refinerInput.trim() || isEditing}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center shrink-0"
          >
            {isRefining ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
