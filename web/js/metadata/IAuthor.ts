import {ProfileIDStr} from "../datastore/sharing/db/Profiles";
import {AuthorImage} from "./Author";

export interface IAuthor {

    /**
     * The name of this author.
     */
    readonly name: string;

    readonly profileID: ProfileIDStr;

    /**
     * The URL to this author's profile.
     */
    readonly url?: string;

    readonly image?: AuthorImage;

    /**
     * True if we're viewing this document as a guest and aren't the primary
     * owner which means we can't mutate it directly.
     */
    readonly guest?: boolean;

}