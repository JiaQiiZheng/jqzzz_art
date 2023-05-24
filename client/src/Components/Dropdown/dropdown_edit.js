import React, { useState } from "react";
import "./style.css";

const Dropdown = ({ params }) => {
  // deconstruct params
  const [projectNameArray, selectedProjectName, parentCallback] = params;
  const [items, setItem] = useState(projectNameArray);

  console.log(selectedProjectName);
  var currentProjectNameId = null;
  if (selectedProjectName) {
    currentProjectNameId = projectNameArray.find(
      (item) => item.projectName === selectedProjectName
    ).id;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(currentProjectNameId);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleProjectNameChange = (name) => {
    parentCallback(name);
  };

  if (Array.isArray(projectNameArray) && projectNameArray.length != 0) {
    const handleItemClick = (id) => {
      selectedItem == id ? setSelectedItem(null) : setSelectedItem(id);
      setIsOpen(!isOpen);
    };

    return (
      <div className="dropdown">
        <div className="dropdown-header" onClick={toggleDropdown}>
          <div className="font-bold">ARCHIVE INTO</div>
          {selectedItem != null
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
