import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type ImageLightboxProps = { images: string[]; initialIndex: number; alt: string; onClose: () => void };

export function ImageLightbox({ images, initialIndex, alt, onClose }: ImageLightboxProps) {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [zoom, setZoom] = useState(1);
    const src = images[activeIndex];
    const changeZoom = (amount: number) => setZoom((current) => Math.min(3, Math.max(0.5, Number((current + amount).toFixed(1)))));
    const changeImage = (direction: number) => setActiveIndex((current) => (current + direction + images.length) % images.length);

    useEffect(() => {
        setZoom(1);
    }, [src]);

    useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'ArrowLeft') changeImage(-1);
            if (event.key === 'ArrowRight') changeImage(1);
        };

        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [onClose, images.length]);

    return (
        <div role="dialog" aria-modal="true" aria-label="Gallery image preview" onClick={onClose} className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-4 backdrop-blur-sm">
            <button type="button" onClick={onClose} aria-label="Close image preview" className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <X className="size-6" />
            </button>
            {images.length > 1 && <>
                <button type="button" onClick={(event) => { event.stopPropagation(); changeImage(-1); }} aria-label="Previous image" className="absolute left-4 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-7"><ChevronLeft className="size-7" /></button>
                <button type="button" onClick={(event) => { event.stopPropagation(); changeImage(1); }} aria-label="Next image" className="absolute right-4 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-7"><ChevronRight className="size-7" /></button>
            </>}
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/65 p-1 text-white shadow-lg" onClick={(event) => event.stopPropagation()}>
                <button type="button" onClick={() => changeZoom(-0.25)} aria-label="Zoom out" className="grid size-10 place-items-center rounded-full transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"><Minus className="size-5" /></button>
                <button type="button" onClick={() => setZoom(1)} aria-label="Reset zoom" className="min-w-16 rounded-full px-2 py-2 text-xs tabular-nums transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"><RotateCcw className="mr-1 inline size-3.5" />{Math.round(zoom * 100)}%</button>
                <button type="button" onClick={() => changeZoom(0.25)} aria-label="Zoom in" className="grid size-10 place-items-center rounded-full transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"><Plus className="size-5" /></button>
            </div>
            <div className="max-h-[90vh] max-w-full overflow-auto" onClick={(event) => event.stopPropagation()} onWheel={(event) => { event.preventDefault(); changeZoom(event.deltaY < 0 ? 0.1 : -0.1); }}>
                <img src={src} alt={alt} className="max-h-[90vh] max-w-full origin-center object-contain shadow-2xl transition-transform duration-150" style={{ transform: `scale(${zoom})` }} />
            </div>
            {images.length > 1 && <p className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">{activeIndex + 1} / {images.length}</p>}
        </div>
    );
}
