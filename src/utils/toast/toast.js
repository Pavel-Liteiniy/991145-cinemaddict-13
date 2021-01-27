import "./toast.css";

const SHOW_TIME = 5000;

const toastContainer = document.createElement(`div`);
toastContainer.classList.add(`toast-container`);
document.body.append(toastContainer);

const toast = (message) => {
  const toastElement = document.createElement(`div`);
  toastElement.textContent = message;
  toastElement.classList.add(`toast-item`);

  toastContainer.append(toastElement);

  setTimeout(() => {
    toastElement.remove();
  }, SHOW_TIME);
};

export {toast};
