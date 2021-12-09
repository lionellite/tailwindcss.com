import clsx from 'clsx'
import { motion, useTransform, useMotionValue } from 'framer-motion'
import { useEffect, useRef } from 'react'

let paddingMap = { none: '', md: 'p-8' }

function Well({
  as: Component = 'div',
  style,
  padding,
  p = 'md',
  className,
  containerClassName,
  html,
  children,
  hint,
}) {
  let paddingKey = padding ?? p
  let paddingClassName = paddingMap[paddingKey]

  if (paddingClassName === undefined) {
    throw Error(`Invalid padding value: ${JSON.stringify(paddingKey)}`)
  }

  return (
    <div className={containerClassName}>
      {hint !== undefined && (
        <div className="not-prose mb-4 flex space-x-2">
          <svg
            className="flex-none w-5 h-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m9.813 9.25.346-5.138a1.276 1.276 0 0 0-2.54-.235L6.75 11.25 5.147 9.327a1.605 1.605 0 0 0-2.388-.085.018.018 0 0 0-.004.019l1.98 4.87a5 5 0 0 0 4.631 3.119h3.885a4 4 0 0 0 4-4v-1a3 3 0 0 0-3-3H9.813ZM3 5s.35-.47 1.25-.828m9.516-.422c2.078.593 3.484 1.5 3.484 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-gray-700 text-sm font-medium">{hint}</p>
        </div>
      )}
      <Component
        style={{ backgroundPosition: '10px 10px', ...style }}
        className="not-prose relative bg-grid-gray-100 bg-gray-50 rounded-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 opacity-60" />
        <div
          className={clsx('relative rounded-xl overflow-auto', paddingClassName, className)}
          {...(html ? { dangerouslySetInnerHTML: { __html: html } } : { children })}
        />
        <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl" />
      </Component>
    </div>
  )
}

export function Example(props) {
  if (props.resizable) {
    return <ResizableExample {...props} />
  }

  return <Well {...props} />
}

function ResizableExample(props) {
  let containerRef = useRef()
  let x = useMotionValue(0)
  let constraintsRef = useRef()
  let handleRef = useRef()

  useEffect(() => {
    const observer = new window.ResizeObserver(() => {
      x.set(0)
    })
    observer.observe(containerRef.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    handleRef.current.onselectstart = () => false
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <Well as={motion.div} style={{ marginRight: useTransform(x, (x) => -x) }} {...props} />
      <div
        ref={constraintsRef}
        className="absolute inset-y-0 right-[-1.375rem] left-80 ml-4 pointer-events-none"
      >
        <motion.div
          ref={handleRef}
          drag="x"
          _dragX={x}
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={constraintsRef}
          className="pointer-events-auto absolute top-1/2 right-0 -mt-6 p-2 hidden md:block cursor-ew-resize"
          style={{ x }}
          onDragStart={() => {
            document.documentElement.classList.add('dragging-ew')
          }}
          onDragEnd={() => {
            document.documentElement.classList.remove('dragging-ew')
          }}
        >
          <div className="w-1.5 h-8 bg-gray-500/60 rounded-full" />
        </motion.div>
      </div>
    </div>
  )
}
