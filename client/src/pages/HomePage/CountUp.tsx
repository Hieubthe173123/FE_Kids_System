import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface CountUpProps {
    to: number;
    from?: number;
    direction?: "up" | "down";
    delay?: number;
    duration?: number;
    className?: string;
    startWhen?: boolean;
    separator?: string;
    onStart?: () => void;
    onEnd?: () => void;
}

export default function CountUp({
    to,
    from = 0,
    direction = "up",
    delay = 0,
    duration = 2,
    className = "",
    startWhen = true,
    separator = ".",
    onStart,
    onEnd,
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === "down" ? to : from);

    const springValue = useSpring(motionValue, {
        mass: 1,
        stiffness: 100,
        damping: 20,
    });

    const isInView = useInView(ref, { once: true, margin: "0px" });

    useEffect(() => {
        if (isInView && startWhen) {
            if (typeof onStart === "function") onStart();

            const timeoutId = setTimeout(() => {
                motionValue.set(direction === "down" ? from : to);
            }, delay * 1000);

            const durationTimeoutId = setTimeout(() => {
                if (typeof onEnd === "function") onEnd();
            }, delay * 1000 + duration * 1000);

            return () => {
                clearTimeout(timeoutId);
                clearTimeout(durationTimeoutId);
            };
        }
    }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            if (ref.current) {
                const formatted = new Intl.NumberFormat('de-DE', {
                    minimumFractionDigits: 0,
                    useGrouping: true,
                }).format(Math.round(latest));

                ref.current.textContent = formatted;
            }
        });

        return () => unsubscribe();
    }, [springValue]);

    return <span className={className} ref={ref} />;
}
