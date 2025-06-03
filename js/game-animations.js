
function animateGameSprite(element, frames, frameDuration, repeat = -1) {
    if (element.data('animationTween')) element.data('animationTween').kill();
    let currentFrameIndex = 0;
    if (!frames || frames.length === 0) {
        console.warn("animateGameSprite: No frames provided for element", element);
        return null;
    }
    element.attr('src', frames[0]);
    const tween = gsap.to({ frame: 0 }, {
        duration: frameDuration, repeat: repeat, ease: "steps(1)",
        onRepeat: function() {
            currentFrameIndex = (currentFrameIndex + 1) % frames.length;
            element.attr('src', frames[currentFrameIndex]);
        }
    });
    element.data('animationTween', tween);
    return tween;
}