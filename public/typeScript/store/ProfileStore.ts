import Profile from "../data/Profile.js";

export default class ProfileStore {
    private static profileList: Array<Profile> = [];

    static addProfile(profile: Profile): void
    {
        if (!(this.profileList.includes(profile)))
        {
            this.profileList.push(profile);
        }
    }

    static getProfile(): Profile[] 
    {
        return this.profileList;
    }
}