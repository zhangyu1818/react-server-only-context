# react-server-only-context

`react-server-only-context` is a straightforward alternative for using `context` within React Server Components. Since React Server Components do not include built-in `context` support, this package provides a simple and broadly applicable solution for sharing state across server-side components without resorting to prop drilling.

## Installation

To install via npm:

```
npm install react-server-only-context
```

Or with pnpm:

```
pnpm install react-server-only-context
```

## Quick Start

First, create a context using `createServerOnlyContext`.

```js
import { createServerOnlyContext } from 'react-server-only-context'

export const Context = createServerOnlyContext('defaultValue')
```

Next, use the `Context.Provider` to wrap your components, passing in a `value` prop.

```jsx
<Context.Provider value="newValue">
  <YourComponent />
</Context.Provider>
```

Lastly, use `readContext` where you need to access the context value.

```js
import { readContext } from 'react-server-only-context'
import { Context } from './YourContext'

const value = readContext(Context)
```

## API

### `createServerOnlyContext(defaultValue)`

Creates a context with a default value. The `defaultValue` is the initial value for the context.

This function returns an object that includes a `Provider` component.

### `Provider`

The `Provider` component is used to pass a value down the component tree. It accepts two props:

- `value`: The value to be passed down.
- `children`: The child components.

The `Provider` is part of the object returned by `createServerOnlyContext`.

### `readContext(context)`

This function accepts a context (created by `createServerOnlyContext`) as its argument and returns the current value of the context.

## Pitfalls

Before the introduction of React Server Components, component traversal in React was depth-first, implying a stack-like process. Consider the following component structure:

```jsx
<>
  <Component name="A">
    <Component name="D">
      <Component name="G" />
      <Component name="H" />
    </Component>
    <Component name="E" />
  </Component>
  <Component name="B" />
  <Component name="C">
    <Component name="F" />
  </Component>
</>
```

For client-side React rendering, the traversal order of the code above is:

```
A
D
G
H
E
B
C
F
```

However, with React Server Components — specifically when using asynchronous components — the traversal order changes to:

```
A
B
C
D
E
F
G
H
```

The asynchronous components that can suspend create an impression of breadth-first traversal, as stated in the React Server Components RFCs: "if any Server Component suspends, React will pause rendering of that subtree" ([React RFCs](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md?plain=1#L332)).

This shift means that traditional React context behavior, based on a stack model (LIFO), cannot be replicated with asynchronous components. Consider this example using client-side components and `React.createContext`:

```jsx
<Context.Provider value={{ value: 1 }}>
  <Component name="A">
    <Context.Provider value={{ value: 2 }}>
      <Component name="D">
        <Context.Provider value={{ value: 3 }}>
          <Component name="G" />
          <Component name="H" />
        </Context.Provider>
      </Component>
    </Context.Provider>
    <Component name="E" />
  </Component>
  <Component name="B" />
  <Component name="C">
    <Component name="F" />
  </Component>
</Context.Provider>
```

In this setup, components retrieve values from the context as follows:

```
A => 1
D => 2
G => 3
H => 3
E => 1
B => 1
C => 1
F => 1
```

However, with `react-server-only-context` and asynchronous React Server Components, the outcomes become unpredictable since the stack model cannot be implemented in asynchronous components. The expected context values might differ:

```
A => 1
D => 2
G => 3
H => 3
E => 2
B => 1
C => 1
F => 2
```

`react-server-only-context` offers a basic solution for data sharing within React Server Components, but due to these differences, its behavior cannot fully align with `React.createContext`.

## Contributing

Contributions are welcome via GitHub issues and pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
