"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MealPlanRenderer({ content }: { content: string }) {
    return (
        <div className="prose prose-slate prose-headings:text-slate-900 prose-a:text-emerald-600 hover:prose-a:text-emerald-500 max-w-none bg-white p-6 rounded-2xl border border-slate-100 shadow-sm whitespace-pre-wrap text-[15px] leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
