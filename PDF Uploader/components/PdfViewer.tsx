'use client';

import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface PdfViewerProps {
    fileURL: string;
    title: string;
    open: boolean;
    onClose: () => void;
}

const PdfViewer = ({ fileURL, title, open, onClose }: PdfViewerProps) => {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
            onClick={onClose}
        >
            <div
                className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-4 border-b border-[rgba(33,42,59,0.1)] px-5 py-3">
                    <h3 className="truncate font-serif text-lg font-bold text-[#212a3b]">{title}</h3>
                    <div className="flex items-center gap-3">
                        <a
                            href={fileURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm font-medium text-[#3d485e] hover:text-[#212a3b]"
                        >
                            <ExternalLink className="size-4" />
                            Open in new tab
                        </a>
                        <button
                            onClick={onClose}
                            className="flex size-9 items-center justify-center rounded-lg text-[#212a3b] hover:bg-[#212a3b]/10"
                            aria-label="Close document viewer"
                        >
                            <X className="size-5" />
                        </button>
                    </div>
                </div>

                <iframe src={fileURL} title={title} className="w-full flex-1 border-0" />
            </div>
        </div>
    );
};

export default PdfViewer;
