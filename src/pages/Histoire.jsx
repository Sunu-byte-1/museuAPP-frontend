import React from 'react';
import senghor from '../assets/historique/senghor.webp';
import travaux from '../assets/historique/travaux.avif';
import musee from '../assets/historique/musee.webp';
 
 /**
  * Page "Histoire"
  *
  * Présente plusieurs étapes clés du MCN à travers un tableau `sections`:
  * - Chaque entrée contient un `title`, un tableau `paragraphs` et une `image`.
  * - L'affichage alterne texte/image pour un rythme visuel agréable.
  */
const sections = [
  {
    title: "La genèse de l’idée (1966)",
    paragraphs: [
      "L’idée du musée a été initiée par Léopold Sédar Senghor, premier président du Sénégal et grand intellectuel de la négritude.",
      "Senghor voulait créer un lieu pour valoriser et faire connaître l’histoire et les cultures africaines, loin des visions coloniales, et promouvoir la richesse des civilisations noires.",
    ],
    image: senghor,
  },
  {
    title: "L’évolution du projet (1966–2000s)",
    paragraphs: [
      "Plusieurs tentatives ont été faites pour concrétiser l’idée, mais des contraintes financières et politiques ont retardé la réalisation.",
      "Le projet a été repensé à plusieurs reprises, notamment dans le cadre d’une coopération avec la Chine pour le financement et la construction.",
    ],
    image: travaux,
  },
  {
    title: "Construction, architecture et inauguration (2010s–2018)",
    paragraphs: [
      "Le projet a réellement démarré au début des années 2010.",
      "L’architecte Pierre Goudiaby Atepa a conçu un bâtiment moderne inspiré des cases à impluvium traditionnelles de Casamance.",
      "Le musée occupe environ 15 000 m² sur quatre niveaux, avec des espaces pour expositions permanentes et temporaires.",
      "Le 6 décembre 2018, le musée a été officiellement inauguré et les clés remises aux autorités sénégalaises.",
      "C’était la concrétisation d’un rêve vieux de 50 ans, symbolisant la valorisation du patrimoine africain et la réappropriation de l’histoire des civilisations noires.",
      "En résumé, de la pensée de Senghor à la remise des clés, le MCN est le fruit d’un long chemin intellectuel et politique visant à créer un lieu d’affirmation culturelle africaine et de mémoire historique.",
    ],
    image: musee,
  },
];

export default function Histoire() {
  return (
    
    <div className="min-h-screen bg-[#f5f4ef]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-black font-serif">Histoire du MCN</h1>
          <p className="text-gray-800 dark:text-gray-300 mt-3">De l’idée de Senghor à l’inauguration</p>
        </div>

        <div className="space-y-16">
          {/*
            Pour chaque section, on alterne l'ordre des colonnes en fonction de l'index:
            - idx pair (0, 2, ...): texte à gauche, image à droite
            - idx impair (1, 3, ...): image à gauche, texte à droite (via classes order)
          */}
          {sections.map((s, idx) => (
            <div key={s.title} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Force: row 1 and 3 => text left, image right; row 2 => image left, text right */}
              <div className={`${idx === 1 ? 'md:order-2' : 'md:order-1'}`}>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900  mb-4">{s.title}</h2>
                <div className="space-y-4">
                  {s.paragraphs.map((p, i) => (
                    <p key={i} className="text-gray-700  leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>
              <div className={`${idx === 1 ? 'md:order-1' : 'md:order-2'}`}>
                <div className="relative group">
              <img src={s.image} alt={s.title} loading="lazy" decoding="async" sizes="(max-width: 768px) 100vw, 50vw" className="w-full h-72 md:h-96 object-cover rounded-2xl shadow-soft" />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 dark:ring-white/10"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



