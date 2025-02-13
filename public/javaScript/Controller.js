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
        this.profileController.addToProfileList();
        ProfileStore.sortBy("priority", "desc");
        console.log(ProfileStore.getByName("chute"));
    }
}
document.addEventListener("DOMContentLoaded", () => {
    var _a;
    const controller = new Controller(new ChuteController(), new ProfileController());
    (_a = document
        .getElementById("calc-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", controller.run.bind(controller));
});
