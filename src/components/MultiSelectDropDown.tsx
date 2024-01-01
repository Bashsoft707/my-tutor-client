import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";

export const MultiSelectDropdown = ({
  options,
  selected,
  toggleOption,
}: any) => {
  return (
    <div className="c-multi-select-dropdown">
      <div className="c-multi-select-dropdown__selected">
        <div className="text-[#2B2C2F]">{selected.length} selected</div>
      </div>
      <ul className="c-multi-select-dropdown__options">
        {options.map(
          (option: {
            id: any;
            title:
              | string
              | number
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | null
              | undefined;
          }) => {
            const isSelected = selected.includes(option.title);
            return (
              <li
                className="flex items-center py-1"
                onClick={() => toggleOption({ title: option.title })}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  className="mr-2"
                ></input>
                <span className="text-[#343541]">{option.title}</span>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
};
