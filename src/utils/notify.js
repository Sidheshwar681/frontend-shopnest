let eventId = 0;

export const notify = (options) => {
  const detail =
    typeof options === "string" ? { message: options } : { ...options };

  window.dispatchEvent(
    new CustomEvent("app-notify", {
      detail: {
        id: ++eventId,
        type: "info",
        title: "",
        duration: 3200,
        ...detail,
      },
    })
  );
};

export const confirmAction = (options) => {
  const id = ++eventId;

  return new Promise((resolve) => {
    const onResult = (event) => {
      if (event.detail.id !== id) {
        return;
      }

      window.removeEventListener("app-confirm-result", onResult);
      resolve(event.detail.confirmed);
    };

    window.addEventListener("app-confirm-result", onResult);
    window.dispatchEvent(
      new CustomEvent("app-confirm", {
        detail: {
          id,
          type: "warning",
          title: "Are you sure?",
          message: "Please confirm this action.",
          confirmText: "Confirm",
          cancelText: "Cancel",
          ...options,
        },
      })
    );
  });
};
