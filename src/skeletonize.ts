export default function skeletonize(selector: string, target: string) {
  const element = document.querySelector<HTMLElement>(selector);
  const targetElement = document.querySelector<HTMLElement>(target);

  if (!element || !targetElement) {
    throw new Error(`No element found for selector ${selector}`);
  }

  const source = element.firstElementChild!.cloneNode(true) as HTMLElement;

  // targetElement.style.display = "none"
  targetElement.appendChild(source);

  getImageElements(targetElement);

  function getImageElements(element: HTMLElement) {
    const allElements = element.getElementsByTagName("*"); // More efficient than querySelectorAll('*')

    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i] as HTMLElement;

      if (el.classList.contains("skeleton")) {
        continue;
      }

      const style = window.getComputedStyle(el);

      Array.from(el.childNodes)
        .filter(
          (node) => node.nodeType === 3 && !node.nodeValue?.includes("\n")
        )
        .forEach((textNode) => {
          const { width, height } = style;
          el.style.width = width;
          el.style.height = height;
          textNode.nodeValue = "";
          //el.classList.remove(...el.classList)
          if (el.children.length === 0) {
            el.classList.add("skeleton");
          }
        });

      // Detect background images
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== "none") {
        if (el.children.length === 0) {
          el.classList.add("skeleton");
        }
        continue;
      }

      // Detect background usages
      const background = style.background;
      if (background && background !== "none") {
        if (el.children.length === 0) {
          el.classList.add("skeleton");
        }
        continue;
      }

      // Detect pseudo-element background images
      for (const pseudo of ["::before", "::after"]) {
        const pseudoStyle = window.getComputedStyle(el, pseudo);
        const content = pseudoStyle.content;
        if (content && content.includes("url(")) {
          el.style.content = "";
          if (el.children.length === 0) {
            el.classList.add("skeleton");
          }
        }
      }
    }

    element.style.display = "flex";
  }
}
