import sys
from linkedin_poster_agent import post_to_linkedin, load_db, save_db

def main():
    db = load_db()
    if not db or "draft" not in db or not db["draft"]:
        print("No hay ningún borrador pendiente.")
        return
        
    draft = db["draft"]
    print(f"Publicando post sobre: {draft['topic_name']}...")
    
    success = post_to_linkedin(draft["content"])
    
    if success:
        for t in db["topics"]:
            if t["name"] == draft["topic_name"]:
                t["posted"] = True
                break
        db["last_posted_type"] = draft["topic_type"]
        db["draft"] = None
        save_db(db)
        print("Publicación completada y base de datos actualizada exitosamente.")
    else:
        print("No se pudo publicar.")

if __name__ == "__main__":
    main()
