import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTransition, animated, config } from "@react-spring/web";

function Masonry({ children, itemHeight = 300, gap = 15 }) {
  const [columns, setColumns] = useState(2);

  const [key, setKey] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    // Mark first render complete after a short delay
    const timer = setTimeout(() => {
      setIsFirstRender(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateColumns = () => {
      const prevColumns = columns;
      let newColumns = 2;

      if (window.matchMedia("(min-width: 1500px)").matches) {
        newColumns = 5;
      } else if (window.matchMedia("(min-width: 1000px)").matches) {
        newColumns = 4;
      } else if (window.matchMedia("(min-width: 600px)").matches) {
        newColumns = 3;
      } else {
        newColumns = 1; // Mobile devices
      }

      if (prevColumns !== newColumns) {
        setColumns(newColumns);

        setKey((k) => k + 1);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [columns]);

  const ref = useRef();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        const newWidth = ref.current.offsetWidth;
        setWidth(newWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Process children to add height and id if they don't have them
  const data = useMemo(() => {
    return React.Children.map(children, (child, i) => {
      if (!React.isValidElement(child)) return null;

      const height = child.props.height || itemHeight;

      const id = child.props.id || `item-${i}`;

      return { child, height, id };
    }).filter(Boolean);
  }, [children, itemHeight]);

  const [heights, gridItems] = useMemo(() => {
    let heights = new Array(columns).fill(0);
    let gridItems = data.map((item) => {
      const column = heights.indexOf(Math.min(...heights));
      const x = (width / columns) * column;
      const y = (heights[column] += item.height + gap) - item.height - gap;
      return {
        ...item,
        x,
        y,
        width: width / columns - gap,
        height: item.height,
      };
    });

    return [heights, gridItems];
  }, [columns, data, width, gap]);

  // Use different animation settings for first render vs. subsequent updates
  const transitions = useTransition(gridItems, {
    keys: (item) => item.id,

    from: ({ x, y, width, height }) => ({
      x: isFirstRender ? x : 0,
      y: isFirstRender ? y : 0,
      width,
      height,

      opacity: 0,
      scale: isFirstRender ? 0.95 : 0.8,
      rotate: isFirstRender ? 0 : -5,
    }),
    enter: ({ x, y, width, height }) => ({
      x,
      y,
      width,
      height,
      opacity: 1,
      scale: 1,

      rotate: 0,
    }),

    update: ({ x, y, width, height }) => ({
      x,
      y,
      width,
      height,
      opacity: 1,
      scale: 1,
      rotate: 0,
    }),

    leave: {
      opacity: 0,
      scale: 0.5,

      rotate: 5,
    },

    config: (item, index, phase) => {
      // Use gentler animation for first render
      if (isFirstRender && phase === "enter") {
        return {
          mass: 1,
          tension: 170,
          friction: 26,
          clamp: false,
          duration: 400,
        };
      }

      // More dramatic animations for subsequent updates
      return {
        mass: 1.5,
        tension: 120,
        friction: 26,
        clamp: false,
        duration: 800,
      };
    },

    trail: isFirstRender ? 25 : 100, // Shorter trail for first render
  });

  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{ height: Math.max(...heights) + gap || 200 }}
      key={key}
    >
      {transitions((style, item) => (
        <animated.div
          key={item.id}
          style={{
            position: "absolute",
            willChange: "transform, width, height, opacity, scale, rotate",
            padding: `${gap / 2}px`,
            ...style,
          }}
        >
          {item.child}
        </animated.div>
      ))}
    </div>
  );
}

export default Masonry;
