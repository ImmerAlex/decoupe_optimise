import Profile from "../data/Profile.js";
import ChuteStore from "../store/ProfileStore.js";

export default class ChuteController {
	private content: HTMLElement;
	private addChuteElement: HTMLElement;
	private supprChuteElement: HTMLElement;

	constructor() {
		this.content = document.getElementById("content-chutes") as HTMLElement;
		this.addChuteElement = document.getElementById("add-chute") as HTMLElement;
		this.supprChuteElement = document.getElementById(
			"suppr-chute"
		) as HTMLElement;

		this.setEventListener();
	}

	private setEventListener(): void {
		this.addChuteElement.addEventListener("click", this.addChute.bind(this));
		this.supprChuteElement.addEventListener(
			"click",
			this.supprChute.bind(this)
		);
	}

	/**
	 * Add a chute view to the container from data-prototype
	 */
	private addChute(): void {
		const prototype = this.content.getAttribute("data-prototype");
		const index = this.content.children.length;
		const newForm = prototype?.replace(/__name__/g, index.toString());
		this.content.insertAdjacentHTML("beforeend", newForm ? newForm : "");
	}

	private supprChute(): void {
		const lastChute: HTMLElement = this.content.lastElementChild as HTMLElement;
		if (lastChute) {
			this.content.removeChild(lastChute);
		}
	}

	addToChuteList(): void {
		const chutes = document.querySelectorAll(
			"#content-chutes .chute"
		) as NodeListOf<HTMLElement>;

		chutes.forEach((chute: HTMLElement, index: number) => {
			const lengthInput = chute.querySelector(
				`#chute\\[${index}\\]`
			) as HTMLInputElement;

			const multiplierInput = chute.querySelector(
				`#multChute\\[${index}\\]`
			) as HTMLInputElement;

            const length: number = Number.parseInt(lengthInput.value);
            const multiplier: number = Number.parseInt(multiplierInput.value);

            if (length <= 0 || multiplier <= 0) return;

			ChuteStore.addProfile(
				new Profile(
					length,
					multiplier,
					10,
					"chute"
				)
			);
		});
	}
}
