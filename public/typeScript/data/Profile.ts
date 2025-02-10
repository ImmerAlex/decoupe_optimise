export default class Profile {
    private longeur: number;
    private multiple: number;
    private priorite: number;
    private cadre: string;

    constructor(
        longeur: number,
        multiple: number,
        priorite: number,
        cadre: string,
    ) {
        this.longeur = longeur;
        this.multiple = multiple;
        this.priorite = priorite;
        this.cadre = cadre;
    }
}
