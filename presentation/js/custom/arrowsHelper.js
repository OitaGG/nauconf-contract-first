(function () {
  let lines = [];
  let currentSection = null;

  const createLine = (id) => {
    const parent = currentSection?.querySelector('[data-id="arrow-parent"]');
    const childElement = document.getElementById(id);

    const arrowLabel = childElement?.dataset?.arrowLabel;

    const line = new LeaderLine(parent, document.getElementById(id));

    line.setOptions({
      startSocketGravity: 120,
      endLabel: LeaderLine.captionLabel(arrowLabel, {
        fontSize: "1.75rem",
        color: "#404040",
      }),
    });

    lines.push([id, line]);
  };

  const addArrowsEventListeners = () => {
    Reveal.on("fragmentshown", (e) => {
      if (e.fragment.id?.startsWith("arrow-child")) {
        createLine(e.fragment.id);
      }
    });

    Reveal.on("fragmenthidden", (e) => {
      const lineIdx = lines.findIndex((line) => line[0] === e.fragment.id);

      if (lineIdx !== -1) {
        lines[lineIdx][1]?.remove();

        lines.splice(lineIdx, 1);
      }
    });

    Reveal.on("slidechanged", (e) => {
      lines.forEach((line) => line[1]?.remove());

      lines = [];

      currentSection = e.currentSlide;

      const children = currentSection.querySelectorAll("[id^=arrow-child]");

      children.forEach((child) => {
        const isHidden = window.getComputedStyle(child).visibility === "hidden";

        if (!isHidden) {
          createLine(child.id);
        }
      });
    });
  };

  window.addArrowsEventListeners = addArrowsEventListeners;
})();
