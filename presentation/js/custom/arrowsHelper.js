(function () {
  const linesMap = {};
  let currentSection = null;

  const createLine = (id) => {
    if (linesMap[id]) {
      return linesMap[id].show("none");
    }

    const parent = currentSection?.querySelector('[data-id="arrow-parent"]');
    const childElement = document.getElementById(id);
    const arrowLabel = childElement?.dataset?.arrowLabel;

    linesMap[id] = new LeaderLine(parent, document.getElementById(id), {
      startSocketGravity: 120,
      endLabel: LeaderLine.captionLabel(arrowLabel, {
        fontSize: "1.75rem",
        color: "#404040",
      }),
    });
  };

  const addArrowsEventListeners = (initialSlide) => {
    currentSection = initialSlide;

    const children = currentSection?.querySelectorAll("[id^=arrow-child]");

    children?.forEach((child) => {
      const isHidden = window.getComputedStyle(child).visibility === "hidden";

      if (!isHidden) {
        createLine(child.id);
      }
    });

    Reveal.on("fragmentshown", (e) => {
      if (e.fragment.id?.startsWith("arrow-child")) {
        createLine(e.fragment.id);
      }
    });

    Reveal.on("fragmenthidden", (e) => {
      const fragmentId = e.fragment.id;

      if (e.fragment.id?.startsWith("arrow-child")) {
        linesMap[fragmentId]?.hide("none");
      }
    });

    Reveal.on("slidechanged", (e) => {
      Object.values(linesMap).forEach((line) => line.hide("none"));

      currentSection = e.currentSlide;

      const children = currentSection?.querySelectorAll("[id^=arrow-child]");

      children?.forEach((child) => {
        const isHidden = window.getComputedStyle(child).visibility === "hidden";

        if (!isHidden) {
          setTimeout(() => createLine(child.id), 400);
        }
      });
    });
  };

  window.addArrowsEventListeners = addArrowsEventListeners;
})();
