document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetSelector = tab.getAttribute('data-target');

      if (targetSelector) {
        const target = document.querySelector(targetSelector) as HTMLElement;

        if (target) {
          const offsetTop = target.offsetTop - 50;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      }
    });
  });

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 60;

    document.querySelectorAll('section').forEach(section => {
      const id = section.getAttribute('id');

      if (id) {
        const offset = section.offsetTop;
        const height = section.offsetHeight;

        if (scrollPos >= offset && scrollPos < offset + height) {
          document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
          });

          const activeTab = document.querySelector(`[data-target="#${id}"]`);
          if (activeTab) {
            activeTab.classList.add('active');
          }
        }
      }
    });
  });
