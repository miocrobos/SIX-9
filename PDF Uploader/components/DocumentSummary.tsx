'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getOrCreateBookSummary } from '@/lib/actions/book.actions';

const DocumentSummary = ({ bookId }: { bookId: string }) => {
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let active = true;

        (async () => {
            setLoading(true);
            setFailed(false);

            const res = await getOrCreateBookSummary(bookId);
            if (!active) return;

            if (res.success && res.data) {
                setSummary(res.data);
            } else {
                setFailed(true);
            }

            setLoading(false);
        })();

        return () => {
            active = false;
        };
    }, [bookId]);

    // Hide the card entirely if we couldn't produce a summary
    if (failed && !loading) return null;

    return (
        <div className="rounded-2xl border border-[rgba(33,42,59,0.1)] bg-white/70 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="size-4 text-[#212a3b]" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[#212a3b]">AI Summary</h2>
            </div>

            {loading ? (
                <div className="space-y-2 animate-pulse">
                    <div className="h-3 w-full rounded bg-[#212a3b]/10" />
                    <div className="h-3 w-11/12 rounded bg-[#212a3b]/10" />
                    <div className="h-3 w-3/4 rounded bg-[#212a3b]/10" />
                </div>
            ) : (
                <p className="text-[#3d485e] leading-relaxed">{summary}</p>
            )}
        </div>
    );
};

export default DocumentSummary;
