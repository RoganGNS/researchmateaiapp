// File: /components/ui/VisuallyHidden.tsx (Alternative with asChild support)
import * as React from 'react'

interface VisuallyHiddenProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Visually hides content while keeping it accessible to screen readers
 * Alternative implementation with Slot pattern for asChild
 */
export function VisuallyHidden({ 
  children, 
  asChild = false,
  className,
  style,
}: VisuallyHiddenProps) {
  const hiddenStyles: React.CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
    ...style,
  }
  
  if (asChild && React.isValidElement(children)) {
    // Type assertion for the child element
    const child = children as React.ReactElement<{ 
      style?: React.CSSProperties;
      className?: string;
    }>
    
    return React.cloneElement(child, {
      style: {
        ...hiddenStyles,
        ...child.props.style,
      },
      className: className 
        ? child.props.className 
          ? `${child.props.className} ${className}`
          : className
        : child.props.className,
    })
  }
  
  return (
    <span 
      style={hiddenStyles}
      className={className}
    >
      {children}
    </span>
  )
}