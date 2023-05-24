import React, { useState } from "react";
import "./style.css";

const Dropdown = ({ params }) => {
  // deconstruct params
  const [projectNameArray, parentCallback] = params;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItem] = useState(projectNameArray);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleProjectNameChange = (name) => {
    parentCallback(name);
  };

  if (Array.isArray(projectNameArray) && projectNameArray.length != 0) {
    const handleItemClick = (id) => {
      selectedItem == id ? setSelectedItem(null) : setSelectedItem(id);
    };

    return (
      <div className="dropdown">
        <div className="dropdown-header" onClick={toggleDropdown}>
          <div className="font-bold">ARCHIVE INTO</div>
          {selectedItem
            ? items.find((item) => item.id == selectedItem).projectName
            : "Select Project"}
          <i className={`fa fa-chevron icon ${isOpen && "open"}`}>{"🡲"}</i>
        </div>
        <div className={`dropdown-body ${isOpen && "open"}`}>
          {items.map((item) => (
            <div
              key={item.projectName}
              className="dropdown-item"
              onClick={(e) => {
                handleItemClick(e.target.id);
                handleProjectNameChange(item.projectName);
              }}
              id={item.id}
            >
              <span
                className={`dropdown-item-dot ${
                  item.id == selectedItem && "selected"
                }`}
              >
                {"> "}
              </span>
              {item.projectName}
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default Dropdown;
