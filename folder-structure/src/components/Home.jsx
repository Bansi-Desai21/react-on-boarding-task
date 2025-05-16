import { useEffect, useState } from "react";
import InputField from "./InputField";

export default function Home() {
  const [showInput, setShowInput] = useState(false);
  const [folderStructure, setFolderStructure] = useState([]);
  const initialInput = {
    value: "",
    type: "",
    parent: "",
  };
  const [input, setInput] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [showInputField, setInputField] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [parentId, setParentId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://folder-structure-api.onrender.com/"
      );
      const data = await response.json();
      setFolderStructure(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClick = (type) => {
    setShowInput(true);
    setSelectedType(type);
    setInputField(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInput((prev) => ({
      ...prev,
      [name]: value,
      ...(parentId && {
        type: selectedType,
        parent: parentId,
      }),
    }));
  };

  const handleSave = async () => {
    try {
      if (parentId) {
        await fetch("https://folder-structure-api.onrender.com/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });
      } else {
        setShowInput(false);
        await fetch(
          "https://folder-structure-api.onrender.com/initialize-root",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
          }
        );
      }
      setInputField(false);
      setInput(initialInput);
      await fetchData();
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleCancel = () => {
    setShowInput(false);
    setInputField(false);
    setInput(initialInput);
  };
  const handleMinus = async (id) => {
    try {
      await fetch(`https://folder-structure-api.onrender.com/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await fetchData();
    } catch (error) {
      console.error("Error occurs in deleting items");
    }

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

  function printStructure(folderStructure) {
    return folderStructure.map((item) => (
      <div key={item._id} className="ml-4">
        {" "}
        <div className="flex items-center group px-2 py-1 rounded-md relative">
          {item.type === "folder" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 50 50"
              className="text-gray-500"
              fill="currentColor"
            >
              <path d="M 5 4 C 3.346 4 2 5.346 2 7 L 2 13 L 3 13 L 47 13 L 48 13 L 48 11 C 48 9.346 46.654 8 45 8 L 18.044922 8.0058594 C 17.765922 7.9048594 17.188906 6.9861875 16.878906 6.4921875 C 16.111906 5.2681875 15.317 4 14 4 L 5 4 z M 3 15 C 2.448 15 2 15.448 2 43 C 2 44.657 3.343 46 5 46 L 45 46 C 46.657 46 48 44.657 48 43 L 48 16 C 48 15.448 47.552 15 47 15 L 3 15 z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 50 50"
              className="text-gray-500"
              fill="currentColor"
            >
              <path d="M 30.398438 2 L 7 2 L 7 48 L 43 48 L 43 14.601563 Z M 30 15 L 30 4.398438 L 40.601563 15 Z"></path>
            </svg>
          )}

          <p className="ml-3 text-gray-800 font-medium">{item.value}</p>

          <div className="ml-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div
              className="p-1 rounded-md hover:bg-gray-200 cursor-pointer transition-colors relative"
              onClick={() => handleAdd(item._id)}
            >
              {item.type === "folder" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              )}

              {showOptions && (
                <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-md shadow-md w-32 z-10">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleAddNewItem("file")}
                  >
                    📄 File
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleAddNewItem("folder")}
                  >
                    📁 Folder
                  </button>
                </div>
              )}
            </div>

            <div
              className="p-1 rounded-md hover:bg-gray-200 cursor-pointer transition-colors"
              onClick={() => handleMinus(item._id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </div>
          </div>
        </div>
        {showInputField && item._id == parentId && (
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
        {item.children &&
          item.children.length > 0 &&
          printStructure(item.children)}
      </div>
    ));
  }
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
          {folderStructure &&
            folderStructure.length > 0 &&
            printStructure(folderStructure)}
        </div>
      </div>
    </>
  );
}
