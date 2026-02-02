document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.item');
    const fragments = document.querySelectorAll('.fragment');
    const foundCountEl = document.getElementById('foundCount');
    const finalReveal = document.getElementById('finalReveal');
    const replayBtn = document.getElementById('replayBtn');
    const confettiCanvas = document.getElementById('confettiCanvas');
    const loveVideo = document.getElementById('loveVideo'); // 🎥 VIDEO

    let foundCount = 0;
    const totalItems = 5;

    // Initialize confetti canvas
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    // Click on hidden items
    items.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('found')) return;

            const id = this.getAttribute('data-id');

            this.classList.add('found');

            const fragment = document.querySelector(`.fragment[data-fragment="${id}"]`);
            if (fragment) fragment.classList.add('revealed');

            foundCount++;
            foundCountEl.textContent = foundCount;

            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'pulse 0.6s';
            }, 10);

            // 🎉 ALL FOUND
            if (foundCount === totalItems) {
                setTimeout(() => {
                    finalReveal.style.display = 'block';
                    launchConfetti();

                    // ▶️ PLAY VIDEO SONG
                    if (loveVideo) {
                        loveVideo.currentTime = 0;
                        loveVideo.muted = false;
                        loveVideo.play().catch(() => {});
                    }

                }, 800);
            }
        });
    });

    // Confetti
    function launchConfetti() {
        const ctx = confettiCanvas.getContext('2d');
        const confettiCount = 150;
        const colors = ['#ff9ee5', '#9d4edd', '#7b2cbf', '#a8a4ff', '#ff6bcb'];

        for (let i = 0; i < confettiCount; i++) {
            const x = Math.random() * confettiCanvas.width;
            const y = Math.random() * confettiCanvas.height - confettiCanvas.height;
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const speed = Math.random() * 3 + 2;

            animateConfetti(ctx, x, y, size, color, speed);
        }
    }

    function animateConfetti(ctx, x, y, size, color, speed) {
        let posY = y;
        function frame() {
            ctx.clearRect(x - size - 1, posY - size - 1, size * 2 + 2, size * 2 + 2);
            posY += speed;
            if (posY < confettiCanvas.height) {
                ctx.beginPath();
                ctx.arc(x, posY, size, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
                requestAnimationFrame(frame);
            }
        }
        frame();
    }

    // 🔁 Replay
    replayBtn.addEventListener('click', function() {
        items.forEach(item => item.classList.remove('found'));
        fragments.forEach(fragment => fragment.classList.remove('revealed'));
        foundCount = 0;
        foundCountEl.textContent = '0';
        finalReveal.style.display = 'none';

        // ⏹️ STOP VIDEO
        if (loveVideo) {
            loveVideo.pause();
            loveVideo.currentTime = 0;
        }

        const ctx = confettiCanvas.getContext('2d');
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    });

    // Resize
    window.addEventListener('resize', function() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    });

    // Pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});
