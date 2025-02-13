import Profile from "../data/Profile.js";
import ProfileStore from "../store/ProfileStore.js";

export default class ProfileController {
	private container: HTMLElement;
	private addProfileButton: HTMLButtonElement;
	private suppressProfileButton: HTMLButtonElement;

	constructor() {
		this.container = document.getElementById(
			"container-profile"
		) as HTMLElement;
		this.addProfileButton = document.getElementById(
			"add-profile"
		) as HTMLButtonElement;
		this.suppressProfileButton = document.getElementById(
			"suppress-profile"
		) as HTMLButtonElement;

		this.setEventListener();
	}

	private setEventListener(): void {
		this.addProfileButton.addEventListener("click", this.addChute.bind(this));
		this.suppressProfileButton.addEventListener(
			"click",
			this.supprChute.bind(this)
		);
	}

	/**
	 * Add a profile view to the container from data-prototype
	 */
	private addChute(): void {
		const prototype = this.container.getAttribute("data-prototype");
		const index = this.container.children.length;
		const newForm = prototype?.replace(/__name__/g, index.toString());
		this.container.insertAdjacentHTML("beforeend", newForm ? newForm : "");
	}

	private supprChute(): void {
		const lastChute: HTMLElement = this.container
			.lastElementChild as HTMLElement;
		if (lastChute) {
			this.container.removeChild(lastChute);
		}
	}

	addToProfileList(): void {
		const profileList = this.container.querySelectorAll(
			".profile"
		) as NodeListOf<HTMLElement>;

		profileList.forEach((profile: HTMLElement, index: number) => {
			const longueurInput = profile.querySelector(
				`#profile\\[${index}\\]`
			) as HTMLInputElement;

			const multiplicateurInput = profile.querySelector(
				`#multProfile\\[${index}\\]`
			) as HTMLInputElement;

			const cadreInput = profile.querySelector(
				`#cadre\\[${index}\\]`
			) as HTMLInputElement;

			const longueur: number =
				longueurInput.value !== "" ? Number.parseInt(longueurInput.value) : 0;

			const multiplicateur: number =
				multiplicateurInput.value !== ""
					? Number.parseInt(multiplicateurInput.value)
					: 0;

			const cadre: string = cadreInput ? cadreInput.value : "";

			if (longueur <= 0 || multiplicateur <= 0) return;

			ProfileStore.addProfile(new Profile(longueur, multiplicateur, 1, cadre));
		});
	}
}
