export interface AccountFeature {
  label: string;
  value: string;
}

export interface AccountTypeData {
  id: string;
  name: string;
  deposit: string;
  isFeatured: boolean;
  isGoldText: boolean;
  price: string;
  schemaDescription: string;
  badge?: string;
  features: AccountFeature[];
}
