"use client";

import { useEffect, useState } from "react";
import type { PublicLocation } from "@/lib/commerce-types";
import { createUnitWhatsAppUrl } from "@/lib/whatsapp";

export function LocationsDirectory() {
  const [locations, setLocations] = useState<PublicLocation[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetch("/api/locations")
        .then(async (response) => (await response.json()) as { locations?: PublicLocation[] })
        .then((body) => setLocations(body.locations ?? []))
        .catch(() => setLocations([]));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  if (!locations.length) return <div className="unit-directory-loading">Carregando endereços...</div>;
  return <div className="container unit-list">{locations.map((location, index) => <article className="unit-feature" id={location.slug} key={location.id}><div className="unit-image"><img src={location.imageUrl} alt={`Fachada ou ambiente da unidade ${location.name}`} width="840" height="610" /><span>0{index + 1}</span></div><div className="unit-copy"><p className="eyebrow">{location.subtitle}</p><h2>{location.name}</h2><div className="unit-meta"><div><small>Endereço</small><address>{location.address}</address></div><div><small>Horário</small><p>{location.hours}</p></div><div><small>Contato</small><a href={`tel:+${location.whatsapp}`}>{location.contact}</a></div></div><div className="button-row"><a className="button" href={location.mapsUrl} target="_blank" rel="noreferrer">Abrir no mapa <span aria-hidden="true">↗</span></a><a className="text-link" href={createUnitWhatsAppUrl(location.whatsapp, `Olá! Gostaria de falar sobre a unidade ${location.name}.`)} target="_blank" rel="noreferrer">Falar com a unidade →</a></div></div></article>)}</div>;
}
