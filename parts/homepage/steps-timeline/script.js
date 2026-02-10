document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.part-homepage-steps-timeline');
    if (!section) return;

    const blueLine = section.querySelector('.timeline-line-blue');
    const steps = section.querySelectorAll('.step .circle');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start animation
                blueLine.style.width = '100%';
                
                // Animate circles sequentially
                steps.forEach((step, index) => {
                    setTimeout(() => {
                        step.classList.add('active');
                    }, index * 1000); // Delay for each step to match line progress roughly
                });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(section);
});
