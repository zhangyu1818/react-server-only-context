import * as React from 'react'

export interface ServerOnlyContextProviderProps<T> {
  value: T
  children?: React.ReactNode
}

export interface ServerOnlyContext<T> {
  Provider: (props: ServerOnlyContextProviderProps<T>) => React.ReactNode
}

interface InternalServerOnlyContext<T> extends ServerOnlyContext<T> {
  _currentValue: () => { current: T }
}

export function createServerOnlyContext<T>(defaultValue: T) {
  const value = React.cache(() => ({
    current: defaultValue,
  }))

  function Provider(props: ServerOnlyContextProviderProps<T>) {
    value().current = props.value
    return props.children
  }

  const context: InternalServerOnlyContext<T> = {
    Provider,
    _currentValue: value,
  }

  return context as ServerOnlyContext<T>
}

export function readContext<T>(context: ServerOnlyContext<T>) {
  const _currentValue = (
    context as InternalServerOnlyContext<T>
  )._currentValue()
  return _currentValue.current
}
