if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
    ScrollTrigger.refresh(true);
    setTimeout(() => window.scrollTo(0, 0), 50);
});

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({
    ignoreMobileResize: true
});

    const mainContent = document.querySelector("main.content");
    const totalQuadradosMain = 90;

    if (mainContent) {
        const existentes = mainContent.querySelectorAll(".quadradoMain").length;
        const faltantes = Math.max(0, totalQuadradosMain - existentes);
        const larguraArea = Math.max(mainContent.clientWidth, window.innerWidth);
        const alturaArea = Math.max(mainContent.scrollHeight, window.innerHeight * 2);
        const tamanhoQuadrado = 200;
        const margem = tamanhoQuadrado * 0.7;
        const distanciaMinima = tamanhoQuadrado * 1.05;
        const maxTentativas = 200;
        const posicoes = [];

        for (let i = 0; i < faltantes; i++) {
            let posicao = null;

            for (let tentativa = 0; tentativa < maxTentativas; tentativa++) {
                const candidato = {
                    x: gsap.utils.random(margem, Math.max(margem, larguraArea - margem)),
                    y: gsap.utils.random(margem, Math.max(margem, alturaArea - margem))
                };

                const colide = posicoes.some((p) => {
                    return Math.hypot(p.x - candidato.x, p.y - candidato.y) < distanciaMinima;
                });

                if (!colide) {
                    posicao = candidato;
                    break;
                }
            }

            if (!posicao) {
                posicao = {
                    x: gsap.utils.random(margem, Math.max(margem, larguraArea - margem)),
                    y: gsap.utils.random(margem, Math.max(margem, alturaArea - margem))
                };
            }

            posicoes.push(posicao);

            const quadrado = document.createElement("div");
            quadrado.className = "quadrado quadradoMain";
            quadrado.style.left = `${posicao.x}px`;
            quadrado.style.top = `${posicao.y}px`;
            quadrado.style.transform = "translate(-50%, -50%)";
            mainContent.prepend(quadrado);
        }
    }

    const quadradosMain = gsap.utils.toArray('main .quadradoMain')
    const quadradosObrigado = gsap.utils.toArray('.divObrigado .quadrado')
    const maxQuadradosMain = 60
    const maxQuadradosObrigado = 8
    const ativosMain = new Set()
    const ativosObrigado = new Set()

    const cadence = 0.35;
    const fadeIn = 1;
    const hold = 2;
    const fadeOut = 0.8;

    gsap.set([...quadradosMain, ...quadradosObrigado], {
        opacity: 0
    })

    function acenderUm(grupo, ativos, maxAtivos) {
        if (!grupo.length) return;
        if (ativos.size >= maxAtivos) return;

        const livres = grupo.filter(q => !ativos.has(q))
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

    gsap.timeline({ repeat: -1 })
        .call(() => acenderUm(quadradosMain, ativosMain, maxQuadradosMain))
        .to({}, { duration: cadence })

    gsap.timeline({ repeat: -1 })
        .call(() => acenderUm(quadradosObrigado, ativosObrigado, maxQuadradosObrigado))
        .to({}, { duration: cadence })

    const cards = gsap.utils.toArray(".card");
    const cardsFase1 = cards.slice(0, cards.length - 2); // primeiros
    const cardsFase2 = cards.slice(-2); // últimos 3
    const cardBlock = fadeIn + hold + fadeOut;
    const isMobileHero = window.matchMedia("(max-width: 768px)").matches;
    const gradientFadeDuration = isMobileHero ? 24 : 15;
    const gradientBackDuration = isMobileHero ? 4.5 : 3;


    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.divPai',
            start: 'top top',
            end: "+=" + cards.length * 60 + "%",
            scrub: 1.5,
            pin: true
        }
    });

    tl.addLabel("inicio", 0);

    tl.to('.divGradient', {
        opacity: 0,
        duration: gradientFadeDuration,
        ease: "none"
    }, "inicio");

    tl.to('.divGradient2', {
        opacity: 1,
        duration: gradientFadeDuration,
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
        duration: gradientBackDuration,
        ease: "none"
    }, "volta");

    tl.to('.divGradient2', {
        opacity: 0,
        duration: gradientBackDuration,
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



    const list = document.querySelector(".pin-section .list");
    const fill = document.querySelector(".pin-section .fill");
    const listItems = list ? gsap.utils.toArray("li", list) : [];
    const slides = gsap.utils.toArray(".pin-section .slide");

    if (listItems.length && slides.length) {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const endFactor = isMobile ? 60 : 80;
        const scrubValue = isMobile ? 0.2 : 2;
        const slideDuration = isMobile ? 0.3 : 0.4;

        const tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: ".processo",
                start: "top top",
                end: `+=${listItems.length * endFactor}%`,
                pin: true,
                scrub: scrubValue
            }
        });

        if (fill) {
            gsap.set(fill, {
                scaleY: 1 / listItems.length,
                transformOrigin: "top left"
            });
        }

        listItems.forEach((item, i) => {
            const isFirst = i === 0;
            const previousItem = listItems[i - 1];
            const currentSlide = slides[i];
            const previousSlide = slides[i - 1];

            if (isFirst) {
                gsap.set(item, { color: "#8888CF", opacity: 1 });
                gsap.set(currentSlide, { autoAlpha: 1 });
                return;
            }

            tl2
                .set(item, { color: "#8888CF", opacity: 1 }, 0.5 * i)
                .to(currentSlide, { autoAlpha: 1, duration: slideDuration }, "<")
                .set(previousItem, { color: "#47474D", opacity: 1 }, "<")
                .to(previousSlide, { autoAlpha: 0, duration: slideDuration }, "<");
        });

        if (fill) {
            tl2.to(
                fill,
                {
                    scaleY: 1,
                    transformOrigin: "top left",
                    ease: "none",
                    duration: tl2.duration()
                },
                0
            );
        }

        tl2.to({}, { duration: 0.3 });
    }

    const mainEl = document.querySelector("main.content");

    if (mainEl) {
        const splitTargets = gsap.utils.toArray("main h1, main h2, main h3, main .txt-sobre, main .txtSobre");

        function splitTextToChars(element) {
            if (element.dataset.splitDone === "true") {
                return gsap.utils.toArray(".char-split", element);
            }

            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode(node) {
                        return node.nodeValue.trim().length
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_REJECT;
                    }
                }
            );

            const textNodes = [];
            while (walker.nextNode()) {
                textNodes.push(walker.currentNode);
            }

            textNodes.forEach((node) => {
                const fragment = document.createDocumentFragment();
                const parts = node.nodeValue.split(/(\s+)/);

                parts.forEach((part) => {
                    if (!part) return;

                    if (/^\s+$/.test(part)) {
                        fragment.appendChild(document.createTextNode(part));
                        return;
                    }

                    const word = document.createElement("span");
                    word.className = "word-split";
                    word.style.display = "inline-block";
                    word.style.whiteSpace = "nowrap";

                    for (const char of part) {
                        const span = document.createElement("span");
                        span.className = "char-split";
                        span.textContent = char;
                        span.style.display = "inline-block";
                        span.style.willChange = "transform, opacity";
                        word.appendChild(span);
                    }

                    fragment.appendChild(word);
                });

                node.parentNode.replaceChild(fragment, node);
            });

            element.dataset.splitDone = "true";
            return gsap.utils.toArray(".char-split", element);
        }

        splitTargets.forEach((target) => {
            const chars = splitTextToChars(target);
            const isTxtSobre = target.matches(".txt-sobre, .txtSobre");

            if (!chars.length) return;

            gsap.from(chars, {
                yPercent: 110,
                autoAlpha: 0,
                duration: isTxtSobre ? 0.35 : 0.7,
                ease: "power3.out",
                stagger: isTxtSobre ? 0.007 : 0.015,
                scrollTrigger: {
                    trigger: target,
                    start: "top 88%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        const telaImg = document.querySelector("main .divTela img");

        if (telaImg) {
            gsap.from(
                telaImg,
                {
                    scale: 0.60,
                    transformOrigin: "center bottom",
                    scrollTrigger: {
                        trigger: telaImg,
                        start: "top bottom",
                        end: "center center",
                        scrub: 0.7
                    }
                }
            );
        }

        const rotatingCards = gsap.utils.toArray("main .cardCrescimento, main .cardClientes");

        rotatingCards.forEach((card) => {
            gsap.fromTo(
                card,
                {
                    rotateX: 180,
                    autoAlpha: 0,
                    transformPerspective: 1200,
                    transformOrigin: "center center"
                },
                {
                    rotateX: 0,
                    autoAlpha: 1,
                    duration: 1.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });


    }



});
