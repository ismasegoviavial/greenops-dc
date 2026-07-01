import codecs

content = codecs.open('src/components/Home.jsx', 'r', 'utf-8').read()

correct_code = '''  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  const motivationalLine = () => {
    const lines = [
      'Cada clase que preparas con cuidado cambia una vida. ✨',
      'Tu creatividad es la mejor herramienta pedagógica. ✨',
      'Los mejores profes nunca dejan de aprender. 📚',
      'Hoy también vas a hacer algo que vale la pena. 💛',
      'El esfuerzo de preparar bien una clase siempre se nota. 🎯',
    ];
    return lines[new Date().getMinutes() % lines.length];
  };

  const greeting = () => {
    const h = new Date().getHours();
    const name = (profile?.nombre || 'Fernanda').split(' ')[0];
    if (h >= 5 && h < 12) return `¡Buenos días, ${name}! ☀️`;
    if (h >= 12 && h < 19) return `¡Buenas tardes, ${name}! 📚`;
    return `¡Buenas noches, ${name}! 🌙`;
  };

  const firstName = (profile?.nombre || 'Fernanda').split(' ')[0];
  const initials = profile
    ? `${profile.nombre?.[0] || ''}${profile.apellido?.[0] || ''}`.toUpperCase()
    : 'F';

  const TYPE_LABELS = {
    evaluacion: { label: 'Evaluación', color: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' },
    infografia: { label: 'Infografía', color: 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' },
    imagen: { label: 'Imagen IA', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
  };

  return ('''

# Because replace_file_content failed, it left us with just handleLogout and then return (
target_snippet = "  const handleLogout = async () => { await signOut(auth); navigate('/'); };\r\n\r\n  return ("
if target_snippet not in content:
    target_snippet = "  const handleLogout = async () => { await signOut(auth); navigate('/'); };\n\n  return ("

new_content = content.replace(target_snippet, correct_code)
codecs.open('src/components/Home.jsx', 'w', 'utf-8').write(new_content)
