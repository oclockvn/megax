import { useEffect, useState } from "react";

const throttle = require("lodash/throttle");

export type ScrollDir = "up" | "down";
export default function useScrollDirection() {
  const [direction, setDirection] = useState<ScrollDir | undefined>();

  let prevScrollY = 0;
  let prevDir: ScrollDir | undefined = undefined;

  useEffect(() => {
    // Using lodash, we set a throttle to the scroll event
    // making it not fire more than once every 500 ms.
    const scrollFn = throttle(() => {
      // This value keeps the latest scrollY position
      const { scrollY } = window;

      // Checks if previous scrollY is less than latest scrollY
      // If true, we are scrolling downwards, else scrollig upwards
      const direction = prevScrollY < scrollY ? "down" : "up";

      // Updates the previous scroll variable AFTER the direction is set.
      // The order of events is key to making this work, as assigning
      // the previous scroll before checking the direction will result
      // in the direction always being 'up'.
      prevScrollY = scrollY;

      // Set the state to trigger re-rendering
      if (direction !== prevDir) {
        setDirection(direction);
      }
    }, 250);

    window.addEventListener('scroll', scrollFn)

    return () => {
      // Remove scroll event on unmount
      // window.onscroll = null;
      window.removeEventListener('scroll', scrollFn)
    };
  }, []);

  return direction;
}
