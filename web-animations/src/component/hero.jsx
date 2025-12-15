// /*
//   GSAP (GreenSock Animation Platform) — super quick primer for beginners
//   ----------------------------------------------------------------------
//   What is GSAP?
//   - A popular JavaScript animation library for animating CSS, SVG, Canvas, WebGL, and more.
//
//   Core ideas you’ll see in this file:
//   - gsap.to(targets, vars): Animate from current values TO the values you pass.
//   - gsap.from(targets, vars): Animate FROM the values you pass TO their natural/current values.
//   - gsap.timeline(): Chain multiple animations in order and control timing precisely.
//
//   Plugins used:
//   - ScrollTrigger: Connects scroll position to animations (play, scrub, pin, start/end, etc.).
//   - SplitText: Splits text into lines/words/chars so you can animate them individually.
//
//   React-specific bits:
//   - useGSAP(): A hook from @gsap/react. It’s the recommended way to create GSAP animations
//     inside React components so they run at the right time and clean up on unmount.
//   - useRef(): Lets us hold a reference to a DOM node (here, the <video>) so GSAP/JS can control it.
//   - useMediaQuery(): Detects screen size (e.g., mobile) so we can tweak animation triggers for devices.
//
//   What this component does:
//   - Splits the hero title and subtitles into characters/lines and animates them in.
//   - Creates a parallax-like motion for decorative leaves while scrolling.
//   - Ties the video’s playhead to scroll progress so the video scrubs forward/back as you scroll.
// */
//
// import React, {useRef} from 'react'
// import {useGSAP} from "@gsap/react";
// import gsap from "gsap";
// import { SplitText } from "gsap/all";
// import ScrollTrigger from "gsap/ScrollTrigger";
// import {useMediaQuery} from 'react-responsive';
//
// const Hero = () => {
//     // React hooks must be called at the top level of the component (rules of hooks)
//     const videoRef = useRef(null);
//     const isMobile = useMediaQuery({ maxWidth: 767 }); // true when viewport <= 767px
//
//     // Register GSAP plugins once inside the component
//     gsap.registerPlugin(ScrollTrigger, SplitText);
//
//     useGSAP(()=>{
//         // SplitText: break the title into characters (and words) so each char can animate
//
//         const heroSplit = new SplitText('.title',{
//             type: 'chars, words'
//         });
//
//         // Split each subtitle paragraph into lines for staggered reveal
//         const paragraphSplit = new SplitText('.subtitle',{type:'lines'})
//
//         // Add a CSS helper class to each character so it can have a gradient style
//         heroSplit.chars.forEach((char=>{
//             char.classList.add('text-gradient');
//         }))
//
//         // Animate characters of the title FROM 100% below (yPercent: 100) up to their natural position
//         // - duration: how long the animation lasts
//         // - ease: the easing curve (expo.out = fast then gentle)
//         // - stagger: small delay between each char so they appear in sequence
//         gsap.from(heroSplit.chars, {
//             yPercent:100,
//             duration:1,
//             ease:'expo.out',
//             stagger:0.05
//         })
//         // Animate subtitle lines from invisible/low position to visible
//         gsap.from (paragraphSplit.lines,{
//             opacity:0,
//             yPercent:100,
//             duration:1.8,
//             ease:'expo.out',
//             stagger:0.05,
//             delay:1
//         })
//
//         // Create a timeline that is controlled by ScrollTrigger (scrub ties progress to scroll)
//         // Here, when the user scrolls through the #hero section, the leaves slide in opposite directions
//         gsap.timeline({
//             scrollTrigger:{
//                 trigger:'#hero',
//                 start: 'top top',
//                 end: 'bottom top',
//                 scrub:true
//             }
//         }).to('.right-leaf', {y:200},0)
//             .to('.left-leaf',{y:-200},0)
//
//         // Scroll-controlled video playhead (scrubbing a <video> with scroll)
//         // We select slightly different start/end points for mobile vs desktop to improve feel
//         const startValue = isMobile ? 'top 60%' : 'center 60%';
//         const endValue  = isMobile ? '120% top' : 'bottom top';
//
//         const videoEl = videoRef.current;
//         if (videoEl) {
//             // We must ensure the browser knows the video duration before mapping scroll to time
//             const setupScrollVideo = () => {
//                 const duration = isFinite(videoEl.duration) ? videoEl.duration : 0;
//                 // If duration is unknown (e.g., metadata not loaded yet), do nothing for now
//                 if (!duration || duration === Infinity || Number.isNaN(duration)) return; // wait for metadata if needed
//
//                 // Hot-reload safety: kill any previous ScrollTrigger we created with the same id
//                 ScrollTrigger.getAll().forEach(st => {
//                     if (st.vars && st.vars.id === 'hero-video-st') st.kill();
//                 });
//
//                 // Flag + tween to support automatic playback when the user doesn't scroll
//                 // We advance the video's currentTime linearly over its full duration.
//                 let autoplayTween = null;
//                 let autoplayActive = false;
//
//                 const startAutoplayIfIdle = () => {
//                     // If already started, do nothing
//                     if (autoplayActive) return;
//                     autoplayActive = true;
//                     const proxy = { p: 0 };
//                     autoplayTween = gsap.to(proxy, {
//                         p: 1,
//                         duration: duration,
//                         ease: 'none',
//                         onUpdate: () => {
//                             videoEl.currentTime = proxy.p * duration;
//                         },
//                     });
//
//                     // Cancel autoplay on first user interaction (scroll/touch/wheel)
//                     const cancel = () => {
//                         if (autoplayTween) {
//                             autoplayTween.kill();
//                             autoplayTween = null;
//                         }
//                         autoplayActive = false;
//                     };
//                     window.addEventListener('scroll', cancel, { once: true, passive: true });
//                     window.addEventListener('wheel', cancel, { once: true, passive: true });
//                     window.addEventListener('touchstart', cancel, { once: true, passive: true });
//                 };
//
//                 // Create a ScrollTrigger that maps scroll progress (0..1) to video.currentTime (0..duration)
//                 ScrollTrigger.create({
//                     id: 'hero-video-st',
//                     trigger: '#hero',
//                     start: startValue,
//                     end: endValue,
//                     scrub: true,
//                     onUpdate: (self) => {
//                         // Map scroll progress to video time
//                         const t = self.progress * duration;
//                         // If auto-playing (idle), we still allow scroll to take over and set time.
//                         // Only update if the difference is big enough to avoid unnecessary writes
//                         if (Math.abs(videoEl.currentTime - t) > 0.03) {
//                             videoEl.currentTime = t;
//                         }
//                     },
//                 });
//
//                 // Start idle autoplay so the animation progresses even without scroll
//                 startAutoplayIfIdle();
//             };
//
//             // If metadata is ready now, set up immediately; otherwise, wait for 'loadedmetadata'
//             if (videoEl.readyState >= 1) {
//                 setupScrollVideo();
//             } else {
//                 const onMeta = () => {
//                     setupScrollVideo();
//                 };
//                 videoEl.addEventListener('loadedmetadata', onMeta, { once: true });
//             }
//         }
//     },[])
//     return (
//         <>
//             <section id={'hero'} className={'noisy'}>
//                 {/* The main title to animate. SplitText will break it into characters/words for animation. */}
//                 <h1 className={'title'}>MOJITO</h1>
//                 {/* Decorative leaves that slide in opposite directions on scroll for a parallax feel */}
//                 <img src={'/images/hero-left-leaf.png'} className={'left-leaf'} alt={'left leaf'}/>
//                 <img src={'/images/hero-right-leaf.png'} className={'right-leaf'} alt={'right leaf'}/>
//                 <div className={'body'}>
//                     <div className={'content'}>
//                         <div className={'space-y-5 mt-[20px] hidden md:block'}>
//                             <p>Cool.  Crisp. & Classic</p>
//                             <p className={'subtitle'}>Sip the Spirit <br/></p>
//                         </div>
//                         <div className={'view-cocktails'}>
//                             {/* Each .subtitle paragraph gets split into lines and animated in */}
//                             <p className={'subtitle'}>
//                                 Every Cocktail on our menu is a blend of premium ingredients, creative flair, and timeless recipes - designed to delight your sense
//
//                             </p>
//                             <a href={'#cocktails'}>View Cocktails</a>
//                         </div>
//                     </div>
//                 </div>
//
//             </section>
//             <div className={'video absolute inset-0'}>
//                 {/*
//                   The video is muted and inline so it can autoplay on mobile devices.
//                   We don’t actually "play" it; instead, we set currentTime based on scroll.
//                 */}
//                 <video ref={videoRef} src={'/videos/input.mp4'} muted playsInline preload={'auto'} />
//             </div>
//         </>
//     )
// }
// export default Hero

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const Hero = () => {
    const videoRef = useRef();

    const isMobile = useMediaQuery({ maxWidth: 767 });

    useGSAP(() => {
        const heroSplit = new SplitText(".title", {
            type: "chars, words",
        });

        const paragraphSplit = new SplitText(".subtitle", {
            type: "lines",
        });

        // Apply text-gradient class once before animating
        heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

        gsap.from(heroSplit.chars, {
            yPercent: 100,
            duration: 1.8,
            ease: "expo.out",
            stagger: 0.06,
        });

        gsap.from(paragraphSplit.lines, {
            opacity: 0,
            yPercent: 100,
            duration: 1.8,
            ease: "expo.out",
            stagger: 0.06,
            delay: 1,
        });

        gsap
            .timeline({
                scrollTrigger: {
                    trigger: "#hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            })
            .to(".right-leaf", { y: 300 }, 0)
            .to(".left-leaf", { y: -200 }, 0)
            .to(".arrow", { y: 100 },0 );

        const startValue = isMobile ? "top 50%" : "center 60%";
        const endValue = isMobile ? "120% top" : "bottom top";

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: "video",
                start: startValue,
                end: endValue,
                scrub: true,
                pin: true,
            },
        });

        videoRef.current.onloadedmetadata = () => {
            tl.to(videoRef.current, {
                currentTime: videoRef.current.duration,
            });
        };
    }, []);

    return (
        <>
            <section id="hero" className="noisy">
                <h1 className="title">MOJITO</h1>

                <img
                    src="/images/hero-left-leaf.png"
                    alt="left-leaf"
                    className="left-leaf"
                />
                <img
                    src="/images/hero-right-leaf.png"
                    alt="right-leaf"
                    className="right-leaf"
                />

                <div className="body">
                     <img src="/images/arrow.png" alt="arrow" className="arrow" />

                    <div className="content">
                        <div className="space-y-5 hidden md:block">
                            <p>Cool. Crisp. Classic.</p>
                            <p className="subtitle">
                                Sip the Spirit <br /> of Summer
                            </p>
                        </div>

                        <div className="view-cocktails">
                            <p className="subtitle">
                                Every cocktail on our menu is a blend of premium ingredients,
                                creative flair, and timeless recipes — designed to delight your
                                senses.
                            </p>
                            <a href="#cocktails">View cocktails</a>
                        </div>
                    </div>
                </div>
            </section>

            <div className="video absolute inset-0">
                <video
                    ref={videoRef}
                    muted
                    playsInline
                    preload="auto"
                    src="/videos/output.mp4"
                />
            </div>
        </>
    );
};

export default Hero;