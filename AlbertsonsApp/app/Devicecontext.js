import React, { createContext, useState, useContext } from "react";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
    const [deviceData, setDeviceData] = useState(null);

    return (
        <DeviceContext.Provider value={{ deviceData, setDeviceData }}>
            {children}
        </DeviceContext.Provider>
    );
};

export const useDevice = () => useContext(DeviceContext);
