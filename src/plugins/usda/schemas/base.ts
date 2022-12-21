export interface Model<T = string> {
    _id: string;
    _type: T;
    _createdAt?: string;
    _updatedAt?: string;
}

export interface ArrayItemBase {
    _key: string;
}