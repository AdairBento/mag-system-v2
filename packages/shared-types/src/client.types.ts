export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: DocumentType;
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export interface CreateClientPayload {
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: DocumentType;
}

export interface UpdateClientPayload extends Partial<CreateClientPayload> {
  status?: ClientStatus;
}
