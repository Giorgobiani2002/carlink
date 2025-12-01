import { GlobeConfig } from "../components/ui/globe";

export const globeConfig: GlobeConfig = {
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    globeColor: "#1d072e",
    showAtmosphere: true,
    atmosphereColor: "#ffffff",
    atmosphereAltitude: 0.1,
    emissive: "#1d072e",           // Add this - should match globeColor
    emissiveIntensity: 0.1,        // Add this
    shininess: 0.9,                // Add this
    polygonColor: "rgba(255,255,255,0.7)",  // Add this
    autoRotate: true,
    autoRotateSpeed: 0.5,
    pointSize: 1,                  // Add this
    arcTime: 2000,                 // Add this
    arcLength: 0.9,                // Add this
    rings: 1,                      // Add this
    maxRings: 3,                   // Add this
};