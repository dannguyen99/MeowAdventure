$(document).ready(function() {
  const $sceneBg      = $('#scene-background');
  const $kitten       = $('#kitten-sprite');
  const $fluffy       = $('#fluffy-dog-sprite');
  const $owl          = $('#old-owl-sprite');
  const $clockMech    = $('#clock-mechanism');
  const $gearSlots    = $('.gear-slot');
  const $clockFace    = $('#clock-face');
  const $doorOpened   = $('#tower-door-opened');
  const audio = {
    bg: $('#bg-music-tower-final')[0],
    click: $('#click-sound')[0],
    place: $('#gear-place-sound')[0],
    tick: $('#clock-tick-sound')[0],
    turn: $('#clock-turn-sound')[0],
    creak: $('#door-creak-sound')[0],
    meow: $('#meow-joyful-sound')[0],
    bark: $('#fluffy-dog-happy-sound')[0],
    wise: $('#owl-wise-sound')[0],
    win:  $('#success-fanfare-sound')[0]
  };

  let gearsPlaced = 0;

  function placeGear(n, cb) {
    const $slot = $gearSlots.filter(`[data-gear-id=${n}]`);
    if (!$slot.length) return cb && cb();
    audio.place.play();
    $slot.fadeTo(400, 1, function() {
      gearsPlaced++;
      cb && cb();
    });
  }

  const sceneDialogues = [
    {
      text: "The two friends rushed back to the tower and placed the three gears inside the massive clock.",
      action(cb) {
        // first fade in all characters & mechanism
        $sceneBg.fadeTo(600,1);
        $kitten .fadeTo(600,1);
        $fluffy .fadeTo(600,1);
        $owl    .fadeTo(600,1);
        $clockMech.fadeTo(600,1, function() {
          // then place the gears one by one
          placeGear(1, ()=>
            placeGear(2, ()=>
              placeGear(3, cb)
            )
          );
        });
      }
    },
    {
      text: "Well done, little travellers. Now, turn the clock's hands!",
      action(cb) {
        audio.wise.play();
        $owl
          .fadeTo(200, 0.7)
          .fadeTo(200, 1.0, cb);
      }
    },
    {
      text: "Kitten and Fluffy Dog pushed the hands of the clock together.",
      action(cb) {
        // simulate push by sliding left, play turn sounds, then slide back
        $kitten .animate({ left: '-=20px' },300);
        $fluffy .animate({ left: '-=20px' },300, function() {
          audio.turn.play();
          audio.tick.loop = true;
          audio.tick.play();
          // skip real rotation—just wait 1s
          setTimeout(() => {
            audio.tick.pause();
            audio.tick.currentTime = 0;
            $kitten .animate({ left: '+=20px' },300);
            $fluffy .animate({ left: '+=20px' },300, cb);
          }, 1000);
        });
      }
    },
    {
      text: "A loud click echoed, and the clock began to move. The door of the tower slowly creaked open, revealing the path home.",
      action(cb) {
        audio.win.play();
        audio.creak.play();
        $doorOpened.fadeTo(1000,1, cb);
      }
    },
    {
      text: "We did it! We’re almost home!",
      action(cb) {
        audio.meow.play();
        $kitten
          .animate({ top: '-=15px' },200)
          .animate({ top: '+=15px' },200, cb);
      }
    },
    {
      text: "Yes! Thanks for sticking together through all the challenges!",
      action(cb) {
        audio.bark.play();
        $fluffy
          .fadeTo(100,0.5)
          .fadeTo(100,1.0)
          .fadeTo(100,0.5)
          .fadeTo(100,1.0, cb);
      }
    },
    {
      text: "Time always moves forward, just like life itself. Cherish those who walk this journey with you.",
      action(cb) {
        audio.wise.play();
        $owl
          .fadeTo(300,0.7)
          .fadeTo(300,1.0, cb);
      }
    },
    {
      text: "The two friends looked at each other, smiling, before stepping through the door—one step closer to their beloved home…",
      action(cb) {
        // step through door by fading out and moving down
        $kitten .animate({ top: '+=50px', opacity: 0 },800);
        $fluffy .animate({ top: '+=50px', opacity: 0 },800, cb);
      },
      endScene: true
    }
  ];

  const imagesForThisScene = [
    'images/Lv4.jpeg',
    'images/Kitten.png',
    'images/FluffyDog.png',
    'images/Owl.png',
    'images/Gear.png',
    'images/TheClock.png',
    'images/OpenDoorwayPath.jpeg'
  ];

  const sceneData = {
    dialogues: sceneDialogues,
    imagesToPreload: imagesForThisScene,
    audioSelectors: audio,
    onSceneReady() {
      // set initial CSS
      $sceneBg.css({ opacity:0 });
      $kitten.add($fluffy).add($owl).add($clockMech).add($doorOpened).css({ opacity:0, display:'block' });
    }
  };

  initializeSceneFramework(sceneData);
});