export default function skeletonize(selector: string, target: string) {
  const element = document.querySelector<HTMLElement>(selector);
  const targetElement = document.querySelector<HTMLElement>(target);

  if (!element || !targetElement) {
    throw new Error(`No element found for selector ${selector}`);
  }

  const source = element.cloneNode(true) as HTMLElement

  targetElement.style.display = "mone"
  targetElement.appendChild(source)

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
        const { width, height } = style;
        el.style.backgroundImage = "none";
        el.style.width = width;
        el.style.height = height;
        if (el.children.length === 0) {
          el.classList.add("skeleton");
        }
        continue;
      }

      const background = style.background;
      if (background && background !== "none") {
        const { width, height } = style;
        el.style.width = width;
        el.style.height = height;
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
          const { width, height } = pseudoStyle;
          el.style.content = "";
          el.style.width = width;
          el.style.height = height;
          //el.classList.remove(...el.classList)
          if (el.children.length === 0) {
            el.classList.add("skeleton");
          }
        }
      }
    }

    element.style.display = "block"
  }
}
