$(document).ready(function() {
    const $sceneBackground = $('#scene-background');
    
    const $kittenSprite = $('#kitten-sprite');
    const $fluffyDogSprite = $('#fluffy-dog-sprite');
    const $thankYouContainer = $('#thank-you-text-container');
    const $navContainer = $('#navigation');
    const $playAgainButton = $('#play-again-button');

    const bgMusic = $('#bg-music-thank-you')[0];
    const meowSound = $('#meow-happy-sound')[0];
    const dogSound = $('#dog-happy-sound')[0];
    const clickSound = $('#click-sound')[0];

    function initScene() {
        
        if (typeof initializeGameAudio === "function") {
            initializeGameAudio({ bgMusic: '#bg-music-thank-you', sfx: { click: '#click-sound'} });
        } else {
            if (bgMusic) {
                bgMusic.volume = 0.3;
                bgMusic.play().catch(e => console.warn("Autoplay prevented for background music."));
            }
        }
        
        
        if (typeof initializeNavigation === "function") {
            initializeNavigation();
        } else {
            $playAgainButton.on('click', function() {
                if (clickSound) clickSound.play();
                const nextScene = $(this).data('nextscene');
                if (nextScene) {
                    gsap.to('body', { opacity: 0, duration: 0.5, onComplete: () => {
                        window.location.href = nextScene;
                    }});
                }
            });
        }

        
        const tl = gsap.timeline();

        tl.to($sceneBackground, { opacity: 1, duration: 1.2 })
          .set([$kittenSprite, $fluffyDogSprite], { display: 'block', opacity: 0, scale: 0.8, y: 30 })
          .to($kittenSprite, { 
              opacity: 1, 
              scale: 1,
              y: 0, 
              duration: 1.0, 
              ease: "elastic.out(1, 0.8)",
              onComplete: () => {
                  if (meowSound) meowSound.play();
                  
                  gsap.to($kittenSprite, { 
                      y: -8, 
                      duration: 2, 
                      yoyo: true, 
                      repeat: -1, 
                      ease: "sine.inOut" 
                  });
              }
            })
          .to($fluffyDogSprite, { 
              opacity: 1, 
              scale: 1,
              y: 0, 
              duration: 1.0, 
              ease: "elastic.out(1, 0.8)",
              onComplete: () => {
                  if (dogSound) dogSound.play();
                  
                  gsap.to($fluffyDogSprite, { 
                      y: -8, 
                      duration: 2.5, 
                      yoyo: true, 
                      repeat: -1, 
                      ease: "sine.inOut" 
                  });
              }
            }, "-=0.8")
          
          .to($kittenSprite, { rotation: -10, duration: 0.3, ease: "sine.inOut" }, ">0.2")
          .to($kittenSprite, { rotation: 10, duration: 0.3, ease: "sine.inOut" })
          .to($kittenSprite, { rotation: 0, duration: 0.3, ease: "sine.inOut" })
          .to($fluffyDogSprite, { rotation: 10, duration: 0.3, ease: "sine.inOut" }, "<")
          .to($fluffyDogSprite, { rotation: -10, duration: 0.3, ease: "sine.inOut" })
          .to($fluffyDogSprite, { rotation: 0, duration: 0.3, ease: "sine.inOut" })
          
          .to($thankYouContainer, { 
              opacity: 1, 
              scale: 1, 
              duration: 0.8, 
              ease: "back.out(1.7)" 
            }, ">0.3")
          
          .to("#thank-you-line-1", { opacity: 1, y: 0, duration: 0.5, ease: "bounce.out" }, ">0.3")
          .to("#thank-you-line-2", { opacity: 1, y: 0, duration: 0.5, ease: "bounce.out" }, ">0.15")
          .to("#thank-you-line-3", { opacity: 1, y: 0, duration: 0.5, ease: "bounce.out" }, ">0.15")
          .to("#thank-you-line-4", { opacity: 1, y: 0, duration: 0.5, ease: "bounce.out" }, ">0.15")
          .to("#thank-you-line-5", { opacity: 1, y: 0, duration: 0.5, ease: "bounce.out" }, ">0.2")
          .to("#thank-you-line-6", { opacity: 1, y: 0, duration: 0.6, ease: "bounce.out" }, ">0.15")
          .to("#thank-you-line-7", { opacity: 1, y: 0, duration: 0.6, ease: "bounce.out" }, ">0.2")
          
          .to($navContainer, { 
              opacity: 1, 
              scale: 1, 
              duration: 0.7, 
              ease: "back.out(1.7)" 
            }, ">0.3")
          
          .call(() => {
              
              gsap.to($kittenSprite, { 
                  rotation: 360, 
                  duration: 1.5, 
                  ease: "power2.inOut",
                  repeat: 1,
                  yoyo: true
              });
              gsap.to($fluffyDogSprite, { 
                  rotation: -360, 
                  duration: 1.5, 
                  ease: "power2.inOut",
                  repeat: 1,
                  yoyo: true
              });
          }, null, ">0.2");

        
        gsap.set("#thank-you-line-1, #thank-you-line-2, #thank-you-line-3, #thank-you-line-4, #thank-you-line-5, #thank-you-line-6, #thank-you-line-7", { 
            y: 20, 
            opacity: 0 
        });
        gsap.set($thankYouContainer, { 
            scale: 0.8 
        });
        gsap.set($navContainer, { 
            scale: 0.8 
        });
        
    }

    
    const imagesToPreload = [
        'images/Back1.png',
        'images/Kitten.png',
        'images/FluffyDog.png'
    ];
    let imagesLoaded = 0;

    imagesToPreload.forEach(src => {
        const img = new Image();
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === imagesToPreload.length) {
                initScene();
            }
        };
        img.onerror = () => {
            imagesLoaded++;
            console.warn(`Failed to load image: ${src}`);
            if (imagesLoaded === imagesToPreload.length) {
                initScene();
            }
        };
        img.src = src;
    });

    
    setTimeout(() => {
        if (imagesLoaded < imagesToPreload.length) {
            console.warn("Image preloading timeout. Starting scene anyway.");
            if (!$sceneBackground.css('opacity') || parseFloat($sceneBackground.css('opacity')) === 0) {
                 initScene();
            }
        }
    }, 5000);
});