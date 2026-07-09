// Curated facility imagery (freshest 2026 real-estate photography set).
const C = "/images/content/2026/02/";

export const facility = {
  heroExterior: `${C}1-web-or-mls-DJI_20260206132754_0577_D.jpg`,
  gallery: [
    { src: `${C}8-web-or-mls-DSC04989.jpg`, alt: "Bright communal dining and lounge area" },
    { src: `${C}1-web-or-mls-DSC05075.jpg`, alt: "Modern common space at Dallas Detox Center" },
    { src: `${C}2-web-or-mls-DSC05078.jpg`, alt: "Comfortable interior lounge" },
    { src: `${C}15-web-or-mls-DSC05010.jpg`, alt: "Private, restful bedroom" },
    { src: `${C}20-web-or-mls-DSC05028.jpg`, alt: "Serene treatment space" },
    { src: `${C}31-web-or-mls-DSC05061.jpg`, alt: "Relaxing amenity area" },
    { src: `${C}33-web-or-mls-DSC05067.jpg`, alt: "Outdoor grounds and greenery" },
    { src: `${C}10-web-or-mls-DSC09526.jpg`, alt: "Facility exterior among the trees" },
  ] as { src: string; alt: string }[],
};

export const heroImage = facility.heroExterior;
