import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Natubar",
    short_name: "Natubar",
    start_url: "/",
    display: "standalone",
    icons: [
      {
        src: "/icon512_rounded.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon512_maskable.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
