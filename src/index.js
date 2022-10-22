import { select, create, selectAll } from "./helpers";
import { gsap, Power1 } from "gsap";
import { DATA } from "./data";

const keyCodes = {
  LEFT: 37,
  RIGHT: 39,
};

const PADDING = 150;
const ELEMENT_SIZE = 450;

window.addEventListener("load", () => {
  const main = select(".main");
  let isAnimating = true;
  let endValue = 100;
  let initialValue = 0;

  const generateList = function () {
    const mid = Math.floor(DATA.length / 2);
    let ind = 0;
    DATA.forEach((d, index) => {
      const picture = create("picture");
      picture.classList.add("picture");
      const img = create("img");
      img.src = d.imgUrl;

      if (index === mid) {
        gsap.to(picture, {
          zIndex: 100,
          scale: 1.6,
          filter: "grayscale(0%) blur(0px)",
          x: 0,
          y: 0,
        });
      }

      if (index < mid) {
        gsap.to(picture, {
          zIndex: 0,
          filter: "grayscale(100%) blur(4px)",
          y: -((100 + PADDING) * (mid - index)),
          x: -((ELEMENT_SIZE + PADDING) * (mid - index)),
        });
      }

      if (index > mid) {
        ind++;
        gsap.to(picture, {
          zIndex: 0,
          filter: "grayscale(100%) blur(4px)",
          x: (ELEMENT_SIZE + PADDING) * ind,
          y: (100 + PADDING) * ind,
        });
      }

      picture.appendChild(img);
      main.appendChild(picture);
    });
  };

  const progress = function (loading) {
    const start = () => {
      let speed = 90;

      if (!loading) {
        speed = 5;
      }

      if (initialValue === endValue) {
        return;
      }

      initialValue++;
      const prop = gsap.getProperty(".loading", "textContent");

      gsap.set(".loading", {
        textContent: initialValue + "%",
      });

      if (prop === 99) {
        gsap.to(".loading", {
          autoAlpha: 0,
        });
      }

      setTimeout(start, speed);
    };

    start();
  };

  generateList();
  progress(isAnimating);

  const list = selectAll(".picture");
  list[list.length - 1].querySelector("img").addEventListener("load", () => {
    progress(false);

    gsap.to(list, {
      stagger: 0.2,
      visibility: "visible",
      delay: 0.5,
      duration: 0.4,
      ease: Power1.easeInOut,
      opacity: 1,
    });
    gsap.to(".title", {
      delay: 1,
      duration: 1,
      visibility: "visible",
      ease: Power1.easeInOut,
      opacity: 1,
    });

    gsap
      .to(".scroll", {
        delay: 2,
        duration: 1,
        visibility: "visible",
        ease: Power1.easeInOut,
        opacity: 1,
      })
      .then(() => (isAnimating = false));
  });

  const animate = function (list, direction) {
    isAnimating = true;
    list.forEach((pic, _, arr) => {
      let propX = gsap.getProperty(pic, "x");
      let propY = gsap.getProperty(pic, "y");
      const translateValueX = ELEMENT_SIZE + PADDING;
      const translateValueY = 100 + PADDING;

      const midIndex = arr.findIndex((el) => gsap.getProperty(el, "x") === 0);

      const curr = list[midIndex];
      const next = list[direction === "left" ? midIndex + 1 : midIndex - 1];

      if (next == undefined || next == null) {
        isAnimating = false;
        return;
      }

      gsap.to(next, {
        scale: 0.9,
        duration: 1,
        zIndex: 100,
        ease: Power1.easeInOut,
      });

      gsap
        .to(curr, {
          scale: 0.8,
          filter: "grayscale(100%) blur(4px)",
          duration: 1,
          ease: Power1.easeInOut,
        })
        .then(() => {
          gsap.to(curr, {
            zIndex: 0,
            scale: 1,
            ease: Power1.easeInOut,
            duration: 1,
          });
          gsap
            .to(next, {
              scale: 1.6,
              duration: 1,
              filter: "grayscale(0%) blur(0px)",
              ease: Power1.easeIn,
            })
            .then(() => (isAnimating = false));
        });

      gsap.to(pic, {
        x:
          direction === "left"
            ? propX - translateValueX
            : propX + translateValueX,
        y:
          direction === "left"
            ? propY - translateValueY
            : propY + translateValueY,
        duration: 2,
        ease: Power1.easeInOut,
      });
    });
  };

  window.addEventListener("keydown", ({ keyCode }) => {
    const { LEFT, RIGHT } = keyCodes;
    const list = selectAll(".picture");

    if (keyCode === LEFT && !isAnimating) {
      animate(list, "left");
    }

    if (keyCode === RIGHT && !isAnimating) {
      animate(list, "right");
    }
  });

  window.addEventListener("wheel", (e) => {
    const list = selectAll(".picture");

    if (e.deltaY < 0 && !isAnimating) {
      animate(list, "left");
    }

    if (e.deltaY > 0 && !isAnimating) {
      animate(list, "right");
    }
  });
});
