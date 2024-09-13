import { useState } from "react";
import Dropdown from "./components/Dropdown/Dropdown";
import s from "./App.module.css";

const textList = ["Item 1", "Item 2", "Item 3"];

const customListItems = textList.map((el, index) => (
  <span
    data-value={el} // data value attribute is set for having string value if we pass component as option
    style={{
      color: "red",
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    }}
  >
    <span>custom el {index}</span>
    {el}
  </span>
));

const App = () => {
  const [firstDropdownValue, setFirstDropdownValue] = useState<string | null>(
    customListItems[0].props["data-value"]
  );
  const [secondDropdownValue, setSecondDropdownValue] = useState<string | null>(
    null
  );

  // simulation of async function for custom search
  const customSearch = (
    searchValue: string,
    setDropdownValues: React.Dispatch<
      React.SetStateAction<React.ReactNode[] | string[]>
    >
  ) => {
    setTimeout(() => {
      const filteredArray = customListItems.filter((item) => {
        const value: string =
          typeof item === "string" ? item : (item as any).props["data-value"];
        return value.toLowerCase().includes(searchValue);
      });
      setDropdownValues(filteredArray);
    }, 2000);
  };

  return (
    <main className={s.wrapper}>
      <section className={s.dropdownsWrapper}>
        <div className={s.block}>
          <h2>Custom</h2>
          <Dropdown
            className={s.customDropdown}
            searchFunction={customSearch}
            label="Оберіть ваше місто"
            dropdownList={customListItems}
            value={firstDropdownValue}
            onChange={setFirstDropdownValue}
          />
          <p>value: {firstDropdownValue}</p>
        </div>
        <div className={s.block}>
          <h2>Default</h2>
          <Dropdown
            label="Оберіть ваш регіон"
            dropdownList={textList}
            value={secondDropdownValue}
            onChange={setSecondDropdownValue}
          />
          <p>value: {secondDropdownValue}</p>
        </div>
      </section>
    </main>
  );
};

export default App;
