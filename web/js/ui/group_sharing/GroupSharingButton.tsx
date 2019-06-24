/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import Button from 'reactstrap/lib/Button';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {Popover} from 'reactstrap';
import {DatastoreCapabilities} from '../../datastore/Datastore';
import {GroupSharingControl} from './GroupSharingControl';
import {Doc} from '../../metadata/Doc';
import {DocRefs} from '../../datastore/sharing/db/DocRefs';
import {FirebaseDatastores} from '../../datastore/FirebaseDatastores';
import {GroupDatastores} from '../../datastore/sharing/GroupDatastores';
import {Toaster} from '../toaster/Toaster';

class Styles {

    public static dropdownChevron: React.CSSProperties = {

        display: 'inline-block',
        width: 0,
        height: 0,
        marginLeft: '.255em',
        verticalAlign: '.255em',
        borderTop: '.3em solid',
        borderRight: '.3em solid transparent',
        borderBottom: 0,
        borderLeft: '.3em solid transparent',
        color: 'var(--secondary)'

    };

    public static shareControlButtonParent: React.CSSProperties = {

        // position: 'absolute',
        // top: '90px',
        // right: '50px',
        // zIndex: 10,

        // marginLeft: '5px'

    };

}

export class GroupSharingButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.doGroupProvision = this.doGroupProvision.bind(this);

        this.onDone = this.onDone.bind(this);

        this.state = {
            open: false,
        };

    }

    public render() {

        return (

            <div style={Styles.shareControlButtonParent}
                 className="mr-1 ml-1">

                <Button color="primary"
                        id="share-control-button"
                        size="sm"
                        disabled={this.props.disabled}
                        hidden={this.props.hidden}
                        onClick={() => this.toggle(true)}
                        style={{fontSize: '15px'}}
                        className="pl-2 pr-2 p-1">

                    <div style={{display: 'flex',
                        marginTop: 'auto',
                        marginBottom: 'auto'}}>

                        <div className="mt-auto mb-auto">
                            Share
                        </div>

                        <div className="mt-auto mb-auto">
                            <span className="text-white" style={Styles.dropdownChevron}/>
                        </div>

                    </div>

                </Button>

                <Popover trigger="legacy"
                         placement="bottom"
                         isOpen={this.state.open}
                         toggle={() => this.toggle(false)}
                         target="share-control-button"
                         className=""
                         style={{
                             minWidth: '400px',
                             maxWidth: '600px'
                         }}>

                    <PopoverBody className="shadow">

                        <GroupSharingControl onDone={() => this.onDone()}/>

                    </PopoverBody>

                </Popover>

            </div>

        );

    }

    private toggle(open: boolean) {
        this.setState({...this.state, open});
    }

    private onDone() {
        console.log("onDone...");

        this.toggle(false);
        this.props.onDone();

        this.doGroupProvision()
            .catch(err => Toaster.error("Could not provision group: " + err.message));

    }

    private async doGroupProvision() {

        const docMeta = this.props.doc.docMeta;
        const fingerprint = docMeta.docInfo.fingerprint;

        const docID = FirebaseDatastores.computeDocMetaID(fingerprint);
        const docRef = DocRefs.fromDocMeta(docID, docMeta);

        const message = "no message for now";
        const to = ['alice@example.com'];

        Toaster.info("Sharing document with users ... ");

        await GroupDatastores.provision({
            key: fingerprint,
            visibility: 'private',
            docs: [docRef],
            invitations: {
                message,
                to
            }
        });

        Toaster.success("Document shared successfully");

    }

}

interface IProps {

    readonly doc: Doc;

    readonly datastoreCapabilities: DatastoreCapabilities;

    readonly onDone: () => void;

    readonly disabled?: boolean;

    readonly hidden?: boolean;

}

interface IState {
    readonly open: boolean;
}