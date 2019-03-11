export declare function subscribe(endpoint: string, creds: any, subConfig: any): Promise<any>;
export interface IListFilter {
    webhookContains?: string;
    webhookEquals?: string;
    nameContains?: string;
    nameEquals?: string;
    filterContains?: string;
    filterFromContains?: string;
    filterToContains?: string;
    filterLogAddressContains?: string;
    filterTopicContains?: string;
}
export declare function listSubs(endpoint: string, creds: any, filter?: IListFilter): Promise<any[]>;
export declare function unsubscribe(endpoint: string, creds: any, subId: string): Promise<any>;
export declare function filterSubs(subs: any[], filter: IListFilter): any[];
