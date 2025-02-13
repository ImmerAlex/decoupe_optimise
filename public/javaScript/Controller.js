import ChuteController from "./controller/ChuteController.js";
import ProfileController from "./controller/ProfileController.js";
import ProfileStore from "./store/ProfileStore.js";
class Controller {
    constructor(chuteController, profileController) {
        this.chuteController = chuteController;
        this.profileController = profileController;
    }
    run() {
        this.chuteController.addToChuteList();
        console.log(ProfileStore.getProfile());
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const controller = new Controller(new ChuteController(), new ProfileController());
    controller.run();
});
