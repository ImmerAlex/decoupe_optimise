import ChuteController from "./controller/ChuteController.js";
import ProfileController from "./controller/ProfileController.js";
import DataTableController from "./controller/DataTableController.js";
import ProfileStore from "./store/ProfileStore.js";
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
const structFinalExemple = {
    project: "ARASAKA",
    baseSize: 6000,
    data: [
        {
            source: "chute",
            sourceSize: 3000,
            cuts: [
                {
                    size: 2800,
                    cadre: "C3",
                },
            ],
            remaining: 200,
        },
        {
            source: "baseSize",
            sourceSize: 6000,
            cuts: [
                {
                    size: 5000,
                    cadre: "C4",
                },
                {
                    size: 500,
                    cadre: "C4",
                },
            ],
            remaining: 500,
        },
        {
            source: "baseSize",
            sourceSize: 6000,
            cuts: [
                {
                    size: 3100,
                    cadre: "C1",
                },
                {
                    size: 1500,
                    cadre: "C1",
                },
                {
                    size: 1300,
                    cadre: "C2",
                },
            ],
            remaining: 100,
        },
    ],
};
