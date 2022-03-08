import { PermKeys, Perms, UseUser } from './types';

export const requirePermissions = (user?: UseUser, ...perms: Perms[]): user is UseUser => {
	if (!user) return false;
	if (user.permissions?.admin) {
		return true; // admin can access anything
	}
	return perms.every((perm) => (user.permissions ? user.permissions[perm as PermKeys] : false));
};
