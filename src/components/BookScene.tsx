import { useRef, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import { Book } from '../types/book';
import bookImg from '../assets/book1.png';
import knifeImg from '../assets/knife1.png';
import knifeStuckImg from '../assets/knife1_stuck.png';
import blood1Img from '../assets/blood1.png';
import blood2Img from '../assets/blood2.png';

/**
 * Returns a CSS font-size value that roughly fills the book width.
 * Longer titles receive a smaller size so multi-line wrapping stays contained.
 */
function getTitleFontSize(title: string): string {
  const len = title.length;
  if (len <=  6) return 'clamp(4rem,   11vw, 6.5rem)';
  if (len <= 10) return 'clamp(3.2rem,  9vw, 5.2rem)';
  if (len <= 15) return 'clamp(2.6rem,  7vw, 4rem)';
  if (len <= 21) return 'clamp(2rem,    5.5vw, 3rem)';
  if (len <= 28) return 'clamp(1.6rem,  4.4vw, 2.4rem)';
  if (len <= 36) return 'clamp(1.25rem, 3.5vw, 1.9rem)';
  return                 'clamp(1rem,    2.9vw, 1.55rem)';
}

interface BookSceneProps {
  book: Book | null;
  onAnimationComplete?: () => void;
}

export interface BookSceneHandle {
  playAnimation: () => void;
}

const BookScene = forwardRef<BookSceneHandle, BookSceneProps>(
  ({ book, onAnimationComplete }, ref) => {
    const bookRef = useRef<HTMLDivElement>(null);
    const knifeRef      = useRef<HTMLImageElement>(null);
    const knifeStuckRef = useRef<HTMLImageElement>(null);
    const splashRef     = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const authorRef = useRef<HTMLDivElement>(null);

    const knifeTimeline = useRef<gsap.core.Timeline | null>(null);
    // Stores the off-screen GSAP x/y so the exit animation can reuse them
    const offscreenX = useRef(0);
    const offscreenY = useRef(0);
    // CSS base rect of the knife (GSAP x=0/y=0) – needed for correct target maths
    const knifeCssRect = useRef<DOMRect | null>(null);

    const resetScene = () => {
      if (knifeRef.current) {
        // 1. Clear any previous GSAP transforms to get the real CSS rect
        gsap.set(knifeRef.current, { x: 0, y: 0, rotation: 0 });
        // 2. Save the CSS-origin rect BEFORE applying the off-screen offset
        knifeCssRect.current = knifeRef.current.getBoundingClientRect();
        // 3. Compute how far to move so the whole knife is off the top-right
        //    of the viewport, regardless of scale / window size.
        const knifeRect = knifeCssRect.current;
        const offX =  window.innerWidth  - knifeRect.left + knifeRect.width  + 40;
        const offY = -(knifeRect.bottom  + 40);
        offscreenX.current = offX;
        offscreenY.current = offY;
        gsap.set(knifeRef.current, { x: offX, y: offY, rotation: -25, opacity: 1 });
      }
      if (knifeStuckRef.current) {
        gsap.set(knifeStuckRef.current, { opacity: 0 });
      }
      if (splashRef.current) {
        gsap.set(splashRef.current, {
          scale: 0,
          opacity: 0,
        });
      }
      if (particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll('div');
        gsap.set(particles, {
          x: 0,
          y: 0,
          opacity: 0,
        });
      }
      if (titleRef.current) {
        gsap.set(titleRef.current, {
          opacity: 0,
          scale: 0.85,
        });
      }
      if (authorRef.current) {
        gsap.set(authorRef.current, {
          opacity: 0,
          scale: 0.85,
        });
      }
    };

    const playAnimation = () => {
      if (!bookRef.current || !knifeRef.current || !splashRef.current) {
        return;
      }

      resetScene();

      const timeline = gsap.timeline({
        onComplete: () => {
          onAnimationComplete?.();
        },
      });

      // Target: derive landing point from the knife_stuck element.
      // Use the CSS-origin rect (x=0/y=0) saved in resetScene so that targetX/Y
      // are correct absolute GSAP values – NOT deltas from the off-screen position.
      const cssRect   = knifeCssRect.current!;
      const stuckRect = knifeStuckRef.current!.getBoundingClientRect();

      // Blade entry = horizontal centre / bottom edge of the stuck image
      const targetCenterX = stuckRect.left + stuckRect.width  * 0.50;
      const targetCenterY = stuckRect.bottom;

      // Tip position in CSS-origin space (~20 % from left, ~85 % from top)
      const knifeTipX = cssRect.left + cssRect.width  * 0.20;
      const knifeTipY = cssRect.top  + cssRect.height * 0.85;

      // Absolute GSAP x/y that place the tip exactly at the target
      const targetX = targetCenterX - knifeTipX;
      const targetY = targetCenterY - knifeTipY;

      // Step 1: Knife flies diagonally into the book (0.45s)
      timeline.to(
        knifeRef.current,
        {
          x: targetX,
          y: targetY,
          rotation: 15,
          duration: 0.45,
          ease: 'power1.inOut',
        },
        0
      );

      // At impact: swap to stuck image so knife appears embedded
      timeline.set(knifeRef.current,      { opacity: 0 }, 0.46);
      timeline.set(knifeStuckRef.current, { opacity: 1 }, 0.46);

      // Step 2: Book shake effect (slight)
      timeline.to(
        bookRef.current,
        {
          x: -2,
          duration: 0.1,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 3,
        },
        0.3
      );

      // Step 3: Splash appears (scale and opacity)
      timeline.to(
        splashRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 0.2,
        },
        0.4
      );

      // Step 4: Particles fly out
      if (particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll('div');
        const particlesArray = Array.from(particles);

        particlesArray.forEach((particle, index) => {
          const angle = (index / particlesArray.length) * Math.PI * 2;
          const distance = 40 + Math.random() * 30;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;

          timeline.to(
            particle,
            {
              x,
              y,
              opacity: 0,
              duration: 0.6,
              ease: 'power2.out',
            },
            0.4
          );
        });
      }

      // Step 5: Title and author appear with jitter effect
      if (titleRef.current) {
        timeline.to(
          titleRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: 'back.out',
          },
          0.5
        );

        // Small jitter effect
        timeline.to(
          titleRef.current,
          {
            x: -1,
            duration: 0.05,
            ease: 'none',
            yoyo: true,
            repeat: 3,
          },
          0.6
        );
      }

      if (authorRef.current) {
        timeline.to(
          authorRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: 'back.out',
          },
          0.55
        );

        timeline.to(
          authorRef.current,
          {
            x: -1,
            duration: 0.05,
            ease: 'none',
            yoyo: true,
            repeat: 3,
          },
          0.65
        );
      }

      // Before exit: swap back to flying knife, hide stuck image
      timeline.set(knifeStuckRef.current, { opacity: 0 }, 0.93);
      timeline.set(knifeRef.current,      { opacity: 1 }, 0.93);

      // Knife yanked back off-screen (same direction it came from)
      timeline.to(
        knifeRef.current,
        {
          x: offscreenX.current,
          y: offscreenY.current,
          rotation: -25,
          duration: 0.38,
          ease: 'power3.in',
        },
        0.95
      );

      knifeTimeline.current = timeline;
    };

    useImperativeHandle(ref, () => ({
      playAnimation,
    }));

    return (
      <div className="book-scene-container">
        {/* book-wrapper is the shake target and positioning anchor */}
        <div ref={bookRef} className="book-wrapper">

          {/* Book PNG – defines the layout size */}
          <img src={bookImg} className="book-image" alt="Aufgeschlagenes Buch" />

          {/* Flying knife – visible during entry and exit */}
          <img
            ref={knifeRef}
            src={knifeImg}
            className="knife-image"
            alt=""
            aria-hidden="true"
          />

          {/* Stuck knife – shown while embedded in book */}
          <img
            ref={knifeStuckRef}
            src={knifeStuckImg}
            className="knife-stuck-image"
            alt=""
            aria-hidden="true"
          />

          {/* Blood splash – PNG assets, hidden until animation */}
          <div ref={splashRef} className="splash">
            <img src={blood1Img} className="blood-layer blood-layer--1" alt="" aria-hidden="true" />
            <img src={blood2Img} className="blood-layer blood-layer--2" alt="" aria-hidden="true" />
          </div>

          {/* Title overlay – font-size is set dynamically via inline style */}
          <div
            ref={titleRef}
            className="book-content book-title"
            role="status"
            aria-live="polite"
            style={{ fontSize: getTitleFontSize(book?.title ?? '') }}
          >
            {book?.title}
          </div>

          {/* Author overlay */}
          <div ref={authorRef} className="book-content book-author">
            {book?.author}
          </div>

          {/* Pixel particles */}
          <div ref={particlesRef} className="particles-anchor">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="particle" />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

BookScene.displayName = 'BookScene';

export default BookScene;
