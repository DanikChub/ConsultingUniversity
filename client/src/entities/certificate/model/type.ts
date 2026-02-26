// entities/certificate/model/types.ts

import type {User} from "../../user/model/type";
import type {Program} from "../../program/model/type";

export type CertificateStatus =
    | 'pending_contact'
    | 'contacted'
    | 'waiting_delivery'
    | 'shipped'
    | 'picked_up'
    | 'delivered';

export type DeliveryType = 'post' | 'pickup' | null;

export interface Certificate {
    id: number;
    enrollmentId: number;

    certificate_number: string;

    status: CertificateStatus;

    delivery_type: DeliveryType;

    address: string | null;
    tracking_number: string | null;

    issued_at: string | null;

    createdAt: string;
    updatedAt: string;

    // если include с бэка
    enrollment?: {
        id: number;
        user?: User;
        program?: Program;
    };
}
