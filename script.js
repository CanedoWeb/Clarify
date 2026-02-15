document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.divPai',
            start: 'top top',
            end: '+=500',
            scrub: 1.5,
            pin: true
        }
    });

    tl.to('.divGradient', {
        opacity: 0,
    })
        .to('.divGradient2', {
            opacity: 1,
        }, '<');
});
