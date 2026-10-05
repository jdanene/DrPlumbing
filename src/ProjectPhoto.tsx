import type { ProjectPhotoData } from "./projectPhotos";

/**
 * Description: Frames job photographs consistently while keeping each subject in view.
 * Inputs: photo includes source dimensions, a focal point and optional empty-edge trim; priority loads a hero eagerly; fullFrame retains all content after that trim.
 * Output: A responsive image with descriptive alternative text and a stable layout box.
 * Examples: Portrait work uses a tall frame; landscape work uses a wide frame; hero photos load eagerly.
 */
export default function ProjectPhoto({ photo, className = "", priority = false, fullFrame = false }: {
  photo: ProjectPhotoData;
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
        alt={photo.alt}
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
