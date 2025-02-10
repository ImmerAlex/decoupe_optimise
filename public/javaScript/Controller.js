import ChuteController from "./controller/ChuteController.js";
import ProfileController from "./controller/ProfileController.js";
class Controller {
    constructor(chuteController, profileController) {
        this.chuteController = chuteController;
        this.profileController = profileController;
    }
    run() {
        console.log('Controller run');
    }
}
const controller = new Controller(new ChuteController(), new ProfileController());
const calc_btn = document.getElementById('calc-btn');
calc_btn === null || calc_btn === void 0 ? void 0 : calc_btn.addEventListener('click', controller.run);
