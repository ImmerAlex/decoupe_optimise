import ChuteController from "./controller/ChuteController.js";
import ProfileController from "./controller/ProfileController.js";
import Profile from "./data/Profile";

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
        const chutes: Profile[] = this.chuteController.get();

    }
}


const controller: Controller = new Controller(
    new ChuteController(),
    new ProfileController()
);

const calc_btn: HTMLElement | null = document.getElementById('calc-btn');
calc_btn?.addEventListener('click', controller.run)