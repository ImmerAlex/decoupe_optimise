class ChuteController {
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
class DataTableController {
    constructor() {
        this.dataTableContainer = document.getElementById("data-table-container");
        this.tableProjectName = document.getElementById("table-project-name");
    }
    setData(data) {
        this.data = data;
    }
    render() {
        var _a;
        if (!this.data) {
            return;
        }
        console.log(JSON.stringify(this.data, null, 2));
        this.tableProjectName.textContent = this.data.project;
        while (this.tableProjectName.nextSibling) {
            (_a = this.tableProjectName.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.tableProjectName.nextSibling);
        }
        this.data.data.forEach((elt, index) => {
            const result = `
                <table>
                    <thead>
                        <tr>
                            <td class="num-bar">Barre ${index + 1}</td>
                            <td>Source</td>
                            <td>Taille ref</td>
                            <td>Longueur</td>
                            <td>Cadre</td>
                        </tr>
                    </thead>
                    <tbody>
                        ${elt.cuts.map(cut => `
                            <tr>
                                <td></td>
                                <td>${elt.source === 'chute' ? elt.source : 'profilé référence'}</td>
                                <td>${elt.sourceSize}</td>
                                <td>${cut.size}</td>
                                <td>${cut.cadre}</td>
                            </tr>
                        `).join('')}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Chute restant</td>
                            <td>${elt.remaining}</td>
                        </tr>
                    </tbody>
                </table>`;
            this.dataTableContainer.insertAdjacentHTML('beforeend', result);
        });
    }
}
class ProfileController {
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
        const lastChute = this.container
            .lastElementChild;
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
            const longueur = longueurInput.value !== "" ? Number.parseInt(longueurInput.value) : 0;
            const multiplicateur = multiplicateurInput.value !== ""
                ? Number.parseInt(multiplicateurInput.value)
                : 0;
            const cadre = cadreInput ? cadreInput.value : "";
            if (longueur <= 0 || multiplicateur <= 0)
                return;
            for (let i = 0; i < multiplicateur; i++) {
                ProfileStore.addProfile(new Profile(longueur, 1, cadre));
            }
        });
    }
}
class Controller {
    constructor(chuteController, profileController, dataTableController) {
        this.chuteController = chuteController;
        this.profileController = profileController;
        this.dataTableController = dataTableController;
    }
    run() {
        ProfileStore.clearProfileList();
        this.chuteController.addToChuteList();
        this.profileController.addToProfileList();
        ProfileStore.sortBy("priority", "desc");
        const result = this.optimizeCuts();
        this.dataTableController.setData(result);
        this.dataTableController.render();
    }
    optimizeCuts() {
        const projectNameInput = document.getElementById("project-name");
        const baseSizeInput = document.getElementById("base-size");
        const baseSize = parseFloat(baseSizeInput.value);
        const profiles = ProfileStore.getProfile();
        const result = {
            project: projectNameInput.value,
            baseSize: baseSize,
            data: [],
        };
        // Séparer les chutes (priority 10) des profiles normaux
        const chutes = profiles.filter((p) => p.priority === 10);
        let remainingProfiles = profiles.filter((p) => p.priority !== 10);
        // D'abord, essayer d'utiliser les chutes
        for (const chute of chutes) {
            const cutResult = this.optimizeCutForSource(chute.longeur, remainingProfiles);
            if (cutResult.cuts.length > 0) {
                result.data.push({
                    source: "chute",
                    sourceSize: chute.longeur,
                    cuts: cutResult.cuts,
                    remaining: cutResult.remaining,
                });
                // Mettre à jour les profiles restants
                remainingProfiles = this.removeUsedProfiles(remainingProfiles, cutResult.cuts);
            }
        }
        // Ensuite, utiliser les barres de référence pour les profiles restants
        while (remainingProfiles.length > 0) {
            const cutResult = this.optimizeCutForSource(baseSize, remainingProfiles);
            result.data.push({
                source: "baseSize",
                sourceSize: baseSize,
                cuts: cutResult.cuts,
                remaining: cutResult.remaining,
            });
            remainingProfiles = this.removeUsedProfiles(remainingProfiles, cutResult.cuts);
        }
        return result;
    }
    optimizeCutForSource(sourceSize, profiles) {
        const result = {
            cuts: [],
            remaining: sourceSize,
        };
        // Tri des profiles par taille décroissante pour optimiser l'utilisation
        const sortedProfiles = [...profiles].sort((a, b) => b.longeur - a.longeur);
        for (const profile of sortedProfiles) {
            if (profile.longeur <= result.remaining) {
                result.cuts.push({
                    size: profile.longeur,
                    cadre: profile.cadre,
                });
                result.remaining -= profile.longeur;
            }
        }
        return result;
    }
    removeUsedProfiles(profiles, usedCuts) {
        const remainingProfiles = [...profiles];
        for (const cut of usedCuts) {
            const index = remainingProfiles.findIndex((p) => p.longeur === cut.size && p.cadre === cut.cadre);
            if (index !== -1) {
                remainingProfiles.splice(index, 1);
            }
        }
        return remainingProfiles;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    var _a;
    const controller = new Controller(new ChuteController(), new ProfileController(), new DataTableController());
    (_a = document
        .getElementById("calc-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => controller.run());
});
class Profile {
    constructor(longeur, priority, cadre) {
        this.longeur = longeur;
        this.priority = priority;
        this.cadre = cadre;
    }
}
class ProfileStore {
    static addProfile(profile) {
        if (!this.profileList.includes(profile)) {
            this.profileList.push(profile);
        }
    }
    static clearProfileList() {
        this.profileList = [];
    }
    static getProfile() {
        return this.profileList;
    }
    static sortBy(sortBy, order) {
        this.profileList.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) {
                return order === "asc" ? -1 : 1;
            }
            if (a[sortBy] > b[sortBy]) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    }
    static getByName(name) {
        return this.profileList.find((profile) => profile.cadre === name);
    }
}
ProfileStore.profileList = [];