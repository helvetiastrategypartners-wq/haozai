# haozai

Outil web léger pour **créer et visualiser des mindmaps** à partir de :

- Markdown hiérarchique (`#`, `##`, listes indentées `-`)
- Mermaid (`mindmap` natif)

## Démarrage rapide

```bash
python3 -m http.server 8080
```

Puis ouvrir <http://localhost:8080>.

## Fonctionnalités

- Choix du mode d'entrée: **Markdown** ou **Mermaid**.
- Conversion automatique Markdown → Mermaid mindmap.
- Prévisualisation SVG Mermaid en direct.
- Modèles prêts à l'emploi pour démarrer rapidement.
- Bouton de copie du contenu source.

## Fichiers

- `index.html` : structure de l'interface.
- `styles.css` : style moderne et lisible.
- `app.js` : logique de conversion et rendu Mermaid.
