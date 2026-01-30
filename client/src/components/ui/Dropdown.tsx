import { useState, useRef, useEffect } from "react";

interface Program {
    id: number;
    img?: string | null;
    short_title: string;
    title: string;
    price: number;
}

interface Props {
    filteredPrograms: Program[];
    handleSelectProgram: (program: Program) => void;
    selectedProgram?: Program;
}

export default function Dropdown({selectedProgram, filteredPrograms, handleSelectProgram }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<Program | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setSelected(selectedProgram)
        console.log(selectedProgram)
    }, [selectedProgram])

    const toggle = () => setOpen((prev) => !prev);

    const onSelect = (p: Program) => {
        setSelected(p);
        handleSelectProgram(p);
        setOpen(false);
    };

    // Закрытие по клику вне
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="w-full relative ml-[30px]" ref={dropdownRef}>
            {/* Кнопка */}
            <button
                type="button"
                className="w-full border border-gray-300 rounded-md p-2 flex items-center justify-between bg-white hover:bg-gray-50"
                onClick={toggle}
            >
                <span className="flex items-center gap-2">
                    {selected ? (
                        <>
                            <img
                                src={selected.img ? `${process.env.REACT_APP_API_URL}${selected.img}` : ""}
                                alt=""
                                className="w-12 h-10 object-cover rounded"
                            />

                            <div className="flex flex-col text-start">
                                <span className="font-medium">{selected.short_title}</span>
                                <span className="text-sm text-gray-500">{selected.title}</span>
                            </div>


                        </>
                    ) : (
                        <span className="text-gray-400">Выберите программу</span>
                    )}
                </span>

                <span className="text-gray-500">{open ? "▲" : "▼"}</span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-50 animate-fadeIn">
                    {filteredPrograms.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => onSelect(p)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <img
                                src={p.img ? process.env.REACT_APP_API_URL + p.img : ""}
                                alt=""
                                className="w-12 h-10 object-cover rounded"
                            />

                            <div className="flex flex-col">
                                <span className="font-medium">{p.short_title}</span>
                                <span className="text-sm text-gray-500">{p.title}</span>
                            </div>

                            <div className="ml-auto text-gray-700 font-semibold">
                                {p.price} ₽
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}