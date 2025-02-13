import ChuteController from "./controller/ChuteController.js";
import ProfileController from "./controller/ProfileController.js";
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
        console.log(
            ProfileStore.getProfile()
        );
        
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const controller: Controller = new Controller(
        new ChuteController(),
        new ProfileController()
    );
    
    controller.run();
});