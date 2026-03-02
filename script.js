/*if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
    ScrollTrigger.refresh(true);
    setTimeout(() => window.scrollTo(0, 0), 50);
});*/

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const quadrados = gsap.utils.toArray('.quadrado')
    const maxQuadrados = 7
    const ativos = new Set()

    const cadence = 0.35;
    const fadeIn = 1;
    const hold = 2;
    const fadeOut = 0.8;

    gsap.set(quadrados, {
        opacity: 0
    })

    function acenderUm() {
        if (ativos.size >= maxQuadrados) return;

        const livres = quadrados.filter(q => !ativos.has(q))
        if (!livres.length) return

        const q = livres[Math.floor(Math.random() * livres.length)]
        ativos.add(q)

        gsap.to(q, {
            opacity: 1,
            duration: fadeIn,
            ease: 'none',
            onComplete: () => {
                gsap.delayedCall(hold, () => {
                    gsap.to(q, {
                        opacity: 0,
                        duration: fadeOut,
                        ease: 'none',
                        onComplete: () => ativos.delete(q)
                    })
                })
            }
        })
    }

    gsap.timeline({ repeat: -1 }).call(acenderUm).to({}, { duration: cadence })

    const cards = gsap.utils.toArray(".card");
    const cardsFase1 = cards.slice(0, cards.length - 2); // primeiros
    const cardsFase2 = cards.slice(-2); // últimos 3
    const cardBlock = fadeIn + hold + fadeOut;


    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.divPai',
            start: 'top top',
            end: "+=" + cards.length * 50 + "%",
            scrub: 2,
            pin: true
        }
    });

    tl.addLabel("inicio", 0);

    tl.to('.divGradient', {
        opacity: 0,
        duration: 15,
        ease: "none"
    }, "inicio");

    tl.to('.divGradient2', {
        opacity: 1,
        duration: 15,
        ease: "none"
    }, "inicio");

    tl.to('.tituloAni', {
        opacity: 0,
        duration: 2
    }, "inicio");

    cardsFase1.forEach((card, index) => {
        const start = index * cardBlock;

        tl.fromTo(card, {
            opacity: 0
        }, {
            opacity: 1,
            duration: fadeIn
        }, `inicio+=${start}`);

        tl.to(card, {
            duration: hold
        }, `inicio+=${start + fadeIn}`);

        tl.to(card, {
            opacity: 0,
            duration: fadeOut
        }, `inicio+=${start + fadeIn + hold}`);
    });



    tl.addLabel('volta', '>');

    tl.to('.divGradient', {
        opacity: 1,
        duration: 3,
        ease: "none"
    }, "volta");

    tl.to('.divGradient2', {
        opacity: 0,
        duration: 3,
        ease: "none"
    }, "volta");

    cardsFase2.forEach((card, index) => {
        const start = index * cardBlock;

        tl.fromTo(card, {
            opacity: 0
        }, {
            opacity: 1,
            duration: fadeIn
        }, `volta+=${start}`);

        tl.to(card, {
            duration: hold
        }, `volta+=${start + fadeIn}`);

        if (!card.classList.contains('cardFinal')) {
            tl.to(card, {
                opacity: 0,
                duration: fadeOut
            }, `volta+=${start + fadeIn + hold}`);
        } else {
            tl.to(card, {
                opacity: 1,
            }, `volta+=${start + fadeIn + hold}`);
        }
    });

    tl.fromTo(
        ".divObrigado ",
        {
            rotateX: 90,
            scaleX: 0.5,
            opacity: 0.9,
            transformOrigin: "center 85%",
            transformPerspective: 3000,
            borderRadius: '30px'
        },
        {
            rotateX: 0,
            scale: 1,
            opacity: 1,
            duration: 4,
            borderRadius: '0px'
        }
    );
});
