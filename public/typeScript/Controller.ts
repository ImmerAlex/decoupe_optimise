import ChuteController from "./controller/ChuteController.js";
import ProfileController from "./controller/ProfileController.js";
import DataTableController from "./controller/DataTableController.js";
import ProfileStore from "./store/ProfileStore.js";
import Profile from "./data/Profile.js";
import { OptimizationResult } from "./types/Type.js";


class Controller {
	private chuteController: ChuteController;
	private profileController: ProfileController;
	private dataTableController: DataTableController;

	constructor(
		chuteController: ChuteController,
		profileController: ProfileController,
		dataTableController: DataTableController
	) {
		this.chuteController = chuteController;
		this.profileController = profileController;
		this.dataTableController = dataTableController;
	}

	run(): void {
		ProfileStore.clearProfileList();
		this.chuteController.addToChuteList();
		this.profileController.addToProfileList();

		ProfileStore.sortBy("priority", "desc");

		const result = this.optimizeCuts();
		
		this.dataTableController.setData(result);
		this.dataTableController.render();
	}

	private optimizeCuts(): OptimizationResult {
		const projectNameInput = document.getElementById(
			"project-name"
		) as HTMLInputElement;

		const baseSizeInput = document.getElementById(
			"base-size"
		) as HTMLInputElement;

		const baseSize = parseFloat(baseSizeInput.value);

		const profiles = ProfileStore.getProfile();

		const result: OptimizationResult = {
			project: projectNameInput.value,
			baseSize: baseSize,
			data: [],
		};

		// Séparer les chutes (priority 10) des profiles normaux
		const chutes = profiles.filter((p) => p.priority === 10);
		let remainingProfiles = profiles.filter((p) => p.priority !== 10);

		// D'abord, essayer d'utiliser les chutes
		for (const chute of chutes) {
			const cutResult = this.optimizeCutForSource(
				chute.longeur,
				remainingProfiles
			);
			if (cutResult.cuts.length > 0) {
				result.data.push({
					source: "chute",
					sourceSize: chute.longeur,
					cuts: cutResult.cuts,
					remaining: cutResult.remaining,
				});
				// Mettre à jour les profiles restants
				remainingProfiles = this.removeUsedProfiles(
					remainingProfiles,
					cutResult.cuts
				);
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
			remainingProfiles = this.removeUsedProfiles(
				remainingProfiles,
				cutResult.cuts
			);
		}

		return result;
	}

	private optimizeCutForSource(
		sourceSize: number,
		profiles: Profile[]
	): {
		cuts: Array<{ size: number; cadre: string }>;
		remaining: number;
	} {
		const result = {
			cuts: [] as Array<{ size: number; cadre: string }>,
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

	private removeUsedProfiles(
		profiles: Profile[],
		usedCuts: Array<{ size: number; cadre: string }>
	): Profile[] {
		const remainingProfiles = [...profiles];
		for (const cut of usedCuts) {
			const index = remainingProfiles.findIndex(
				(p) => p.longeur === cut.size && p.cadre === cut.cadre
			);
			if (index !== -1) {
				remainingProfiles.splice(index, 1);
			}
		}
		return remainingProfiles;
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const controller = new Controller(
		new ChuteController(),
		new ProfileController(),
		new DataTableController()
	);

	document
		.getElementById("calc-btn")
		?.addEventListener("click", () => controller.run());
});
