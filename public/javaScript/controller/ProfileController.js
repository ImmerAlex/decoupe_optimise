import Profile from "../data/Profile.js";
import ProfileStore from "../store/ProfileStore.js";
export default class ProfileController {
    constructor() {
        this.container = document.getElementById("container-profile");
        this.addProfileButton = document.getElementById("add-profile");
        this.suppressProfileButton = document.getElementById("suppress-profile");
        this.setEventListener();
    }
    setEventListener() {
        this.addProfileButton.addEventListener("click", this.addChute.bind(this));
        this.suppressProfileButton.addEventListener("click", this.supprChute.bind(this));
    }
    /**
     * Add a profile view to the container from data-prototype
     */
    addChute() {
        const prototype = this.container.getAttribute("data-prototype");
        const index = this.container.children.length;
        const newForm = prototype === null || prototype === void 0 ? void 0 : prototype.replace(/__name__/g, index.toString());
        this.container.insertAdjacentHTML("beforeend", newForm ? newForm : "");
    }
    supprChute() {
        const lastChute = this.container.lastElementChild;
        if (lastChute) {
            this.container.removeChild(lastChute);
        }
    }
    addToProfileList() {
        const profileList = this.container.querySelectorAll(".profile");
        profileList.forEach((profile, index) => {
            const longueurInput = profile.querySelector(`#profile\\[${index}\\]`);
            const multiplicateurInput = profile.querySelector(`#multProfile\\[${index}\\]`);
            const cadreInput = profile.querySelector(`#cadre\\[${index}\\]`);
            const longueur = longueurInput.value !== '' ? Number.parseInt(longueurInput.value) : 0;
            const multiplicateur = multiplicateurInput.value !== '' ? Number.parseInt(multiplicateurInput.value) : 0;
            const cadre = cadreInput ? cadreInput.value : "";
            console.log(longueur, multiplicateur, cadre);
            if (longueur <= 0 || multiplicateur <= 0)
                return;
            ProfileStore.addProfile(new Profile(longueur, multiplicateur, 1, cadre));
        });
    }
}
