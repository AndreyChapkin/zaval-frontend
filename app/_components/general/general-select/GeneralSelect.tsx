import { MouseEventHandler, useState } from "react";

import './GeneralSelect.scss';

export type OptionDescription = {
    label: string;
    classNames?: string;
    imageUrl?: string;
};

export interface GeneralSelectProps<T> {
    allElements: T[];
    currentElement: T;
    selectHandler: (element: T) => void;
    mapper: (element: T) => OptionDescription;
}

function CreateOptionContent(description: OptionDescription) {
    return (
        <>
            {
                description.imageUrl &&
                <img
                    src={description.imageUrl}
                    alt="img"
                />
            }
            <span>{description.label}</span>
        </>
    );
}

export function GeneralSelect<T>({ currentElement, allElements: elements, mapper, selectHandler }: GeneralSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [optionsGeometry, setOptionsGeometry] = useState({
        y: 0,
        width: 0,
    });

    const currentDescription = mapper(currentElement);

    const openHandler: MouseEventHandler = (e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const y = rect.bottom + window.scrollY;
        const width = rect.width;
        setOptionsGeometry({
            y,
            width,
        });
        setIsOpen(!isOpen);
    };

    const createInnerSelectHandler = (element: T) => () => {
        setIsOpen(false);
        selectHandler(element);
    };

    return (
        <>
            {
                isOpen &&
                <div
                    className="generalSelectBackground"
                    onClick={() => setIsOpen(false)}
                />
            }
            <div className={`generalSelect ${isOpen ? 'aboveBackground' : ''}`}>
                <div
                    onClick={openHandler}
                    className={`option currentOption ${currentDescription.classNames ?? ''}`}
                >
                    {CreateOptionContent(currentDescription)}
                </div>
                {
                    isOpen &&
                    <div
                        className="allOptions"
                        style={{ top: `${optionsGeometry.y}px`, width: `${optionsGeometry.width}px` }}
                    >
                        {elements
                            .filter((element) => element !== currentElement)
                            .map((element) => {
                                const description = mapper(element);
                                return (
                                    <div
                                        className={`option ${description.classNames ?? ''}`}
                                        onClick={createInnerSelectHandler(element)}
                                    >
                                        {CreateOptionContent(description)}
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div >
        </>

    );
};
