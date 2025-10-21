'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }
const normalizeText = function (text) { return text.trim().toLowerCase(); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    const category = normalizeText(filterItems[i].dataset.category);

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    const rawValue = this.dataset.selectValue || this.innerText;
    const selectedValue = normalizeText(rawValue);
    const selectedLabel = this.dataset.selectLabel || this.innerText;
    if (selectValue) { selectValue.innerText = selectedLabel; }
    if (select) { elementToggleFunc(select); }
    filterFunc(selectedValue);

  });
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn.length > 0 ? filterBtn[0] : null;

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    const rawValue = this.dataset.filterTarget || this.innerText;
    const selectedValue = normalizeText(rawValue);
    const selectedLabel = this.dataset.filterLabel || this.innerText;
    if (selectValue) { selectValue.innerText = selectedLabel; }
    filterFunc(selectedValue);

    if (lastClickedBtn) { lastClickedBtn.classList.remove("active"); }
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



const copyButtons = document.querySelectorAll("[data-copy-btn]");
const copyToast = document.querySelector("[data-copy-toast]");
const copyToastMessage = copyToast ? copyToast.querySelector("[data-copy-toast-message]") : null;
const copyToastSubtext = copyToast ? copyToast.querySelector("[data-copy-toast-subtext]") : null;
const copyToastCloseBtn = copyToast ? copyToast.querySelector("[data-copy-toast-close]") : null;
let copyToastTimerId = null;
const tiltedCards = document.querySelectorAll("[data-tilted-card]");

const writeToClipboard = async function (text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise(function (resolve, reject) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (successful) {
        resolve();
      } else {
        reject(new Error("Copy command was unsuccessful"));
      }
    } catch (error) {
      document.body.removeChild(textarea);
      reject(error);
    }
  });
};

const hideCopyToast = function () {
  if (!copyToast) { return; }
  if (copyToastTimerId) {
    clearTimeout(copyToastTimerId);
    copyToastTimerId = null;
  }
  copyToast.classList.remove("is-visible");
  copyToast.classList.remove("is-error");
  copyToast.setAttribute("aria-hidden", "true");
};

const showCopyToast = function (message, subtext, isError) {
  if (!copyToast) { return; }

  if (copyToastTimerId) {
    clearTimeout(copyToastTimerId);
    copyToastTimerId = null;
  }

  copyToast.classList.remove("is-error");
  if (isError) {
    copyToast.classList.add("is-error");
  }

  if (copyToastMessage) {
    copyToastMessage.textContent = message;
  }

  if (copyToastSubtext) {
    copyToastSubtext.textContent = subtext;
  }

  copyToast.classList.add("is-visible");
  copyToast.setAttribute("aria-hidden", "false");

  copyToastTimerId = setTimeout(hideCopyToast, 2800);
};

if (copyToastCloseBtn) {
  copyToastCloseBtn.addEventListener("click", hideCopyToast);
}

if (copyToast) {
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && copyToast.classList.contains("is-visible")) {
      hideCopyToast();
    }
  });
}

for (let i = 0; i < copyButtons.length; i++) {
  const button = copyButtons[i];
  const label = button.querySelector(".copy-btn-label");
  const defaultLabel = label ? label.textContent : "";
  let resetTimerId = null;

  button.addEventListener("click", function () {
    const value = button.dataset.copyValue;
    if (!value) { return; }
    const displayLabel = button.dataset.copyLabel || button.dataset.copyValue || value;

    if (resetTimerId) {
      clearTimeout(resetTimerId);
      resetTimerId = null;
    }

    writeToClipboard(value).then(function () {
      button.classList.add("copied");
      if (label) { label.textContent = "Đã sao chép!"; }
      showCopyToast("Đã sao chép", displayLabel, false);
    }).catch(function () {
      if (label) { label.textContent = "Không thể sao chép"; }
      showCopyToast("Sao chép thất bại", "Trình duyệt không cho phép sao chép tự động.", true);
    }).finally(function () {
      resetTimerId = setTimeout(function () {
        button.classList.remove("copied");
        if (label) { label.textContent = defaultLabel; }
      }, 1800);
    });
  });
}



const attachTiltEffect = function (card) {
  const inner = card.querySelector("[data-tilted-inner]");
  if (!inner) { return; }

  const caption = card.querySelector("[data-tilted-caption]");
  const maxRotate = parseFloat(card.dataset.tiltedRotate) || 12;
  const hoverScale = parseFloat(card.dataset.tiltedScale) || 1.08;
  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) { return; }
  const supportsPointer = window.PointerEvent !== undefined;
  const moveEvent = supportsPointer ? "pointermove" : "mousemove";
  const enterEvent = supportsPointer ? "pointerenter" : "mouseenter";
  const leaveEvent = supportsPointer ? "pointerleave" : "mouseleave";

  const isMouseLikeEvent = function (event) {
    if (!supportsPointer) { return true; }
    return !event.pointerType || event.pointerType === "mouse";
  };

  let rafId = null;

  const resetTransform = function () {
    inner.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    if (caption) {
      caption.style.opacity = "0";
      caption.style.transform = "translate3d(18px, 18px, 40px)";
    }
    card.classList.remove("is-hovered");
  };

  const updateTilt = function (event) {
    if (!isMouseLikeEvent(event)) { return; }

    const rect = inner.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const percentX = (offsetX - rect.width / 2) / (rect.width / 2);
    const percentY = (offsetY - rect.height / 2) / (rect.height / 2);
    const rotateX = Math.max(Math.min(percentY * -maxRotate, maxRotate), -maxRotate);
    const rotateY = Math.max(Math.min(percentX * maxRotate, maxRotate), -maxRotate);

    if (rafId) { cancelAnimationFrame(rafId); }
    rafId = requestAnimationFrame(function () {
      inner.style.transform = "perspective(900px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(" + hoverScale + ")";

      if (caption) {
        caption.style.opacity = "1";
        caption.style.transform = "translate3d(" + (offsetX - caption.offsetWidth / 2) + "px, " + (offsetY - caption.offsetHeight / 2) + "px, 60px)";
      }
    });
  };

  const handlePointerEnter = function (event) {
    if (!isMouseLikeEvent(event)) { return; }
    card.classList.add("is-hovered");
    inner.style.transform = "perspective(900px) scale(" + hoverScale + ")";
  };

  const handlePointerLeave = function () {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    resetTransform();
  };

  card.addEventListener(enterEvent, handlePointerEnter);
  card.addEventListener(moveEvent, updateTilt);
  card.addEventListener(leaveEvent, handlePointerLeave);
  if (supportsPointer) {
    card.addEventListener("touchstart", resetTransform, { passive: true });
  }

  resetTransform();
};

for (let i = 0; i < tiltedCards.length; i++) {
  attachTiltEffect(tiltedCards[i]);
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      const target = normalizeText(this.dataset.navTarget || this.innerText);
      const page = normalizeText(pages[i].dataset.page);
      if (target === page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}