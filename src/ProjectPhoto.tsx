import type { ProjectPhotoData } from "./projectPhotos";

/**
 * Description: Frames job photographs consistently while keeping each subject in view.
 * Inputs: photo supplies the shared service description and dimensions; city is the service area's display name, not the photographed job location; priority loads a hero eagerly; fullFrame retains all content after optional edge trim.
 * Output: A responsive image with service-specific alt text, an optional city suffix and a stable layout box. The shared photo record stays unchanged.
 * Examples: A Bellevue service image appends " in Bellevue"; a general service image keeps its base text. ProjectPhotos.test.tsx checks every city-service image and general-page image.
 */
export default function ProjectPhoto({ photo, city, className = "", priority = false, fullFrame = false }: {
  photo: ProjectPhotoData;
  city?: string;
  className?: string;
  priority?: boolean;
  fullFrame?: boolean;
}) {
  const portrait = photo.height > photo.width * 1.15;
  const contentWidth = photo.width - (photo.trimLeft ?? 0);
  return (
    <div className={`project-photo${portrait ? " project-photo--portrait" : ""} ${className}`} style={{
      aspectRatio: fullFrame ? `${contentWidth} / ${photo.height}` : photo.frameRatio,
      maxHeight: fullFrame ? "none" : undefined,
    }}>
      <img
        src={photo.src}
        alt={city ? `${photo.alt} in ${city}` : photo.alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{
          objectPosition: photo.position,
          left: photo.trimLeft ? `${-photo.trimLeft / contentWidth * 100}%` : undefined,
          width: photo.trimLeft ? `${photo.width / contentWidth * 100}%` : undefined,
        }}
      />
    </div>
  );
}
