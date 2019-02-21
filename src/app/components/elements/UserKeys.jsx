import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QRCode from 'react-qr';
import tt from 'counterpart';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import Keys from 'app/components/elements/Keys';
import * as globalActions from 'app/redux/GlobalReducer';

const keyTypes = ['Posting', 'Active', 'Owner', 'Memo'];

class UserKeys extends Component {
    static propTypes = {
        // HTML
        account: PropTypes.object.isRequired,
        // Redux
        isMyAccount: PropTypes.bool.isRequired,
        wifShown: PropTypes.bool,
        setWifShown: PropTypes.func.isRequired,
    };
    constructor() {
        super();
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'UserKeys');
        this.state = {};
        this.onKey = {};
        keyTypes.forEach(key => {
            this.onKey[key] = (wif, pubkey) => {
                this.setState({ [key]: { wif, pubkey } });
            };
        });
    }
    componentWillUpdate(nextProps, nextState) {
        const { wifShown, setWifShown } = nextProps;
        let hasWif = false;
        keyTypes.forEach(key => {
            const keyObj = nextState[key];
            if (keyObj && keyObj.wif) hasWif = true;
        });
        if (wifShown !== hasWif) setWifShown(hasWif);
    }
    render() {
        const { props: { account, isMyAccount } } = this;
        const { onKey } = this;
        let idx = 0;

        // do not render if account is not loaded or available
        if (!account) return null;

        // do not render if state appears to contain only lite account info
        if (!account.has('vesting_shares')) return null;

        const wifQrs = keyTypes.map(key => {
            const keyObj = this.state[key];
            if (!keyObj) return null;
            return (
                <span key={idx++}>
                    <hr />
                    <div className="row">
                        <div className="column small-2">
                            <label>{tt('userkeys_jsx.public')}</label>
                            <QRCode text={keyObj.pubkey} />
                        </div>
                        <div className="column small-8">
                            <label>
                                {tt('userkeys_jsx.public_something_key', {
                                    key,
                                })}
                            </label>
                            <div className="overflow-ellipsis">
                                <code>
                                    <small>{keyObj.pubkey}</small>
                                </code>
                            </div>
                            {keyObj.wif && (
                                <div>
                                    <label>
                                        {tt(
                                            'userkeys_jsx.private_something_key',
                                            { key }
                                        )}
                                    </label>
                                    <div className="overflow-ellipsis">
                                        <code>
                                            <small>{keyObj.wif}</small>
                                        </code>
                                    </div>
                                </div>
                            )}
                        </div>
                        {keyObj.wif && (
                            <div className="column small-2">
                                <label>{tt('userkeys_jsx.private')}</label>
                                <QRCode text={keyObj.wif} />
                            </div>
                        )}
                    </div>
                </span>
            );
        });

        return (
            <div className="UserKeys row">
                <div style={{ paddingBottom: 10 }} className="column small-12">
                    <Keys
                        account={account}
                        authType="posting"
                        onKey={onKey.Posting}
                    />
                    <span className="secondary">
                        {tt(
                            'userkeys_jsx.posting_key_is_required_it_should_be_different'
                        )}
                    </span>
                </div>

                <div style={{ paddingBottom: 10 }} className="column small-12">
                    <Keys
                        account={account}
                        authType="active"
                        onKey={onKey.Active}
                    />
                    <span className="secondary">
                        {tt(
                            'userkeys_jsx.the_active_key_is_used_to_make_transfers_and_place_orders'
                        )}
                    </span>
                </div>

                <div style={{ paddingBottom: 10 }} className="column small-12">
                    <Keys
                        account={account}
                        authType="owner"
                        onKey={onKey.Owner}
                    />
                    <span className="secondary">
                        {tt(
                            'userkeys_jsx.the_owner_key_is_required_to_change_other_keys'
                        )}
                        <br />
                        {tt(
                            'userkeys_jsx.the_private_key_or_password_should_be_kept_offline'
                        )}
                    </span>
                </div>

                <div style={{ paddingBottom: 10 }} className="column small-12">
                    <Keys
                        account={account}
                        authType="memo"
                        onKey={onKey.Memo}
                    />
                    <span className="secondary">
                        {tt(
                            'userkeys_jsx.the_memo_key_is_used_to_create_and_read_memos'
                        )}
                    </span>
                </div>

                <hr />
                <div className="column small-12">
                    {wifQrs && <span>{wifQrs}</span>}
                </div>
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const { account } = ownProps;
        const isMyAccount =
            state.user.getIn(['current', 'username'], false) ===
            account.get('name');
        const wifShown = true || state.global.get('UserKeys_wifShown');

        return { ...ownProps, isMyAccount, wifShown };
    },
    dispatch => ({
        setWifShown: shown => {
            dispatch(globalActions.receiveState({ UserKeys_wifShown: shown }));
        },
    })
)(UserKeys);
