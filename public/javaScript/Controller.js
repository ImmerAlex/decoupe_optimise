import ChuteController from "./controller/ChuteController.js";
import ProfileController from "./controller/ProfileController.js";
import ProfileStore from "./store/ProfileStore.js";
class Controller {
    constructor(chuteController, profileController) {
        this.chuteController = chuteController;
        this.profileController = profileController;
    }
    run() {
        ProfileStore.clearProfileList();
        this.chuteController.addToChuteList();
        this.profileController.addToProfileList();
        // Trier les profiles par priorité (chutes en premier, puis par taille décroissante)
        ProfileStore.sortBy("priority", "desc");
        const result = this.optimizeCuts();
        console.log(JSON.stringify(result, null, 2));
    }
    optimizeCuts() {
        const projectNameInput = document.getElementById("project-name");
        const baseSizeInput = document.getElementById("base-size");
        const baseSize = parseFloat(baseSizeInput.value);
        const profiles = ProfileStore.getProfile();
        const result = {
            project: projectNameInput.value,
            baseSize: baseSize,
            data: []
        };
        // Séparer les chutes (priority 10) des profiles normaux
        const chutes = profiles.filter(p => p.priority === 10);
        let remainingProfiles = profiles.filter(p => p.priority !== 10);
        // D'abord, essayer d'utiliser les chutes
        for (const chute of chutes) {
            const cutResult = this.optimizeCutForSource(chute.longeur, remainingProfiles);
            if (cutResult.cuts.length > 0) {
                result.data.push({
                    source: "chute",
                    sourceSize: chute.longeur,
                    cuts: cutResult.cuts,
                    remaining: cutResult.remaining
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
                remaining: cutResult.remaining
            });
            remainingProfiles = this.removeUsedProfiles(remainingProfiles, cutResult.cuts);
        }
        return result;
    }
    optimizeCutForSource(sourceSize, profiles) {
        const result = {
            cuts: [],
            remaining: sourceSize
        };
        // Tri des profiles par taille décroissante pour optimiser l'utilisation
        const sortedProfiles = [...profiles].sort((a, b) => b.longeur - a.longeur);
        for (const profile of sortedProfiles) {
            if (profile.longeur <= result.remaining) {
                result.cuts.push({
                    size: profile.longeur,
                    cadre: profile.cadre
                });
                result.remaining -= profile.longeur;
            }
        }
        return result;
    }
    removeUsedProfiles(profiles, usedCuts) {
        const remainingProfiles = [...profiles];
        for (const cut of usedCuts) {
            const index = remainingProfiles.findIndex(p => p.longeur === cut.size && p.cadre === cut.cadre);
            if (index !== -1) {
                remainingProfiles.splice(index, 1);
            }
        }
        return remainingProfiles;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    var _a;
    const controller = new Controller(new ChuteController(), new ProfileController());
    (_a = document.getElementById("calc-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => controller.run());
});
// const structFinalExemple = {
//     project: "ARASAKA",
//     profileSize: 3000,
//     cadre: {
//         "chute 1": {
//             chuteSize: 1500,
//             data: [
//                 {
//                     cadre: "C1",
//                     size: 500
//                 },
//                 {
//                     cadre: "C1",
//                     size: 800
//                 }
//             ]
//         },
//         "barre 1": [
//             {
//                 cadre: "C1",
//                 size: 1500
//             },
//             {
//                 cadre: "C3",
//                 size: 500
//             },
//             {
//                 cadre: "C1",
//                 size: 500
//             }
//         ]
//         "barre 2": [
//             {
//                 cadre: "C1",
//                 size: 2000
//             },
//             {
//                 cadre: "C3",
//                 size: 1000
//             },
//         ]
//         ...
//     }
// }
