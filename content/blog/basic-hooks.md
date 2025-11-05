---
title: Understanding React Hooks - useState and useEffect
date: 2025-11-06
excerpt: A deep dive into two of the most fundamental React Hooks - useState for state management and useEffect for side effects.
tags: [react, hooks, javascript, frontend]
---

# Understanding React Hooks: `useState` and `useEffect`

React Hooks revolutionized how we write functional components, allowing us to manage state and side effects without writing class components. In this post, we'll explore two of the most commonly used Hooks: `useState` and `useEffect`.

## `useState`: Managing Component State

`useState` is the simplest way to add state to functional components. It returns a pair: the current state value and a function that lets you update it.

Here's a basic example:

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // Initialize count to 0

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Counter;
```

In this example:
- `useState(0)` initializes `count` to `0`.
- `setCount` is the function we use to update the `count`.
- Each time the button is clicked, `setCount` updates the `count`, triggering a re-render of the `Counter` component.

## `useEffect`: Handling Side Effects

`useEffect` allows you to perform side effects in functional components. Side effects include data fetching, subscriptions, or manually changing the DOM. It runs after every render of the component.

Let's modify our counter to log the count to the console whenever it changes:

```jsx
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // This effect runs after every render
  useEffect(() => {
    console.log(`Count changed to: ${count}`);
    // Optional: Return a cleanup function
    return () => {
      console.log('Cleanup for count effect');
    };
  }, [count]); // Dependency array: only re-run if 'count' changes

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Counter;
```

Key points about `useEffect`:
- The first argument is a function that contains the side effect logic.
- The second argument is an optional **dependency array**.
    - If omitted, the effect runs after *every* render.
    - If an empty array `[]` is provided, the effect runs only *once* after the initial render (similar to `componentDidMount`).
    - If you provide values in the array (e.g., `[count]`), the effect will re-run only if those values change between renders.
- The `useEffect` function can optionally return a **cleanup function**. This function runs when the component unmounts, or before the effect re-runs due to a dependency change. This is crucial for cleaning up subscriptions or timers to prevent memory leaks.

## When to Use Which Hook?

- **`useState`**: Use it when you need to store and update data that affects your component's rendering.
- **`useEffect`**: Use it for operations that interact with the outside world or need to run after renders, such as:
    - Data fetching
    - Setting up subscriptions
    - Manually changing the DOM
    - Event listeners that need cleanup

## Conclusion

`useState` and `useEffect` are foundational Hooks that unlock powerful capabilities in functional React components. Mastering them is a crucial step towards building efficient and maintainable React applications. Experiment with these examples and try to build your own components using these essential Hooks!
