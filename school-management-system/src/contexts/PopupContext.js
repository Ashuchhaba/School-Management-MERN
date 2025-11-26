import React, { createContext, useState, useContext } from 'react';
import PopupModal from '../components/PopupModal';

const PopupContext = createContext();

export const usePopup = () => {
  return useContext(PopupContext);
};

export const PopupProvider = ({ children }) => {
  const [popupConfig, setPopupConfig] = useState({
    isVisible: false,
    message: '',
    type: 'alert', // 'alert' or 'confirm'
    onConfirm: null,
  });

  const showPopup = (message) => {
    setPopupConfig({
      isVisible: true,
      message: message,
      type: 'alert',
      onConfirm: null,
    });
  };

  const showConfirm = (message, onConfirm) => {
    setPopupConfig({
      isVisible: true,
      message: message,
      type: 'confirm',
      onConfirm: onConfirm,
    });
  };

  const hidePopup = () => {
    setPopupConfig({
      isVisible: false,
      message: '',
      type: 'alert',
      onConfirm: null,
    });
  };

  return (
    <PopupContext.Provider value={{ showPopup, showConfirm }}>
      {children}
      <PopupModal
        config={popupConfig}
        onClose={hidePopup}
      />
    </PopupContext.Provider>
  );
};
