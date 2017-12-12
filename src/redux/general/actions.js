/* action types and creators */

export const SET_LICENSE_AGREED = 'SET_LICENSE_AGREED';

export function set_license_agreed(version) {
    return { type: SET_LICENSE_AGREED, version }
}
