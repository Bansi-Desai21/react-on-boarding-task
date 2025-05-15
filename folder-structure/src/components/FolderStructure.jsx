import { useState } from "react";
import InputField from "./InputField";
import PrintStructure from "./PrintStructure";

export default function FolderStructure() {
  const [showInput, setShowInput] = useState(false);
  const [folderStructure, setFolderStructure] = useState([]);
  const initialInput = {
    name: "",
    type: "",
    id: "",
    parentId: "",
    children: [],
  };
  const [input, setInput] = useState(initialInput);
  const [showOptions, setShowOptions] = useState(false);
  const [showInputField, setInputField] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [parentId, setParentId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInput((prev) => ({
      ...prev,
      [name]: value,
      id: Math.random().toString(36).substring(2, 9),
      type: selectedType,
      parentId: parentId,
    }));
  };

  const handleClick = (type) => {
    setShowInput(true);
    setSelectedType(type);
    setInputField(false);
  };

  const handleCancel = () => {
    setShowInput(false);
    setInputField(false);
    setInput("");
  };

  const handleSave = () => {
    setShowInput(false);

    const addChild = (nodes) => {
      if (parentId) {
        return nodes.map((node) => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...(node.children || []), input],
            };
          }

          if (node.children && node.children.length > 0) {
            return {
              ...node,
              children: addChild(node.children),
            };
          }
          return node;
        });
      }

      return [...nodes, input];
    };

    setFolderStructure((prev) => addChild(prev));

    setInputField(false);
    setInput(initialInput);
  };

  const handleMinus = (id) => {
    const removeChild = (nodes, removeId) => {
      return nodes
        .filter((node) => node.id !== removeId)
        .map((node) => ({
          ...node,
          children: removeChild(node.children || [], removeId),
        }));
    };

    setFolderStructure((prev) => {
      return removeChild(prev, id);
    });

    setInput(initialInput);
    setParentId("");
  };

  const handleAddNewItem = (type) => {
    setSelectedType(type);
    setInputField(true);
  };

  const handleAdd = (id) => {
    setShowOptions(!showOptions);
    setParentId(id);
  };

  return (
    <>
      <div className="px-4">
        <header className="bg-slate-800 py-4 px-6 rounded-md shadow-md">
          <h1 className="text-white text-2xl font-semibold tracking-wide">
            Folder Structure
          </h1>
        </header>

        <div className="px-4 py-6 space-y-4">
          <div>
            <button
              onClick={() => handleClick("folder")}
              className="bg-slate-700 text-white px-5 py-2 rounded-md shadow hover:bg-slate-600 transition-colors duration-200"
            >
              Add Folder To Root
            </button>
          </div>

          {showInput && (
            <div className="ml-6 mt-2">
              <InputField
                handleChange={handleChange}
                handleCancel={handleCancel}
                handleSave={handleSave}
                input={input}
                selectedType={selectedType}
              />
            </div>
          )}
          {folderStructure && folderStructure.length > 0 && (
            <PrintStructure
              folderStructure={folderStructure}
              handleMinus={handleMinus}
              handleAddNewItem={handleAddNewItem}
              handleAdd={handleAdd}
              showOptions={showOptions}
              handleChange={handleChange}
              handleCancel={handleCancel}
              handleSave={handleSave}
              input={input}
              selectedType={selectedType}
              showInputField={showInputField}
              parentId={parentId}
            />
          )}
        </div>
      </div>
    </>
  );
}
