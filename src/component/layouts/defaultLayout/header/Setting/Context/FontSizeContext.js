import React, { createContext, useState, useContext } from 'react';

const FontSizeContext = createContext();

export const useFontSize = () => useContext(FontSizeContext);

export const FontSizeProvider = ({ children }) => {
    const [fontSize, setFontSize] = useState('medium'); // Default font size

    const changeFontSize = (size) => {
        if (['small', 'medium', 'large'].includes(size)) {
            setFontSize(size);
        }
    };

    return (
        <FontSizeContext.Provider value={{ fontSize, changeFontSize }}>
            {children}
        </FontSizeContext.Provider>
    );
};
