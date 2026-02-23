type MessagePreviewProps = {
    message: string;
    setMessage: (msg: string) => void;
};

export default function MessagePreview({ message, setMessage }: MessagePreviewProps) {
    if (!message) return null;

    return (
        <div className="card mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-1">
                <h2 className="text-xl font-bold text-green-primary">Message Preview</h2>
                <span className="text-xs sm:text-sm text-text-muted italic">Ready to share (Tap to edit)</span>
            </div>
            <div className="relative group">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-64 sm:h-80 p-4 sm:p-5 bg-bg-soft rounded-xl font-mono text-xs sm:text-sm border-none focus:ring-2 focus:ring-green-accent resize-none whitespace-pre transition-all duration-150"
                />
                <div className="absolute top-4 right-4 opacity-0 sm:group-hover:opacity-100 transition-opacity hidden sm:block">
                    <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-semibold shadow-sm">
                        WhatsApp Template
                    </span>
                </div>
            </div>
        </div>
    );
}
