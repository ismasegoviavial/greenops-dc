import os
import re

FILES = [
    r"C:\Users\Fernanda\.gemini\antigravity\brain\fd493162-746b-4353-99f8-45953a80c5d2\paper_data_center_cooling.tex",
    r"C:\Users\Fernanda\.gemini\antigravity\brain\fd493162-746b-4353-99f8-45953a80c5d2\tesis_capitulo1_introduccion.tex",
    r"C:\Users\Fernanda\.gemini\antigravity\brain\fd493162-746b-4353-99f8-45953a80c5d2\tesis_capitulo2_termodinamica.tex",
    r"C:\Users\Fernanda\.gemini\antigravity\brain\fd493162-746b-4353-99f8-45953a80c5d2\tesis_capitulo3_metodologia.tex",
    r"C:\Users\Fernanda\.gemini\antigravity\brain\fd493162-746b-4353-99f8-45953a80c5d2\tesis_capitulo4_resultados.tex",
    r"C:\Users\Fernanda\.gemini\antigravity\brain\fd493162-746b-4353-99f8-45953a80c5d2\tesis_capitulo5_conclusiones.tex"
]

def check_latex_syntax(filepath):
    print(f"Checking {os.path.basename(filepath)}...")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check braces balancing
    open_braces = content.count("{")
    close_braces = content.count("}")
    if open_braces != close_braces:
        print(f"  ! Warning: Unbalanced curly braces. open={open_braces}, close={close_braces}")
    
    # Check dollar signs balancing (inline math)
    dollar_signs = content.count("$")
    if dollar_signs % 2 != 0:
        print(f"  ! Warning: Odd number of dollar signs ({dollar_signs}). Might indicate unbalanced inline math.")
        
    # Check standard environments
    envs = re.findall(r"\\begin\{([a-zA-Z*]+)\}", content)
    for env in envs:
        begin_count = len(re.findall(r"\\begin\{" + re.escape(env) + r"\}", content))
        end_count = len(re.findall(r"\\end\{" + re.escape(env) + r"\}", content))
        if begin_count != end_count:
            print(f"  ! Warning: Unbalanced environment '{env}'. begin={begin_count}, end={end_count}")

def main():
    for f in FILES:
        if os.path.exists(f):
            check_latex_syntax(f)
        else:
            print(f"File not found: {f}")

if __name__ == "__main__":
    main()
