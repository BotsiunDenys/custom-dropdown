import { useState } from "react";
import s from "./Dropdown.module.css";
import OutsideClickChecker from "../OutsideClickChecker/OutsideClickChecker";

interface Props {
  className?: string;
  label: string;
  dropdownList: React.ReactNode[] | string[];
  value?: string | null;
  onChange?: (value: string | null) => void;
  searchFunction?: (
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
                data-value={
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
