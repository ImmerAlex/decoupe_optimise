import ChuteController from "./controller/ChuteController.js";
import ProfileController from "./controller/ProfileController.js";
import Profile from "./data/Profile.js";
import ProfileStore from "./store/ProfileStore.js";

class Controller {
	private chuteController: ChuteController;
	private profileController: ProfileController;

	constructor(
		chuteController: ChuteController,
		profileController: ProfileController
	) {
		this.chuteController = chuteController;
		this.profileController = profileController;
	}

	run(): void {
		this.chuteController.addToChuteList();
		this.profileController.addToProfileList();

		ProfileStore.sortBy("priority", "desc");

        console.log(
            ProfileStore.getByName("chute")
        );

        // TODO: Ajouter le calcul d'optimisation du nombre de barre à découper en prenant en priorité les chutes
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const controller: Controller = new Controller(
		new ChuteController(),
		new ProfileController()
	);

	document
		.getElementById("calc-btn")
		?.addEventListener("click", controller.run.bind(controller));
});
