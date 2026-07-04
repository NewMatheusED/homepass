import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Transition,
} from "@headlessui/react";
import { Fragment } from "react";

function ChevronUpDownIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path
                fillRule="evenodd"
                d="M12 3a.75.75 0 0 1 .53.22l3.75 3.75a.75.75 0 0 1-1.06 1.06L12 4.81 8.78 8.03a.75.75 0 0 1-1.06-1.06l3.75-3.75A.75.75 0 0 1 12 3Zm-3.22 14.03a.75.75 0 0 1 1.06 0L12 19.19l3.16-3.16a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function CheckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path
                fillRule="evenodd"
                d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.856 3.855 8.49-12.735a.75.75 0 0 1 1.04-.208Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default function Select({
    value,
    onChange,
    options,
    placeholder = "Selecione...",
    className = "",
}) {
    const selected = options.find((option) => option === value);

    return (
        <div className={className}>
            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    <ListboxButton className="relative block w-full cursor-pointer rounded-lg border border-input bg-secondary/60 py-2 pl-3 pr-10 text-left text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40">
                        <span
                            className={
                                selected
                                    ? "block truncate"
                                    : "block truncate text-muted-foreground"
                            }
                        >
                            {selected ?? placeholder}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground">
                            <ChevronUpDownIcon className="h-4 w-4" />
                        </span>
                    </ListboxButton>

                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-popover py-1 shadow-lg focus:outline-none">
                            {options.map((option) => (
                                <ListboxOption
                                    key={option}
                                    value={option}
                                    className="group relative cursor-pointer select-none py-2 pl-9 pr-4 text-popover-foreground/80 data-[focus]:bg-accent data-[focus]:text-accent-foreground"
                                >
                                    <span className="block truncate group-data-[selected]:font-semibold group-data-[selected]:text-popover-foreground">
                                        {option}
                                    </span>
                                    <span className="absolute inset-y-0 left-0 hidden items-center pl-3 text-primary group-data-[selected]:flex">
                                        <CheckIcon className="h-4 w-4" />
                                    </span>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
}
