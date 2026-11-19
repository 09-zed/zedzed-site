import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Un projet = un fichier .md dans src/content/projets/.
// Pour en ajouter un : copier un fichier existant, changer les champs, déposer l'image dans public/img/.
const projets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projets' }),
  schema: z.object({
    nom: z.string(),
    secteur: z.string(),
    image: z.string(),          // chemin dans public/, ex. /img/proj-coverlys-mockup.webp — prévoir aussi les versions -640, -1000 et -1400.webp
    alt: z.string(),
    largeur: z.number(),
    hauteur: z.number(),
    lien: z.string().url().optional(),   // site en ligne, si on veut rendre la carte cliquable
    vignetteHero: z.string().optional(), // petite image du hero, si le projet y apparaît
    ordre: z.number(),
  }),
});

export const collections = { projets };
