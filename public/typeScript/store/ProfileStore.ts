import Profile from "../data/Profile.js";

export default class ProfileStore {
    private static profileList: Array<Profile> = [];

    static addProfile(profile: Profile): void {
        if (!this.profileList.includes(profile)) {
            this.profileList.push(profile);
        }
    }

    static clearProfileList(): void {
        this.profileList = [];
    }

    static getProfile(): Profile[] {
        return this.profileList;
    }

    static sortBy(sortBy: keyof Profile, order: string): void {
        this.profileList.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) {
                return order === "asc" ? -1 : 1;
            }
            if (a[sortBy] > b[sortBy]) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    }

    static getByName(name: string): Profile | undefined {
        return this.profileList.find((profile) => profile.cadre === name);
    }
}
