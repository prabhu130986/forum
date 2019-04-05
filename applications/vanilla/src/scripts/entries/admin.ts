/*
 * @copyright 2009-2019 Vanilla Forums Inc.
 * @license GPL-2.0-only
 */

import { onReady, onContent } from "@library/utility/appUtils";

onReady(handleImageUploadInputDisplay);


function handleImageUploadInputDisplay() {
    const imageUploadEnabled = document.getElementById("Form_ImageUpload-dot-Limits-dot-Enabled") as HTMLInputElement;

    if (imageUploadEnabled) {
        const displayClass = "dimensionsDisabled";
        const imageUploadDimensions = [].slice.call(document.getElementsByClassName("ImageUploadLimitsDimensions"));

        if (imageUploadEnabled.checked) {
            imageUploadDimensions.forEach((input) => {
                input.classList.remove(displayClass);
            });
        }

        imageUploadDimensions.forEach((input) => {
            input.addEventListener("click", () => {
                if (imageUploadEnabled.checked) {
                    input.classList.remove(displayClass);
                } else {
                    input.classList.add(displayClass);
                }
            });
        });
    }
}