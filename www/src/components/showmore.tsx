import { useState } from "preact/hooks"

export const ShowMore = ({ id, className,type='blue'}:{
  id: string
  className?: string
  type?: string
}) => {
  const [showMore, setShowMore] = useState(false)
  return (
    <button
      onClick={() =>{
        const element = document.querySelectorAll(`.extended-list-${id}`)
        if (!element.length) return
        element.forEach((el) => {
          showMore? el.classList.add('hidden') :
          el.classList.remove('hidden')
        })
        setShowMore(!showMore)
      }}
      className={ className }
      >
        <svg style={{
          fill: type === 'blue' ? '#003DA6' : '#000000',
          transform: showMore ? 'rotate(180deg)' : 'rotate(0deg)'
        }} width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.5 4.94619L11.1 0.346191L12.1537 1.39994L6.5 7.05369L0.846247 1.39994L1.9 0.346191L6.5 4.94619Z" />
        </svg>
        <span>
          {showMore ? 'Show Less' : 'Show More'}
        </span>
    </button>)
}
