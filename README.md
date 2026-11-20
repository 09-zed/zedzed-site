# zedzed — site du studio

Site de zed-zed.com, construit avec [Astro](https://astro.build). Il produit des pages HTML statiques, hébergées sur Vercel.

## Lancer le site en local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère le site final dans dist/
```

## Où modifier quoi

| Je veux…                         | Fichier                                   |
|----------------------------------|-------------------------------------------|
| Ajouter ou modifier un projet    | `src/content/projets/*.md` + image dans `public/img/` |
| Ajouter des avis clients         | `src/data/avis.ts` (la section apparaît dès qu’il y a un avis) |
| Changer l’e-mail, le lien Cal.com, LinkedIn | `src/data/site.ts`           |
| Modifier un texte de section     | `src/components/<Section>.astro`          |
| Couleurs, typo, animations CSS   | `src/styles/global.css`                   |
| Animations au scroll, curseur, footer | `src/scripts/site.js`                |

Ajouter un projet : copier `src/content/projets/coverlys.md`, changer les champs, déposer l’image (16:10, ~2000 px de large, en .webp) dans `public/img/`. L’ordre d’affichage suit le champ `ordre`.

## À compléter avant la mise en ligne

- [x] Mentions légales
- [ ] FAQ : remplacer `[DÉLAI]` (`src/components/Faq.astro`)
- [ ] Avis clients (`src/data/avis.ts`)
- [ ] Lien LinkedIn (`src/data/site.ts`)
- [ ] Troisième vignette du hero : remplacer la maquette « Devis » par un vrai projet (`src/components/Hero.astro`)
