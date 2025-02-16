import { useState } from "react";

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
