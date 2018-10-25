/**
 * @author Adam Charron <adam.c@vanillaforums.com>
 * @copyright 2009-2018 Vanilla Forums Inc.
 * @license GPL-2.0-only
 */

import React from "react";
import { connect } from "react-redux";
import UsersModel, { IInjectableUserState } from "@library/users/UsersModel";
import { LoadStatus } from "@library/@types/api";
import UsersActions, { IInjectableUsersActions } from "@library/users/UsersActions";

interface IProps extends IInjectableUserState, IInjectableUsersActions {
    permission: string | string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Component for checking one or many permissions.
 *
 * Conditionally renders either it's children or a fallback based on if the user has a permission.
 */
export class Permission extends React.Component<IProps> {
    public render(): React.ReactNode {
        return this.hasPermission() ? this.props.children : this.props.fallback || null;
    }

    /**
     * Trigger fetching of data if it hasn't already occurred.
     */
    public componentDidMount() {
        if (this.props.currentUser.status === LoadStatus.PENDING) {
            void this.props.usersActions.getMe();
        }
    }

    /**
     * Determine if the user has one of the given permissions.
     *
     * - Always false if the data isn't loaded yet.
     * - Always true if the user has the admin flag set.
     * - Only 1 one of the provided permissions needs to match.
     */
    private hasPermission(): boolean {
        const { currentUser, permission } = this.props;
        let lookupPermissions = permission;
        if (!Array.isArray(lookupPermissions)) {
            lookupPermissions = [lookupPermissions];
        }

        return (
            currentUser.status === LoadStatus.SUCCESS &&
            (currentUser.data.isAdmin || this.arrayContainsOneOf(lookupPermissions, currentUser.data.permissions))
        );
    }

    /**
     * Check if an a haystack contains 1 of the passed needles.
     *
     * @param needles The strings to check for.
     * @param haystack The place to look for them.
     */
    private arrayContainsOneOf(needles: string[], haystack: string[]) {
        return needles.some(val => haystack.indexOf(val) >= 0);
    }
}

const withRedux = connect(
    UsersModel.mapStateToProps,
    UsersActions.mapDispatch,
);

export default withRedux(Permission);
