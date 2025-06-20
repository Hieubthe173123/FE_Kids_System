import { useEffect, useCallback, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Petal {
    x: number;
    y: number;
    size: number;
    speedY: number;
    speedX: number;
    rotation: number;
    rotationSpeed: number;
    character: string;
    opacity: number;
}

interface CanvasSize {
    width: number;
    height: number;
}

export const FallingPetalsJS = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const petalsArray = useRef<Petal[]>([]);
    const animationFrameId = useRef<number | null>(null);
    const petalEmojis: string[] = ["🌸", "💮", "💖"];

    const createPetal = (canvas: CanvasSize): Petal => {
        const size = Math.random() * 10 + 8;
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height * 0.5,
            size,
            speedY: Math.random() * 0.5 + 0.5,
            speedX: Math.random() * 0.5 - 0.25,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 2 - 1,
            character: petalEmojis[Math.floor(Math.random() * petalEmojis.length)],
            opacity: Math.random() * 0.5 + 0.5,
        };
    };

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const currentWidth = canvas.offsetWidth;
        const currentHeight = canvas.offsetHeight;

        if (currentWidth > 0 && currentHeight > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petalsArray.current.forEach((petal, index) => {
                petal.y += petal.speedY;
                petal.x += petal.speedX;
                petal.rotation += petal.rotationSpeed;

                ctx.save();
                ctx.translate(
                    petal.x * (canvas.width / currentWidth),
                    petal.y * (canvas.height / currentHeight) + petal.size / 2
                );
                ctx.rotate((petal.rotation * Math.PI) / 180);
                ctx.globalAlpha = petal.opacity;
                ctx.font = `${petal.size}px Arial`;
                ctx.fillText(petal.character, -petal.size / 2, petal.size / 2);
                ctx.restore();

                if (petal.y * (canvas.height / currentHeight) > currentHeight + petal.size) {
                    petalsArray.current[index] = createPetal({ width: currentWidth, height: currentHeight });
                    petalsArray.current[index].y = -petal.size - Math.random() * 20;
                }

                const ratioX = canvas.width / currentWidth;

                if (petal.x * ratioX > currentWidth + petal.size)
                    petal.x = -petal.size / ratioX;

                if (petal.x * ratioX < -petal.size)
                    petal.x = (currentWidth + petal.size) / ratioX;
            });
        }

        animationFrameId.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const setCanvasDimensions = () => {
            const dpr = window.devicePixelRatio || 1;
            const newWidth = canvas.offsetWidth;
            const newHeight = canvas.offsetHeight;

            if (canvas.width !== newWidth * dpr || canvas.height !== newHeight * dpr) {
                canvas.width = newWidth * dpr;
                canvas.height = newHeight * dpr;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.scale(dpr, dpr);
                }
            }

            if (petalsArray.current.length === 0 && newWidth > 0 && newHeight > 0) {
                const numberOfPetals = 25;
                for (let i = 0; i < numberOfPetals; i++) {
                    petalsArray.current.push(createPetal({ width: newWidth, height: newHeight }));
                }
            }
        };

        const startAnimation = () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            animationFrameId.current = requestAnimationFrame(animate);
        };

        setCanvasDimensions();
        const timer = setTimeout(startAnimation, 100);

        window.addEventListener('resize', setCanvasDimensions);

        return () => {
            window.removeEventListener('resize', setCanvasDimensions);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            clearTimeout(timer);
        };
    }, [animate]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
        />
    );
};
