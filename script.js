"use strict";
// const btnAddQuestion = document.querySelector("#btn_add_question");
// const inpQuestion = document.querySelector("#question");
// function addQuestion() {
//   inpQuestion.classList.remove("hidden");
//   inpQuestion.focus();
//   btnAddQuestion.classList.add("hidden");
// }
// btnAddQuestion.onclick = addQuestion;

const draggable = document.querySelectorAll(".draggable");
const draggableContainer = document.querySelectorAll(".draggable-container");

draggable.forEach((draggable) => {
  //Desktop Drag end drop Version
  draggable.addEventListener("dragstart", () => {
    draggable.classList.add("dragging");
  });
  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });

  //Mobile Drag end drop Version
  draggable.addEventListener("touchstart", () => {
    draggable.classList.add("dragging");
  });
  draggable.addEventListener("touchend", () => {
    draggable.classList.remove("dragging");
  });
});

draggableContainer.forEach((container) => {
  //Desktop Drag end drop Version
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });

  //Mobile Drag end drop Version
  container.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElementMobile(container, e.changedTouches[0].screenY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
});

//Function for desktop drag drop
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}

//Function for mobile drag drop
function getDragAfterElementMobile(container, y) {
  const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - 110 - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}
