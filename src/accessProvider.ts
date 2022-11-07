import { AccessControlProvider } from "@pankod/refine-core";
import { Constants } from './helpers/constants';


const hasPermission = (role: any) => {
    const data = localStorage.getItem(Constants.AUTH_KEY);

    if (data) {
        const user = JSON.parse(data);

        if (user.roles.indexOf(role) !== -1) {
            return true;
        }
    }

    return false;
}

export const accessControlProvider: AccessControlProvider = {


    can: async ({ resource, action, params }) => {

        let can = false;
        let reason = "Unauthorized";

        switch (resource) {
            case 'users':
                can = hasPermission('ROLE_ADMIN');
                break;

            default:
                break;
        }

        return Promise.resolve({ can: can, reason: reason });
    },
};
