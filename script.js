document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.divPai',
            start: 'top top',
            end: '+=3000',
            scrub: 2,
            pin: true
        }
    });

    tl.addLabel("inicio", 0);

    tl.to('.divGradient', {
        opacity: 0,
        duration: 10,
        ease: "none"
    }, "inicio");

    tl.to('.divGradient2', {
        opacity: 1,
        duration: 10,
        ease: "none"
    }, "inicio");

    tl.to('.tituloHero', {
        opacity: 0,
        duration: 2
    }, "inicio");

    const listaCards = document.querySelectorAll('.card')
    listaCards.forEach((card, index) => {
        tl.from(card, {
            opacity: 0,
            duration: 0.8
        }, `inicio+=${index * 2}`);

        tl.to(card, {
            opacity: 0,
            duration: 0.8
        }, `inicio+=${index * 1.2 + 0.8}`);
    })
});
