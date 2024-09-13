import { useState } from "react";
import s from "./Dropdown.module.css";
import OutsideClickChecker from "../OutsideClickChecker/OutsideClickChecker";

interface Props {
  className?: string; // for customizing dropdown
  label: string; // placeholder for dropdown
  dropdownList: React.ReactNode[] | string[]; // values that can be either string or component
  value?: string | null; // value by default (as in default select)
  onChange?: (value: string | null) => void; // onChange fn (as in default select)
  searchFunction?: (
    // custom search fn
    searchValue: string,
    setDropdownValues: React.Dispatch<
      React.SetStateAction<React.ReactNode[] | string[]>
    >
  ) => void;
}

const Dropdown = ({
  className,
  label,
  dropdownList,
  searchFunction,
  value = null,
  onChange,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(value);
  const [dropdownValues, setDropdownValues] = useState<
    React.ReactNode[] | string[]
  >(dropdownList);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (searchValue.length) {
      // calls custom search fn if it is passed or filters values if not
      if (searchFunction) {
        searchFunction(e.target.value, setDropdownValues);
        return;
      } else {
        const filteredArray = dropdownList.filter((item) => {
          const value: string =
            typeof item === "string" ? item : (item as any).props["data-value"];
          return value
            .toLowerCase()
            .includes(e.target.value.toLocaleLowerCase());
        });
        setDropdownValues(filteredArray);
      }
    }
  };

  const handleSelectItem = (
    item: string | React.ReactNode,
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    let value: string | null = null;
    // sets value of selected element is it is component - gets value from data-value attribute
    if (typeof item === "string") {
      value = item;
    } else {
      value = e.currentTarget.getAttribute("data-value");
    }

    if (value) {
      setSelected(value);
      if (onChange) {
        onChange(value);
      }
    }

    setIsOpen(false);
  };

  return (
    /* outsideclickchecker used for closing dropdown if it is out of focus */
    <OutsideClickChecker actionFn={() => setIsOpen(false)}>
      <div
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${s.dropdown} ${className ? className : ""} ${
          isOpen ? s.toggledDropdown : ""
        }`}
      >
        <span className={s.label}>{selected ? selected : label}</span>
        <ul onClick={(e) => e.stopPropagation()} className={s.dropdownList}>
          <input
            value={searchValue}
            onChange={handleSearch}
            placeholder="Пошук..."
            type="text"
            className={s.input}
          />
          {dropdownValues.length ? (
            dropdownValues.map((item, index) => (
              <li
                data-value={ // setting data value attribute in case we have component as option
                  typeof item === "string"
                    ? item
                    : (item as any).props["data-value"]
                }
                onClick={(e) => handleSelectItem(item, e)}
                key={index}
                className={s.listItem}
              >
                <span className={s.listItemContent}>{item}</span>
              </li>
            ))
          ) : (
            <p className={s.emptyMessage}>Список порожній</p>
          )}
        </ul>
      </div>
    </OutsideClickChecker>
  );
};

export default Dropdown;
