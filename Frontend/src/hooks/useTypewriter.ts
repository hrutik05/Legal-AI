import { useEffect, useMemo, useRef, useState } from "react";

type UseTypewriterOptions = {
    speed?: number; // ms per char
    enabled?: boolean;
};

export function useTypewriter(text: string, options: UseTypewriterOptions = {}) {
    const { speed = 16, enabled = true } = options;

    const [typedText, setTypedText] = useState(enabled ? "" : text);
    const [index, setIndex] = useState(enabled ? 0 : text.length);
    const timerRef = useRef<number | null>(null);

    const isTyping = useMemo(() => enabled && index < text.length, [enabled, index, text.length]);

    useEffect(() => {
        if (!enabled) {
            setTypedText(text);
            setIndex(text.length);
            return;
        }
        setTypedText("");
        setIndex(0);
    }, [text, enabled]);

    useEffect(() => {
        if (!enabled || index >= text.length) return;

        const ch = text[index];
        const delay =
            ch === " " ? Math.max(8, Math.floor(speed * 0.6)) :
                /[.,!?]/.test(ch) ? speed * 3 :
                    speed;

        timerRef.current = window.setTimeout(() => {
            setTypedText((prev) => prev + ch);
            setIndex((prev) => prev + 1);
        }, delay);

        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, [index, text, speed, enabled]);

    const skip = () => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        setTypedText(text);
        setIndex(text.length);
    };

    return { typedText, isTyping, skip };
}