import React, { useState } from "react";
import "./style.css";

const Dropdown = ({ params }) => {
  // deconstruct params
  const [projectNameArray, parentCallback] = params;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItem] = useState(projectNameArray);
  const [newName, setNewName] = useState("");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleProjectNameChange = (name) => {
    parentCallback(name);
  };

  const handleCreateNew = () => {
    projectNameArray.push({
      id: projectNameArray.length,
      projectName: newName,
    });
    setNewName("");
    console.log(projectNameArray);
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
          {selectedItem
            ? items.find((item) => item.id == selectedItem).projectName
            : "Select Stack"}
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
          {/* create new */}
          <div className="dropdown-createNew">
            <div className="createNew">
              <input
                className="createNew_input"
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
                placeholder="Create New Stack"
              />
              <div className="icon_add" onClick={handleCreateNew}>
                <link
                  rel="stylesheet"
                  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
                />
                <span className="material-symbols-outlined">add_circle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Dropdown;
