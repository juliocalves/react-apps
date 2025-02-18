import { useState } from "react";

/**
 * Accordion component that displays a list of items in an expandable/collapsible format.
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.items - The list of items to display in the accordion. Each item should have a `title` and `content`.
 * @param {string|number} props.id - The unique identifier for the accordion, used to generate unique IDs for accessibility.
 *
 * @returns {JSX.Element} The rendered Accordion component.
 */
const Accordion = ({ items, id }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="accordion" id={`accordion-${id}`}>
      {items.map((item, index) => (
        <div className="accordion-item" key={index}>
          <h2 className="accordion-header " id={`heading-${id}-${index}`}>
            <button
              className={`accordion-button  ${activeIndex === index ? "" : "collapsed"}`}
              type="button"
              onClick={() => handleClick(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`collapse-${id}-${index}`}
            >
              {item.title}
            </button>
          </h2>
          <div
            id={`collapse-${id}-${index}`}
            className={`accordion-collapse collapse ${activeIndex === index ? "show" : ""}`}
            aria-labelledby={`heading-${id}-${index}`}
          >
            <div className="accordion-body">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
