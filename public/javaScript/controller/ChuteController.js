import Profile from "../data/Profile.js";
import ChuteStore from "../store/ProfileStore.js";
export default class ChuteController {
    constructor() {
        this.content = document.getElementById("content-chutes");
        this.addChuteElement = document.getElementById("add-chute");
        this.supprChuteElement = document.getElementById("suppr-chute");
        this.setEventListener();
    }
    setEventListener() {
        this.addChuteElement.addEventListener("click", this.addChute.bind(this));
        this.supprChuteElement.addEventListener("click", this.supprChute.bind(this));
    }
    /**
     * Add a chute view to the container from data-prototype
     */
    addChute() {
        const prototype = this.content.getAttribute("data-prototype");
        const index = this.content.children.length;
        const newForm = prototype === null || prototype === void 0 ? void 0 : prototype.replace(/__name__/g, index.toString());
        this.content.insertAdjacentHTML("beforeend", newForm ? newForm : "");
    }
    supprChute() {
        const lastChute = this.content.lastElementChild;
        if (lastChute) {
            this.content.removeChild(lastChute);
        }
    }
    addToChuteList() {
        const chutes = document.querySelectorAll("#content-chutes .chute");
        chutes.forEach((chute, index) => {
            const lengthInput = chute.querySelector(`#chute\\[${index}\\]`);
            const multiplierInput = chute.querySelector(`#multChute\\[${index}\\]`);
            const length = Number.parseInt(lengthInput.value);
            const multiplier = Number.parseInt(multiplierInput.value);
            if (length <= 0 || multiplier <= 0)
                return;
            for (let i = 0; i < multiplier; i++) {
                ChuteStore.addProfile(new Profile(length, 10, "chute"));
            }
        });
    }
}
