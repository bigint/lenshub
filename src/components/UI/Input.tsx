import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { ComponentProps, forwardRef, ReactNode, useId } from 'react'

import { FieldError } from './Form'

const HelpTooltip = dynamic(() => import('./HelpTooltip'))

interface Props extends Omit<ComponentProps<'input'>, 'prefix'> {
  label?: string
  prefix?: string | ReactNode
  leftIcon?: ReactNode
  className?: string
  helper?: ReactNode
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  {
    label,
    prefix,
    type = 'text',
    leftIcon,
    error,
    className = '',
    helper,
    ...props
  },
  ref
) {
  const id = useId()

  return (
    <label className="w-full" htmlFor={id}>
      {label && (
        <div className="flex items-center mb-1 space-x-1.5">
          <div className="font-medium text-gray-800 dark:text-gray-200">
            {label}
          </div>
          <HelpTooltip content={helper} />
        </div>
      )}
      <div className="flex">
        {prefix && (
          <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 rounded-l-xl border border-r-0 border-gray-300 dark:bg-gray-900 dark:border-gray-700/80">
            {prefix}
          </span>
        )}
        <div
          className={clsx(
            { '!border-red-500': error },
            { 'rounded-r-xl': prefix },
            { 'rounded-xl': !prefix },
            {
              'opacity-60 bg-gray-500 bg-opacity-20': props.disabled
            },
            'flex items-center pl-3 border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700/80 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-400 w-full'
          )}
        >
          <input
            id={id}
            className={clsx(
              { 'placeholder-red-500': error },
              { 'rounded-r-xl': prefix },
              { 'rounded-xl': !prefix },
              'peer border-none focus:ring-0 outline-none bg-transparent w-full',
              className
            )}
            type={type}
            ref={ref}
            {...props}
          />
          <span
            className={clsx(
              { '!text-red-500 [&>*]:peer-focus:!text-red-500': error },
              'order-first text-zinc-500 [&>*]:peer-focus:text-brand-500 [&>*]:h-6'
            )}
          >
            {leftIcon}
          </span>
        </div>
      </div>
      {props.name && <FieldError name={props.name} />}
    </label>
  )
})
