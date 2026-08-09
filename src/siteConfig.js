const whatsappMessage = "Hi Ibraheem, I'd like to book a haircut.";

export const siteConfig = {
  name: "IBRAHEEM",
  role: "Personal Barber",
  location: "Dubai, UAE",
  phoneNumber: "+971551662381",
  phoneDisplay: "+971 55 166 2381",
  whatsappNumber: "971551662381",
  instagram: "",
  about: "Focused on precision, detail and creating a look that feels individual to every client.",
  services: ["Haircut", "Fade", "Beard", "Hair + Beard"],
  images: {
    hero: "/images/ibraheem-hero.webp",
    heroVideo: "/videos/ibraheem-hero.mp4",
    portrait: "/images/ibraheem-editorial-v2.webp",
    detail: "/images/studio-detail.webp",
  },
  work: [
    { src: "/images/cut-01-fade.webp", label: "Fade", alt: "Precision low fade from the side", width: 1536, height: 2048 },
    { src: "/images/cut-02-textured.webp", label: "Textured", alt: "Textured curls with a clean taper", width: 2048, height: 1536 },
    { src: "/images/cut-03-beard.webp", label: "Beard", alt: "Close-up beard line detailing", width: 1536, height: 2048 },
    { src: "/images/cut-04-detail.webp", label: "Detail", alt: "Detailed side part styling", width: 2048, height: 1536 },
    { src: "/images/cut-05-styled.webp", label: "Styled", alt: "Refined swept-back hairstyle", width: 1536, height: 2048 },
    { src: "/images/studio-detail.webp", label: "Craft", alt: "Close-up clipper work", width: 2048, height: 1152 },
  ],
  get whatsappUrl() {
    if (!this.whatsappNumber) return "#contact";
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  },
};
