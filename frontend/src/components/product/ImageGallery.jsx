import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import { mediaUrl } from "../../api/client";

const SWIPE_THRESHOLD = 50;

export default function ImageGallery({ images }) {
  const { t } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const scrollY = window.scrollY;
    const { body } = document;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [lightboxIndex]);

  if (!images || images.length === 0) return null;

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function goTo(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    setLightboxIndex(index);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD || images.length <= 1) return;
    goTo(lightboxIndex + (deltaX < 0 ? 1 : -1));
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setLightboxIndex(i)}
            className="group relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 hover:border-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <img
              src={mediaUrl(img.image)}
              alt={img.alt_text || t("detail.productImage")}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <i
                className="fas fa-expand text-white opacity-0 group-hover:opacity-80 transition-opacity text-lg drop-shadow"
                aria-hidden="true"
              />
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white ring-1 ring-white/30 shadow-lg transition-colors"
              aria-label={t("detail.close")}
            >
              <i className="fas fa-xmark text-xl" aria-hidden="true" />
            </button>

            <motion.img
              key={lightboxIndex}
              src={mediaUrl(images[lightboxIndex].image)}
              alt={images[lightboxIndex].alt_text || t("detail.productImage")}
              className="max-w-full max-h-[75vh] rounded-lg object-contain select-none touch-pan-y"
              draggable={false}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            />

            <div className="flex items-center gap-4">
              {images.length > 1 && (
                <button
                  onClick={() => goTo(lightboxIndex - 1)}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white ring-1 ring-white/30 shadow-lg transition-colors"
                  aria-label={t("detail.prevImage")}
                >
                  <i className="fas fa-chevron-left" aria-hidden="true" />
                </button>
              )}

              <div className="text-white/80 text-sm tabular-nums min-w-[3rem] text-center">
                {lightboxIndex + 1} / {images.length}
              </div>

              {images.length > 1 && (
                <button
                  onClick={() => goTo(lightboxIndex + 1)}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white ring-1 ring-white/30 shadow-lg transition-colors"
                  aria-label={t("detail.nextImage")}
                >
                  <i className="fas fa-chevron-right" aria-hidden="true" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
