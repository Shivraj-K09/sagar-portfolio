export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Sagar Kadgond",
      alternateName: "SK",
      description: "Professional video editor specializing in narrative-driven editing and visual storytelling",
      image: "https://sagarcuts.vercel.app/editor-portrait.jpg",
      sameAs: [
        "https://www.instagram.com/samundar.mai/",
        "https://x.com/samundarmai",
        "http://www.linkedin.com/in/sagarkadgond",
      ],
      jobTitle: "Video Editor",
      worksFor: {
        "@type": "Organization",
        name: "Freelance",
      },
      knowsAbout: [
        "Video Editing",
        "Post-Production",
        "Visual Storytelling",
        "Cinematic Techniques",
        "Color Grading",
        "Sound Design",
      ],
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://sagarcuts.vercel.app",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
